const config = require('../config').get();
const logger = require('./logger');
const Sequelize = require('sequelize');

const contestModel = require('../model/contest');

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

module.exports = {
  getContestTable,
};
