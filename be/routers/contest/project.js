const express = require('express')
const lk = require('../../lib/lookups')
const libContest = require('../../lib/contest')
const logger = require('../../lib/logger')
const persistence = require('../../lib/persistence')
const router = express.Router({mergeParams: true})

const mw = {
    auth: require('../../lib//auth').middleware,
    validateFile: require('../middleware/validate-file')
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
    res.status(lk.http.badRequest).send({error: `missing ${param}`})
}

const voteTime = (vote) => new Date(vote.ts).getTime()

const sortingModes = { // all descending
    trend: (a, b) => Math.max(...b.votes.map(voteTime)) - Math.max(...a.votes.map(voteTime)),
    date:  (a, b) => new Date(b.submitted).getTime() - new Date(a.submitted).getTime(),
    rank:  (a, b) => b.votes.length - a.votes.length
}

function getProjectByQuery(req, res) {
    const contestId = req.params.contestId
    if (!contestId) {
        return missingParam(res, 'contest id')
    }
    if (req.query && req.query.user) {
        const userId = req.query.user
        persistence.getProjectByUser(contestId, userId).then(project => {
            if (!project) {
                return res.status(lk.http.notFound).send({error: 'project not found'})
            }
            res.status(lk.http.ok).send({project: project})
        }).catch(err => {
            logger.error(err)
            res.status(lk.http.internalError).send({error: err})
        })
    } else { // list projects from given contest
        const cmp = req.query ? sortingModes[req.query.sort] : undefined
        persistence.getProjectsByContest(contestId).then(lst => {
            res.status(lk.http.ok).send({projects: cmp ? lst.sort(cmp) : lst})
        }).catch(err => {
            logger.error(err)
            res.status(lk.http.internalError).send({error: err})
        })
    }
}

function getProjectById(req, res) {
    const id = req.params.projectId
    const contestId = req.params.contestId
    if (!contestId) {
        return missingParam(res, 'contest id')
    }
    persistence.getProjectById(id).then(project => {
        if (!project || project.contestId != contestId) {
            return res.status(lk.http.notFound).send({error: 'project not found'})
        }
        res.status(lk.http.ok).send({project: project})
    }).catch(err => {
        logger.error(err)
        res.status(lk.http.internalError).send({error: err})
    })
}

const sendfile = (res, file) => {
    res.set('Content-Type', file.mimetype)
    res.set('Last-Modified', file.mtime)
    res.set('Content-Disposition', `attachment; filename="${file.name}"`)
    res.status(lk.http.ok).send(file.data)
}

function getImage(req, res) {
    const contestId = req.params.contestId
    const projectId = req.params.projectId
    persistence.getProjectWithImage(projectId).then(project => {
        if (!project || project.contestId != contestId) {
            return res.status(lk.http.notFound).send({error: 'image not found'})
        }
        sendfile(res, project.image)
    }).catch(err => {
        logger.error(err)
        res.status(lk.http.internalError).send({error: err})
    })
}

function getDeliverable(req, res) {
    const contestId = req.params.contestId
    const projectId = req.params.projectId
    persistence.getProjectWithDeliverable(projectId).then(project => {
        if (!project || project.contestId != contestId) {
            return res.status(lk.http.notFound).send({error: 'deliverable not found'})
        }
        sendfile(res, project.deliverable)
    }).catch(err => {
        logger.error(err)
        res.status(lk.http.internalError).send({error: err})
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

function submitProject(req, res) {
    logger.debug('submit project request from:', req.user)
    const newProject = req.project
    persistence.getContestById(req.params.contestId).then(contest => {
        if (!contest || contest.state == lk.contest.state.draft) {
            return res.status(lk.http.notFound).send({error: 'contest not found'})
        }
        if (libContest.getPublicState(contest) != lk.contest.publicState.applying) {
            return res.status(lk.http.preconditionFailed).send({error: 'contest is not open for submissions'})
        }
        if (!newProject.contestId) {
            return missingParam(res, 'contest id')
        }
        if (!newProject.title || !newProject.description) {
            return missingParam(res)
        }
        if (!newProject.deliverable) {
            return missingParam(res, 'deliverable')
        }
        newProject.submitted = newProject.updated
        persistence.submitProject(newProject).then(project => {
            res.status(lk.http.created).send({project: project})
        }).catch(err => {
            if (err.name && err.name === 'SequelizeUniqueConstraintError') {
                return res.status(lk.http.preconditionFailed).send({error: 'user already submitted a project for this contest'})
            }
            logger.error(err)
            res.status(lk.http.internalError).send({error: err})
        })
    }).catch(err => {
        logger.error(err)
        res.status(lk.http.internalError).send({error: err})
    })
}

function updateProject(req, res) {
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
        if (!contest || contest.state == lk.contest.state.draft) {
            return res.status(lk.http.notFound).send({error: 'contest not found'})
        }
        if (libContest.getPublicState(contest) != lk.contest.publicState.applying) {
            return res.status(lk.http.preconditionFailed).send({error: 'contest is not open for submissions'})
        }
        if (!currentProject || currentProject.contestId != contestId) {
            return res.status(lk.http.notFound).send({error: 'project not found'})
        }
        if (currentProject.userId != newProject.userId) {
            return res.status(lk.http.unauthorized).send({error: 'req uid does not match project uid'})
        }
        persistence.updateProject(projectId, newProject).then(project => {
            res.status(lk.http.ok).send({project: project})
        }).catch(err => {
            logger.error(err)
            res.status(lk.http.internalError).send({error: err})
        })
    }).catch(err => {
        logger.error(err)
        res.status(lk.http.internalError).send({error: err})
    })
}

function voteProject(req, res) {
    const contestId = req.params.contestId
    const projectId = req.params.projectId
    const uid = req.user.uid

    Promise.all([
        persistence.getContestById(contestId),
        persistence.getProjectById(projectId)
    ]).then(([contest, project]) => {
        if (!project || project.contestId != contestId) {
            return res.status(lk.http.notFound).send({error: 'project not found'})
        }
        if (libContest.getPublicState(contest) != lk.contest.publicState.voting) {
            return res.status(lk.http.preconditionFailed).send({error: 'contest is not open for voting'})
        }
        if (project.votes.map(vote => vote.userId).includes(uid)) {
            return res.status(lk.http.preconditionFailed).send({error: 'already voted for this project'})
        }
        persistence.voteProject(project, uid).then(() => {
            res.status(lk.http.ok).send()
        }).catch(err => {
            logger.error(err)
            res.status(lk.http.internalError).send({error: err})
        })
    }).catch(err => {
        logger.error(err)
        res.status(lk.http.internalError).send({error: err})
    })
}

module.exports = router
