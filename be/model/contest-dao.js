const logger = require('../lib/logger');
const lk = require('../lib/lookups');
const sql = require('../lib/sql');
const model = require('./contest');

const Op = require('sequelize').Op

const getAllContests = () => {
  return sql.getContestTable().findAll({})
};

const getContestById = (id) => {
  return sql.getContestTable().findById(id);
};

const getLastContest = (language) => {
  const contestTable = sql.getContestTable();
  const contestI18nTable = sql.getContestI18nTable();
  contestTable.hasMany(contestI18nTable, { as: 'i18n', foreignKey: 'entityId' });
  return contestTable.findOne({
    order: [['id', 'DESC']],
    where:{
      [model.state.field]: {
        [Op.ne]: lk.contest.state.draft
      }
    },
    include: [{
      model: contestI18nTable,
      as: 'i18n',
      where: {
        language: {
          [Op.eq]: language
        }
      }
    }]
  });
};

module.exports = {
  getAllContests,
  getContestById,
  getLastContest
};
