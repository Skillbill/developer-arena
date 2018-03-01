const lk = require('./lookups');

const getLastContest = () => {
  return new Promise((resolve, reject) => {
    resolve({
      id: 1,
      title: 'contest title',
      description: 'contest description',
      endPresentationDate: new Date(),
      endApplyingDate: new Date(),
      endVotingDate: new Date(),
      status: lk.contestStates.applying
    });
  });
};

const getContestById = (id) => {
  return new Promise((resolve, reject) => {
    if (id != 1) {
      return resolve(null);
    }
    resolve(getLastContest());
  });
};

module.exports = {
  getLastContest,
  getContestById
};
