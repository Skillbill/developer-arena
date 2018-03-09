const lk = require('./lookups');

const getPublicState = (contest) => {
    const now = new Date();
    if (contest.state == lk.contest.state.past) {
      return contest.publicState.past;
    } else if (contest.endPresentation > now) {
      return lk.contest.publicState.presentation;
    } else if (contest.endApplying > now) {
      return lk.contest.publicState.applying;
    } else if (contest.endVoting > now) {
      return lk.contest.publicState.voting;
    } else {
      return lk.contest.publicState.closed;
    }
}

module.exports = {
  getPublicState
}
