const lk = require('../../lib/lookups')
const libContest = require('../../lib/contest')
const persistence = require('../../lib/persistence')
const logger = require('../../lib/logger')
const express = require('express')
const router = express.Router({mergeParams: true})


router.get('/', (req, res) => getContestList(req, res))
router.get('/:contestId', (req, res) => getContest(req, res))

function pubfmt(contest) {
    if (contest.state == lk.contest.state.draft) {
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

const getContestList = (req, res) => {
    const isAdmin = false
    persistence.getAllContests().then(lst => {
        res.status(lk.http.ok).send({
            contests: isAdmin? lst : lst.filter(contest => contest.state != lk.contest.state.draft).map(pubfmt)
        })
    }).catch(err => {
        logger.error(err)
        res.status(lk.http.internalError).send({error: err})
    })
}

const getContest = (req, res) => {
    const isAdmin = false
    const id = req.params.contestId;
    ((id == 'last') ? persistence.getLastContest(req.language) : persistence.getContestById(id))
        .then(contest => {
            if (!contest || !isAdmin && contest.state == lk.contest.state.draft) {
                return res.status(lk.http.notFound).send({error: 'contest not found'})
            }
            res.status(lk.http.ok).send({contest: pubfmt(contest)})
        }).catch(err => {
            logger.error(err)
            res.status(lk.http.internalError).send({error: err})
        })
}

module.exports = router
