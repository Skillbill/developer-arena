const contestDao = require('../model/contest-dao')
const projectDao = require('../model/project-dao')

const getAllContests = () => contestDao.findAllContests()
const getContestById = (id) => contestDao.findContestById(id)
const getLastContest = (language) => contestDao.findLastContest(language)

const getProjectById = (id) => projectDao.findById(id)
const getProjectByUser = (contestId, userId) => projectDao.findByUser(contestId, userId)
const getProjectsByContest = (contestId) => projectDao.findAllByContest(contestId)
const getProjectWithDeliverable = (projectId) => projectDao.findWithDeliverable(projectId)
const getProjectWithImage = (projectId) => projectDao.findWithImage(projectId)
const submitProject = (project) => projectDao.submit(project)
const updateProject = (projectId, data) => projectDao.update(projectId, data)
const voteProject = (project, userId) => projectDao.vote(project, userId)

module.exports = {
    getAllContests,
    getLastContest,
    getContestById,

    getProjectById,
    getProjectsByContest,
    getProjectByUser,
    getProjectWithDeliverable,
    getProjectWithImage,
    submitProject,
    updateProject,
    voteProject
}
