const contestDao = require('@/model/contest-dao')
const projectDao = require('@/model/project-dao')

const getAllContests = (language) => contestDao.findAll(language)
const getContestById = (id, language) => contestDao.findById(id, language)
const getLastContest = (language) => contestDao.findLast(language)
const createContest = (contest) => contestDao.create(contest)
const updateContest = (id, data) => contestDao.update(id, data)
const destroyContest = (id) => contestDao.destroy(id)

const getProjectById = (id) => projectDao.findById(id)
const getProjectByUser = (contestId, userId) => projectDao.findByUser(contestId, userId)
const getProjectsByContest = (contestId) => projectDao.findAllByContest(contestId)
const getProjectWithDeliverable = (projectId) => projectDao.findWithDeliverable(projectId)
const getProjectWithImage = (projectId) => projectDao.findWithImage(projectId)
const submitProject = (project) => projectDao.submit(project)
const updateProject = (projectId, data) => projectDao.update(projectId, data)
const destroyProject = (projectId) => projectDao.destroy(projectId)
const voteProject = (project, userId) => projectDao.vote(project, userId)
const undoVoteProject = (project, userId) => projectDao.undoVote(project, userId)
const setProjectApproved = (projectId, value) => projectDao.setApproved(projectId, value)

module.exports = {
    getAllContests,
    getLastContest,
    getContestById,
    createContest,
    updateContest,
    destroyContest,

    getProjectById,
    getProjectsByContest,
    getProjectByUser,
    getProjectWithDeliverable,
    getProjectWithImage,
    submitProject,
    updateProject,
    destroyProject,
    voteProject,
    undoVoteProject,
    setProjectApproved
}
