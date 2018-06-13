const http = require('@/lib/http')
const libContest = require('@/lib/contest')
const persistence = require('@/lib/persistence')
const error = require('@/lib/error')
const express = require('express')
const router = express.Router({mergeParams: true})

router.get('/', getContestList)
router.get('/:contestId', getContest)
router.get('/:contestId/jury', getContestJury)

function getContestList(req, res, next) {
    persistence.getAllContests(req.language).then(lst => {
        res.status(http.ok).send({
            contests: lst.filter(contest => contest.state != libContest.state.draft).map(libContest.fmt)
        })
    }).catch(err => {
        next(error.new(error.internal, {cause: err}))
    })
}

function getContest(req, res, next) {
    const id = req.params.contestId;
    ((id == 'last') ? persistence.getLastContest(req.language) : persistence.getContestById(id, req.language))
        .then(contest => {
            if (!contest || contest.state == libContest.state.draft) {
                return next(error.contestNotFound)
            }
            res.status(http.ok).send({contest: libContest.fmt(contest)})
        }).catch(err => {
            next(error.new(error.internal, {cause: err}))
        })
}

function getContestJury(req, res, next) {
    const id = req.params.contestId;
    ((id == 'last') ? persistence.getLastContest() : persistence.getContestById(id))
        .then(contest => {
            if (!contest || contest.state == libContest.state.draft) {
                return next(error.contestNotFound)
            }
            return persistence.getJury(id).then(jury => {
                res.status(http.ok).send({jury})
            })
        }).catch(err => {
            next(error.new(error.internal, {cause: err}))
        })
}

module.exports = router
