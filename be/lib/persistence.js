const contestDao = require('../model/contest-dao')
const projectDao = require('../model/project-dao')

const getAllContests = () => contestDao.getAllContests()
const getContestById = (id) => contestDao.getContestById(id)
const getLastContest = (language) => contestDao.getLastContest(language)

const getProjectById = (id) => projectDao.getProjectById(id)
const getProjectsByContest = (contestId) => projectDao.getProjectsByContest(contestId)
const getProjectWithDeliverable = (projectId) => projectDao.getWithDeliverable(projectId)
const getProjectWithImage = (projectId) => projectDao.getWithImage(projectId)
const submitProject = (project) => projectDao.submit(project)
const updateProject = (projectId, data) => projectDao.update(projectId, data)
const voteProject = (project, userId) => projectDao.vote(project, userId)

module.exports = {
    getAllContests,
    getLastContest,
    getContestById,
  
    getProjectById,
    getProjectsByContest,
    getProjectWithDeliverable,
    getProjectWithImage,
    submitProject,
    updateProject,
    voteProject
}
