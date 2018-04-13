const http = require('@/lib/http')
const libContest = require('@/lib/contest')
const persistence = require('@/lib/persistence')
const logger = require('@/lib/logger')
const error = require('@/lib/error')
const express = require('express')
const router = express.Router({mergeParams: true})

router.get('/', getContestList)
router.get('/:contestId', getContest)

const pubfmt = (contest) => {
    if (contest.state == libContest.state.draft) {
        logger.warn(`unexpected draft passed to pubfmt: ${contest.toJSON()}`)
        return null
    }
    let obj = contest.toJSON()
    obj.state = libContest.getPublicState(contest)
    if(obj.i18n) {
        obj.i18n.forEach(i18n => {
            obj[i18n.entityAttribute] = i18n.translation
        })
        delete obj.i18n
    }
    return obj
}

function getContestList(req, res, next) {
    persistence.getAllContests().then(lst => {
        res.status(http.ok).send({
            contests: lst.filter(contest => contest.state != libContest.state.draft).map(pubfmt)
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
            res.status(http.ok).send({contest: pubfmt(contest)})
        }).catch(err => {
            next(error.new(error.internal, {cause: err}))
        })
}

module.exports = router
