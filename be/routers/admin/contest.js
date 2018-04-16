const http = require('@/lib/http')
const libContest = require('@/lib/contest')
const persistence = require('@/lib/persistence')
//const logger = require('@/lib/logger')
const error = require('@/lib/error')
const express = require('express')
const router = express.Router({mergeParams: true})

router.get('/', getContestList)
router.post('/', createContest)
router.get('/:contestId', getContest)
router.patch('/:contestId', patchContest)
router.delete('/:contestId', deleteContest)

function getContestList(req, res, next) {
    persistence.getAllContests().then(lst => {
        res.status(http.ok).send({contests: lst})
    }).catch(err => {
        next(error.new(error.internal, {cause: err}))
    })
}

function getContest(req, res, next) {
    const id = req.params.contestId
    persistence.getContestById(id).then(contest => {
        if (!contest) {
            return next(error.contestNotFound)
        }
        res.status(http.ok).send({contest: contest})
    }).catch(err => {
        next(error.new(error.internal, {cause: err}))
    })
}

function createContest(req, res, next) {
    const contest = req.body
    const err = libContest.check(contest)
    if (err != null) {
        return next(err)
    }
    persistence.createContest(contest).then(created => {
        res.status(http.created).send(created)
    }).catch(err => {
        next(error.new(error.internal, {cause: err}))
    })
}

function patchContest(req, res, next) {
    const id = req.params.contestId
    const patch = req.body
    persistence.getContestById(id).then(contest => {
        if (!contest) {
            return next(error.contestNotFound)
        }
        const merge = Object.assign(contest.toJSON(), patch)
        const err = libContest.check(merge)
        if (err != null) {
            return next(err)
        }
        persistence.updateContest(id, merge).then(updated => {
            res.status(http.ok).send(updated)
        }).catch(err => {
            next(error.new(error.internal, {cause: err}))
        })
    })
}

function deleteContest(req, res, next) {
    const id = req.params.contestId
    persistence.destroyContest(id).then(count => {
        if (count == 0) {
            return next(error.contestNotFound)
        }
        res.status(http.ok).end()
    }).catch(err => {
        next(error.new(error.internal, {cause: err}))
    })
}

module.exports = router
