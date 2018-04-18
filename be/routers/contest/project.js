const limits = require('@/limits')
const http = require('@/lib/http')
const libContest = require('@/lib/contest')
const logger = require('@/lib/logger')
const error = require('@/lib/error')
const persistence = require('@/lib/persistence')
const express = require('express')
const router = express.Router({mergeParams: true})

const mw = {
    auth: require('@/lib/auth').middleware,
    validateFile: require('@/routers/middleware/validate-file')
}

router.post('*', mw.auth)
router.put('*', mw.auth)

router.get('/', getProjectByQuery)
router.post('/', mw.validateFile.image, mw.validateFile.deliverable, prepareProject, submitProject)

router.get('/:projectId', getProjectById)
router.put('/:projectId', mw.validateFile.image, mw.validateFile.deliverable, prepareProject, updateProject)
router.get('/:projectId/image', getImage)
router.get('/:projectId/deliverable', getDeliverable)
router.put('/:projectId/vote', voteProject)

const missingParam = (res, param) => {
    if (!param) {
        param = 'required parameter'
    }
    res.status(http.badRequest).send({error: `missing ${param}`})
}

const voteTime = (vote) => new Date(vote.ts).getTime()

const sortingModes = { // all descending
    trend: (a, b) => Math.max(...b.votes.map(voteTime)) - Math.max(...a.votes.map(voteTime)),
    date:  (a, b) => new Date(b.submitted).getTime() - new Date(a.submitted).getTime(),
    rank:  (a, b) => b.votes.length - a.votes.length
}

function getProjectByQuery(req, res, next) {
    const contestId = req.params.contestId
    if (!contestId) {
        return missingParam(res, 'contest id')
    }
    if (req.query && req.query.user) {
        const userId = req.query.user
        persistence.getProjectByUser(contestId, userId).then(project => {
            if (!project) {
                return next(error.projectNotFound)
            }
            res.status(http.ok).send({project: project})
        }).catch(err => {
            return next(error.new(error.internal, {cause: err}))
        })
    } else { // list projects from given contest
        const cmp = req.query ? sortingModes[req.query.sort] : undefined
        persistence.getProjectsByContest(contestId).then(lst => {
            res.status(http.ok).send({projects: cmp ? lst.sort(cmp) : lst})
        }).catch(err => {
            next(error.new(error.internal, {cause: err}))
        })
    }
}

function getProjectById(req, res, next) {
    const id = req.params.projectId
    const contestId = req.params.contestId
    if (!contestId) {
        return missingParam(res, 'contest id')
    }
    persistence.getProjectById(id).then(project => {
        if (!project || project.contestId != contestId) {
            return next(error.projectNotFound)
        }
        res.status(http.ok).send({project: project})
    }).catch(err => {
        next(error.new(error.internal, {cause: err}))
    })
}

const sendfile = (res, file) => {
    res.set('Content-Type', file.mimetype)
    res.set('Last-Modified', file.mtime)
    res.set('Content-Disposition', `attachment; filename="${file.name}"`)
    res.status(http.ok).send(file.data)
}

function getImage(req, res, next) {
    const contestId = req.params.contestId
    const projectId = req.params.projectId
    persistence.getProjectWithImage(projectId).then(project => {
        if (!project || project.contestId != contestId) {
            return next(error.imageNotFound)
        }
        sendfile(res, project.image)
    }).catch(err => {
        next(error.new(error.internal, {cause: err}))
    })
}

function getDeliverable(req, res, next) {
    const contestId = req.params.contestId
    const projectId = req.params.projectId
    persistence.getProjectWithDeliverable(projectId).then(project => {
        if (!project || project.contestId != contestId) {
            return next(error.deliverableNotFound)
        }
        sendfile(res, project.deliverable)
    }).catch(err => {
        next(error.new(error.internal, {cause: err}))
    })
}

