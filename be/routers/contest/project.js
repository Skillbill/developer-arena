const limits = require('@/lib/config').get().limits
const error = require('@/lib/error')
const http = require('@/lib/http')
const libContest = require('@/lib/contest')
const logger = require('@/lib/logger')
const persistence = require('@/lib/persistence')
const preview = require('@/lib/preview')
const sendfile = require('@/lib/sendfile')
const express = require('express')
const router = express.Router({mergeParams: true})

const mw = {
    auth: require('@/lib/auth').middleware,
    validateFile: require('@/routers/middleware/validate-file')
}

router.post('*', mw.auth)
router.put('*', mw.auth)
router.delete('*', mw.auth)

router.get('/', getProjectByQuery)
router.post('/', mw.validateFile.image, mw.validateFile.deliverable, prepareProject, submitProject)

router.get('/:projectId', getProjectById)
router.put('/:projectId', mw.validateFile.image, mw.validateFile.deliverable, prepareProject, updateProject)
router.get('/:projectId/image', getImage)
router.get('/:projectId/deliverable', getDeliverable)
router.put('/:projectId/preview', createPreview)
router.put('/:projectId/vote', prepareVote, voteProject)
router.delete('/:projectId/vote', prepareVote, undoVoteProject)

const voteTime = (vote) => new Date(vote.ts).getTime()

const sortingModes = { // all descending
    trend: (a, b) => Math.max(...b.votes.map(voteTime)) - Math.max(...a.votes.map(voteTime)),
    date:  (a, b) => new Date(b.submitted).getTime() - new Date(a.submitted).getTime(),
    update: (a, b) => new Date(b.updated).getTime() - new Date(a.updated).getTime(),
    rank:  (a, b) => b.votes.length - a.votes.length
}

function getProjectByQuery(req, res, next) {
    const contestId = req.params.contestId
    if (!contestId) {
        return next(error.new(error.missingParameter, {parameter: 'contestId'}))
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
        return next(error.new(error.missingParameter, {parameter: 'contestId'}))
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

function getImage(req, res, next) {
    const contestId = req.params.contestId
    const projectId = req.params.projectId
    persistence.getProjectWithImage(projectId).then(project => {
        if (!project || project.contestId != contestId) {
            return next(error.imageNotFound)
        }
        sendfile(res, project.image, true)
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
    for (let k of ['repoURL', 'video']) {
        if (req.project[k]) {
            const re = new RegExp(limits[k].acceptedRegex)
            if (!re.test(req.project[k])) {
                return next(error.new(error.invalidUrl, {url: req.project[k]}))
            }
        }
    }
    if (req.files) {
        if (req.files.deliverable) {
            req.project.deliverable = req.files.deliverable
            req.project.deliverable.mtime = new Date()
            req.project.approved = false
            req.project.hasPreview = false
        }
        if (req.files.image) {
            req.project.image = req.files.image
            req.project.image.mtime = new Date()
        }
    }
    next()
}

function submitProject(req, res, next) {
    const newProject = req.project
    persistence.getContestById(req.params.contestId).then(contest => {
        if (!contest || contest.state == libContest.state.draft) {
            return next(error.contestNotFound)
        }
        if (libContest.getPublicState(contest) != libContest.publicState.applying) {
            return next(error.contestNotOpenForSubmission)
        }
        const required = [
            'contestId',
            'title',
            'description',
            'deliverable'
        ]
        for (const k of required) {
            if (!newProject[k]) {
                return next(error.new(error.missingParameter, {parameter: k}))
            }
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
    const userId = req.user.uid
    const contestId = req.params.contestId
    const projectId = req.params.projectId
    const newProject = req.project

    if (!newProject.title) {
        return next(error.new(error.missingParameter, {parameter: 'title'}))
    }
    if (!newProject.description) {
        return next(error.new(error.missingParameter, {parameter: 'description'}))
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
        if (!(userId == currentProject.userId && userId == newProject.userId)) {
            return next(error.uidMismatch)
        }
        persistence.updateProject(projectId, newProject).then(project => {
            if (newProject.deliverable && currentProject.hasPreview) {
                preview.destroy(currentProject).catch(err => {
                    logger.error(`could not destroy old preview for project ${currentProject.id}`, err)
                })
            }
            res.status(http.ok).send({project: project})
        }).catch(err => {
            next(error.new(error.internal, {cause: err}))
        })
    }).catch(err => {
        next(error.new(error.internal, {cause: err}))
    })
}

function createPreview(req, res, next) {
    const userId = req.user.uid
    const projectId = req.params.projectId
    const contestId = req.params.contestId

    Promise.all([
        persistence.getContestById(contestId),
        persistence.getProjectWithDeliverable(projectId)
    ]).then(([contest, project]) => {
        if (!project || project.contestId != contestId) {
            return next(error.projectNotFound)
        }
        if (project.userId != userId) {
            return next(error.uidMismatch)
        }
        if (libContest.getPublicState(contest) != libContest.publicState.applying) {
            return next(error.contestNotOpenForSubmission)
        }
        return preview.create(project).then(result => {
            if (!result) {
                return next(error.previewFailed)
            }
            return persistence.setProjectFlag(project.id, 'hasPreview').then(() => {
                res.status(http.created).send(result)
            })
        })
    }).catch(err => {
        next(error.new(error.internal, {cause: err}))
    })
}

function prepareVote(req, res, next) {
    const contestId = req.params.contestId
    const projectId = req.params.projectId
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
        req.project = project.toJSON()
        next()
    }).catch(err => {
        next(error.new(error.internal, {cause: err}))
    })
}

function voteProject(req, res, next) {
    const uid = req.user.uid
    if (req.project.votes.map(vote => vote.userId).includes(uid)) {
        return next(error.alreadyVotedProject)
    }
    persistence.voteProject(req.project, uid).then(() => {
        res.status(http.noContent).send()
    }).catch(err => {
        next(error.new(error.internal, {cause: err}))
    })
}

function undoVoteProject(req, res, next) {
    const uid = req.user.uid
    persistence.undoVoteProject(req.project, uid).then(() => {
        res.status(http.noContent).send()
    }).catch(err => {
        next(error.new(error.internal, {cause: err}))
    })
}

module.exports = router
