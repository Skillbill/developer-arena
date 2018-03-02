const logger = require('../lib/logger');
const lk = require('../lib/lookups');
const sql = require('../lib/sql');
const model = require('./contest');

const Op = require('sequelize').Op

const getAllContests = () => {
  return sql.getContestTable().findAll({
    attributes: [
      'id',
      model.title.field,
      model.state.field,
    ]
  })
};

const getContestById = (id) => {
  return sql.getContestTable().findById(id);
};

const getLastContest = () => {
  return sql.getContestTable().findOne({
    order: [['id', 'DESC']],
    where:{
      [model.state.field]: {
        [Op.ne]: lk.contest.state.draft
      },
    }
  });
};

module.exports = {
  getAllContests,
  getContestById,
  getLastContest
};
