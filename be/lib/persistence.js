const lk = require('./lookups');

const contestDao = require('../model/contest-dao');

const getAllContests = () => contestDao.getAllContests();
const getContestById = (id) => contestDao.getContestById(id);
const getLastContest = (language) => contestDao.getLastContest(language);

module.exports = {
  getAllContests,
  getLastContest,
  getContestById
};
