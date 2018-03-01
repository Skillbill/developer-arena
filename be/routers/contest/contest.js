const lk = require('../../lib/lookups');
const persistence = require('../../lib/persistence');
const logger = require('../../lib/logger');
const express = require('express');
const router = express.Router({mergeParams: true});

router.get('/:contestId', (req, res) => getContest(req, res));

const getContest = (req, res) => {
  const id = req.params.contestId;
  if (id === undefined || id == '') {
    return res.status(lk.http.badRequest).send({error: "id not set"});
  }
  ((id == "last") ? persistence.getLastContest() : persistence.getContestById(id))
    .then((contest) => {
      if (!contest) {
        return res.status(lk.http.notFound).send({error: "contest not found"});
      }
      res.status(lk.http.ok).send({contest: contest});
    }).catch(err => {
      logger.error(err);
      res.status(lk.http.internalError).send({error: err});
    });
};

module.exports = router;
