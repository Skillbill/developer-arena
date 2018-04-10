const http = require('../../lib/http')
const auth = require('../../lib/auth')
const libContest = require('../../lib/contest')
const persistence = require('../../lib/persistence')
const logger = require('../../lib/logger')
const error = require('../../lib/error')
const express = require('express')
const router = express.Router({mergeParams: true})

const mw = {
    auth: auth.middleware,
    authOptional: auth.middleware_optional
}

router.patch('*', mw.auth)

router.get('/', mw.authOptional, getContestList)
router.get('/:contestId', mw.authOptional, getContest)
router.patch('/:contestId', patchContest)
router.use('/:contestId/project/', require('./project'))

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
    const isAdmin = req.user && req.user.isAdmin
    persistence.getAllContests().then(lst => {
        res.status(http.ok).send({
            contests: isAdmin? lst : lst.filter(contest => contest.state != libContest.state.draft).map(pubfmt)
        })
    }).catch(err => {
        next(error.new(error.internal, {cause: err}))
    })
}

function getContest(req, res, next) {
    const isAdmin = req.user && req.user.isAdmin
    const id = req.params.contestId;

    ((id == 'last') ? persistence.getLastContest(req.language) : persistence.getContestById(id, req.language))
        .then(contest => {
            if (!contest || !isAdmin && contest.state == libContest.state.draft) {
                return next(error.contestNotFound)
            }
            res.status(http.ok).send({contest: isAdmin ? contest : pubfmt(contest)})
        }).catch(err => {
            next(error.new(error.internal, {cause: err}))
        })
}

function patchContest(req, res, next) {
    const id = req.params.contestId
    const patch = req.body
    if (!req.user.isAdmin) {
        return next(error.notAdmin)
    }
    if (patch.state && !libContest.stateIsValid(patch.state)) {
        return next(error.new(error.invalidState, {state: patch.state}))
    }
    persistence.getContestById(id).then(contest => {
        if (!contest) {
            return next(error.contestNotFound)
        }
        let newContest = {}
        Object.keys(contest.toJSON()).forEach(k => {
            newContest[k] = patch[k] || contest[k]
        })
        if (!libContest.datesAreValid(newContest)) {
            return next(error.invalidDates)
        }
        persistence.updateContest(id, newContest).then(updated => {
            res.status(http.ok).send({contest: updated})
        }).catch(err => {
            next(error.new(error.internal, {cause: err}))
        })
    })
}

module.exports = router
