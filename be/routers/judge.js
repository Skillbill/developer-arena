const http = require('@/lib/http')
const persistence = require('@/lib/persistence')
const error = require('@/lib/error')
const sendfile = require('@/lib/sendfile')
const express = require('express')
const router = express.Router()

router.get('/', getAllJudges)
router.get('/:judgeId', getJudge)
router.get('/:judgeId/image', getJudgeImage)

function getAllJudges(req, res, next) {
    persistence.getAllJudges().then(lst => {
        res.status(http.ok).send({judges: lst})
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
        res.status(http.ok).send({judge: judge})
    }).catch(err => {
        next(error.new(error.internal, {cause: err}))
    })
}

function getJudgeImage(req, res, next) {
    const id = req.params.judgeId
    persistence.getJudgeWithImage(id).then(judge => {
        if (!judge) {
            return next(error.imageNotFound)
        }
        sendfile(res, judge.image, true)
    })
}

module.exports = router
