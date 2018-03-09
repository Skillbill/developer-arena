const express = require('express');
const lk = require('../../lib/lookups');
const libContest = require('../../lib/contest');
const logger = require('../../lib/logger');
const persistence = require('../../lib/persistence');
const router = express.Router({mergeParams: true});

router.get('/', (req, res) => getProjectList(req, res));
router.get('/:projectId', (req, res) => getProject(req, res));
router.get('/:projectId/deliverable', (req, res) => getDeliverable(req, res));
router.post('/', require('./middleware').validateDeliverable);
router.post('/', (req, res) => submitProject(req, res));

const missingParam = (res, param) => {
  if (!param) {
    param = 'required parameter';
  }
  res.status(lk.http.badRequest).send({error: `missing ${param}`});
};

const getProjectList = (req, res) => {
  const contestId = req.params.contestId;
  if (!contestId) {
    return missingParam(res, 'contest id'
);
  }
  persistence.getProjectsByContest(contestId).then(lst => {
    res.status(lk.http.ok).send({projects: lst});
  }).catch(err => {
    logger.error(err);
    res.status(lk.http.internalError).send({error: err});
  });
};

const getProject = (req, res) => {
  const id = req.params.projectId;
  const contestId = req.params.projectId;
  if (!contestId) {
    return missingParam(res, 'contest id');
  }
  persistence.getProjectById(id).then(project => {
    if (!project) {
      return res.status(lk.http.notFound).send({error: "project not found"});
    }
    res.status(lk.http.ok).send({project: project});
  }).catch(err => {
    logger.error(err);
    res.status(lk.http.internalError).send({error: err});
  });
};

const getDeliverable = (req, res) => {
  const contestId = req.params.contestId;
  const projectId = req.params.projectId;
  persistence.getProjectWithDeliverable(projectId).then(project => {
    if (!project || project.contestId != contestId) {
      return res.status(lk.http.notFound).send({error: "deliverable not found"})
    }
    res.set('Content-Type', project.deliverable.mimetype);
    res.set('Content-Disposition', `attachment; filename="${project.filename}"`);
    res.status(lk.http.ok).send(project.deliverable.data);
  }).catch(err => {
    logger.error(err);
    res.status(lk.http.internalError).send({error: err});
  });
};

// TODO: user profiling
const submitProject = (req, res) => {
  persistence.getContestById(req.params.contestId).then(contest => {
    if (!contest || contest.state == lk.contest.state.draft) {
      return res.status(lk.http.notFound).send({error: "contest not found"});
    }
    if (libContest.getPublicState(contest) != lk.contest.publicState.applying) {
      return res.status(lk.http.preconditionFailed).send({error: "contest is not open for submissions"});
    }
    const p = {
      contestId: req.params.contestId,
      submitted: new Date(),
      title: req.body.title,
      description: req.body.description
    };
    if (req.body.repoURL) {
      p.repoURL = req.body.repoURL;
    }
    if (req.files && req.files.deliverable) {
      p.deliverable = req.files.deliverable;
      p.filename = p.deliverable.name;
    }
    if (!p.contestId) {
      return missingParam(res, 'contest id');
    }
    if (!p.title || !p.description) {
      return missingParam(res);
    }
    if (!p.repoURL && !p.deliverable) {
      return missingParam(res, 'repoURL and deliverable');
    }
    persistence.submitProject(p).then(project => {
      res.status(lk.http.created).send({project: project});
    }).catch(err => {
      logger.error(err);
      res.status(lk.http.internalError).send({error: err});
    });
  }).catch(err => {
      logger.error(err);
      res.status(lk.http.internalError).send({error: err});
  });
};

module.exports = router;
