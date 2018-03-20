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

router.get('/', getProjectList)
router.post('/', mw.validateFile.image, mw.validateFile.deliverable, submitProject)

router.get('/:projectId', getProject)
router.get('/:projectId/image', getImage)
router.get('/:projectId/deliverable', getDeliverable)
router.put('/:projectId/vote', voteProject)

const missingParam = (res, param) => {
    if (!param) {
        param = 'required parameter'
    }
    res.status(lk.http.badRequest).send({error: `missing ${param}`})
}

function getProjectList(req, res) {
    const contestId = req.params.contestId
    if (!contestId) {
        return missingParam(res, 'contest id'
        )
    }
    persistence.getProjectsByContest(contestId).then(lst => {
        res.status(lk.http.ok).send({projects: lst})
    }).catch(err => {
        logger.error(err)
        res.status(lk.http.internalError).send({error: err})
    })
}

function getProject(req, res) {
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

function submitProject(req, res) {
    logger.debug('submit project request from:', req.user)
    persistence.getContestById(req.params.contestId).then(contest => {
        if (!contest || contest.state == lk.contest.state.draft) {
            return res.status(lk.http.notFound).send({error: 'contest not found'})
        }
        if (libContest.getPublicState(contest) != lk.contest.publicState.applying) {
            return res.status(lk.http.preconditionFailed).send({error: 'contest is not open for submissions'})
        }
        const p = {
            contestId: req.params.contestId,
            userId: req.user.uid,
            submitted: new Date(),
            title: req.body.title,
            description: req.body.description
        }
        if (req.body.repoURL) {
            p.repoURL = req.body.repoURL
        }
        if (req.files) {
            if (req.files.deliverable) {
                p.deliverable = req.files.deliverable
                p.deliverable.mtime = new Date()
            }
            if (req.files.image) {
                p.image = req.files.image
                p.image.mtime = new Date()
            }
        }
        if (!p.contestId) {
            return missingParam(res, 'contest id')
        }
        if (!p.title || !p.description) {
            return missingParam(res)
        }
        if (!p.repoURL && !p.deliverable) {
            return missingParam(res, 'repoURL and deliverable')
        }
        persistence.submitProject(p).then(project => {
            res.status(lk.http.created).send({project: project})
        }).catch(err => {
            if (err === lk.error.alreadyExists) {
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
            if (err === lk.error.alreadyExists) {
                return res.status(lk.http.preconditionFailed).send({error: 'already voted for this project'})
            }
            logger.error(err)
            res.status(lk.http.internalError).send({error: err})
        })
    }).catch(err => {
        logger.error(err)
        res.status(lk.http.internalError).send({error: err})
    })
}

module.exports = router
