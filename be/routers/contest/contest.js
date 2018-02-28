const express = require('express');
const router = express.Router({mergeParams: true});
const lookups = require('../../lib/lookups');

router.get('/:contestId', (req, res) => getContest(req, res));

const getContest = (req, res) => {
  res.status(lookups.http.ok).send({data: {
    title: 'contest title',
    description: 'contest description',
    endPresentationDate: new Date(),
    endApplyingDate: new Date(),
    endVotingDate: new Date(),
    status: lookups.contestStates.applying
  }});
};

module.exports = router;
