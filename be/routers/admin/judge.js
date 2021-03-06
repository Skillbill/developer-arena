const http = require('@/lib/http')
const persistence = require('@/lib/persistence')
const error = require('@/lib/error')
const express = require('express')
const router = express.Router()

router.get('/', getAllJudges)
router.post('/', createJudge)
router.get('/:judgeId', getJudge)
router.patch('/:judgeId', patchJudge)
router.delete('/:judgeId', deleteJudge)
router.put('/:judgeId/image', updateJudgeImage)
router.delete('/:judgeId/image', updateJudgeImage)

function getAllJudges(req, res, next) {
    persistence.getAllJudges().then(judges => {
        res.status(http.ok).send({judges})
    }).catch(err => {
        next(error.new(error.internal, {cause: err}))
    })
}

function getJudge(req, res, next) {
    const id = req.params.judgeId
    persistence.getJudgeById(id).then(judge => {
        if (!judge) {
            return next(error.judgeNotFound)
        }
        res.status(http.ok).send({judge})
    }).catch(err => {
        next(error.new(error.internal, {cause: err}))
    })
}

function createJudge(req, res, next) {
    const judge = req.body
    if (!judge.name) {
        return next(error.new(error.missingParameter, {parameter: 'name'}))
    }
    persistence.createJudge(judge).then(created => {
        res.status(http.created).send(created)
    }).catch(err => {
        next(error.new(error.internal, {cause: err}))
    })
}

function patchJudge(req, res, next) {
    const id = req.params.judgeId
    const patch = req.body

    persistence.getJudgeById(id).then(judge => {
        if (!judge) {
            return next(error.judgeNotFound)
        }
        delete patch.id
        const newJudge = Object.assign(judge.toJSON(), patch)
        return persistence.updateJudge(id, newJudge).then(updated => {
            res.status(http.ok).send(updated)
        })
    }).catch(err => {
        next(error.new(error.internal, {cause: err}))
    })
}

function deleteJudge(req, res, next) {
    const id = req.params.judgeId
    persistence.destroyJudge(id).then(count => {
        if (count == 0) {
            return next(error.judgeNotFound)
        }
        res.status(http.noContent).send()
    }).catch(err => {
        next(error.new(error.internal, {cause: err}))
    })
}

function updateJudgeImage(req, res, next) {
    const id = req.params.judgeId
    const image = req.files ? req.files.image : undefined

    if (req.method == 'PUT') {
        if (!image) {
            return next(error.new(error.missingParameter, {parameter: 'image'}))
        }
        image.mtime = new Date()
    }
    persistence.getJudgeById(id).then(judge => {
        if (!judge) {
            return next(error.judgeNotFound)
        }
        return persistence.updateJudgeImage(id, image).then(() => {
            res.status(http.noContent).send()
        })
    }).catch(err => {
        next(error.new(error.internal, {cause: err}))
    })
}

module.exports = router
