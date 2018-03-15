const contestDao = require('../model/contest-dao')
const projectDao = require('../model/project-dao')

const getAllContests = () => contestDao.getAllContests()
const getContestById = (id) => contestDao.getContestById(id)
const getLastContest = (language) => contestDao.getLastContest(language)

const getProjectById = (id) => projectDao.getProjectById(id)
const getProjectsByContest = (contestId) => projectDao.getProjectsByContest(contestId)
const getProjectWithDeliverable = (projectId) => projectDao.getWithDeliverable(projectId)
const submitProject = (project) => projectDao.submit(project)

const voteProject = (project, userId) => projectDao.vote(project, userId)

module.exports = {
    getAllContests,
    getLastContest,
    getContestById,
  
    getProjectById,
    getProjectsByContest,
    getProjectWithDeliverable,
    submitProject,
    voteProject
}
