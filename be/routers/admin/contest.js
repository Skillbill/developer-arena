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
    if (!libContest.datesAreValid(contest)) {
        return next(error.invalidDates)
    }
    if (!libContest.stateIsValid(contest.state)) {
        return next(error.new(error.invalidState, {state: contest.state}))
    }
    if (!contest.i18n) {
        return next(error.new(error.missingParameter, {parameter: 'i18n'}))
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
    if (patch.state && !libContest.stateIsValid(patch.state)) {
        return next(error.new(error.invalidState, {state: patch.state}))
    }
    persistence.getContestById(id).then(contest => {
        if (!contest) {
            return next(error.contestNotFound)
        }
        const merge = Object.assign(contest.toJSON(), patch)
        if (!libContest.datesAreValid(merge)) {
            return next(error.invalidDates)
        }
        persistence.updateContest(id, merge).then(updated => {
            res.status(http.ok).send(updated)
        }).catch(err => {
            next(error.new(error.internal, {cause: err}))
        })
    })
}

module.exports = router