function prepareProject(req, res, next) {
    req.project = {
        contestId: req.params.contestId,
        userId: req.user.uid,
        updated: new Date(),
        title: req.body.title,
        description: req.body.description,
        repoURL: req.body.repoURL || null,
        video: req.body.video || null
    }
    if (req.project.video) {
        const re = new RegExp(limits.video.acceptedRegex)
        if (!re.test(req.project.video)) {
            return next(error.new(error.invalidUrl, {url: req.project.video}))
        }
    }
    if (req.files) {
        if (req.files.deliverable) {
            req.project.deliverable = req.files.deliverable
            req.project.deliverable.mtime = new Date()
        }
        if (req.files.image) {
            req.project.image = req.files.image
            req.project.image.mtime = new Date()
        }
    }
    next()
}

function submitProject(req, res, next) {
    logger.debug('submit project request from:', req.user)
    const newProject = req.project
    persistence.getContestById(req.params.contestId).then(contest => {
        if (!contest || contest.state == libContest.state.draft) {
            return next(error.contestNotFound)
        }
        if (libContest.getPublicState(contest) != libContest.publicState.applying) {
            return next(error.contestNotOpenForSubmission)
        }
        if (!newProject.contestId) {
            return next(error.new(error.missingParameter, {parameter: 'contest'}))
        }
        if (!newProject.title) {
            return next(error.new(error.missingParameter, {parameter: 'title'}))
        }
        if (!newProject.description) {
            return next(error.new(error.missingParameter, {parameter: 'description'}))
        }
        if (!newProject.deliverable) {
            return next(error.new(error.missingParameter, {parameter: 'deliverable'}))
        }
        newProject.submitted = newProject.updated
        persistence.submitProject(newProject).then(project => {
            res.status(http.created).send({project: project})
        }).catch(err => {
            if (err.name && err.name === 'SequelizeUniqueConstraintError') {
                next(error.alreadySubmittedProject)
            } else {
                next(error.new(error.internal, {cause: err}))
            }
        })
    }).catch(err => {
        next(error.new(error.internal, {cause: err}))
    })
}

function updateProject(req, res, next) {
    const contestId = req.params.contestId
    const projectId = req.params.projectId
    const newProject = req.project

    if (!newProject.title || !newProject.description) {
        return missingParam(res)
    }
    Promise.all([
        persistence.getContestById(contestId),
        persistence.getProjectById(projectId)
    ]).then(([contest, currentProject]) => {
        if (!contest || contest.state == libContest.state.draft) {
            return next(error.contestNotFound)
        }
        if (libContest.getPublicState(contest) != libContest.publicState.applying) {
            return next(error.contestNotOpenForSubmission)
        }
        if (!currentProject || currentProject.contestId != contestId) {
            return next(error.projectNotFound)
        }
        if (currentProject.userId != newProject.userId) {
            return next(error.uidMismatch)
        }
        persistence.updateProject(projectId, newProject).then(project => {
            res.status(http.ok).send({project: project})
        }).catch(err => {
            next(error.new(error.internal, {cause: err}))
        })
    }).catch(err => {
        next(error.new(error.internal, {cause: err}))
    })
}

function voteProject(req, res, next) {
    const contestId = req.params.contestId
    const projectId = req.params.projectId
    const uid = req.user.uid

    Promise.all([
        persistence.getContestById(contestId),
        persistence.getProjectById(projectId)
    ]).then(([contest, project]) => {
        if (!project || project.contestId != contestId) {
            return next(error.projectNotFound)
        }
        if (libContest.getPublicState(contest) != libContest.publicState.voting) {
            return next(error.contestNotOpenForVoting)
        }
        if (project.votes.map(vote => vote.userId).includes(uid)) {
            return next(error.alreadyVotedProject)
        }
        persistence.voteProject(project, uid).then(() => {
            res.status(http.noContent).send()
        }).catch(err => {
            next(error.new(error.internal, {cause: err}))
        })
    }).catch(err => {
        next(error.new(error.internal, {cause: err}))
    })
}

module.exports = router
