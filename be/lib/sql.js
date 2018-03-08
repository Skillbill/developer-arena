const config = require('../config').get();
const logger = require('./logger');
const Sequelize = require('sequelize');

const contestModel = require('../model/contest');
const contestI18nModel = require('../model/contest-i18n');

const sqlUri = `postgresql://${config.db.user}:${config.db.password}@${config.db.host}:${config.db.port}/sda-contest`
const sequelize = new Sequelize(sqlUri, {
  operatorsAliases: Sequelize.Op,
  define: {
    timestamps: false
  }
});

const getContestTable = () => {
  return sequelize.define('contest', contestModel, {freezeTableName: true});
}

const getContestI18nTable = () => {
  return sequelize.define('contest_i18n', contestI18nModel, {freezeTableName: true});
}

module.exports = {
  getContestTable,
  getContestI18nTable
};
