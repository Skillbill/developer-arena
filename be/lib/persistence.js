const lk = require('./lookups');

const contestDao = require('../model/contest-dao');
const projectDao = require('../model/project-dao');

const getAllContests = () => contestDao.getAllContests();
const getContestById = (id) => contestDao.getContestById(id);
const getLastContest = (language) => contestDao.getLastContest(language);

const getProjectById = (id) => projectDao.getProjectById(id);
const getProjectsByContest = (contestId) => projectDao.getProjectsByContest(contestId);
const getProjectWithDeliverable = (projectId) => projectDao.getWithDeliverable(projectId);
const submitProject = (project) => projectDao.submit(project)

module.exports = {
  getAllContests,
  getLastContest,
  getContestById,
  
  getProjectById,
  getProjectsByContest,
  getProjectWithDeliverable,
  submitProject,
};
