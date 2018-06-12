const contestDao = require('@/model/contest-dao')
const judgeDao = require('@/model/judge-dao')
const projectDao = require('@/model/project-dao')

const getAllContests = (language) => contestDao.findAll(language)
const getContestById = (id, language) => contestDao.findById(id, language)
const getLastContest = (language) => contestDao.findLast(language)
const createContest = (contest) => contestDao.create(contest)
const updateContest = (id, data) => contestDao.update(id, data)
const destroyContest = (id) => contestDao.destroy(id)
const addJudge = (contestId, judgeId) => contestDao.addJudge(contestId, judgeId)
const removeJudge = (contestId, judgeId) => contestDao.removeJudge(contestId, judgeId)

const getAllJudges = () => judgeDao.findAll()
const getJudgeById = (judgeId) => judgeDao.findById(judgeId)
const getJudgeWithImage = (judgeId) => judgeDao.findByIdWithImage(judgeId)
const createJudge = (judge) => judgeDao.create(judge)
const updateJudge = (judgeId, data) => judgeDao.update(judgeId, data)
const updateJudgeImage = (judgeId, image) => judgeDao.updateImage(judgeId, image)
const destroyJudge = (judgeId) => judgeDao.destroy(judgeId)

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
const setProjectFlag = (projectId, flag, value) => projectDao.setFlag(projectId, flag, value)

module.exports = {
    getAllContests,
    getLastContest,
    getContestById,
    createContest,
    updateContest,
    destroyContest,
    addJudge,
    removeJudge,

    getAllJudges,
    getJudgeById,
    getJudgeWithImage,
    createJudge,
    updateJudge,
    updateJudgeImage,
    destroyJudge,

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
    setProjectFlag
}
