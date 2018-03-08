const Sequelize = require('sequelize');

module.exports = {
  id: { type: Sequelize.INTEGER, autoIncrement: true, primaryKey: true },
  endPresentation: {type: Sequelize.DATE, field: "end_presentation"},
  endApplying: {type: Sequelize.DATE, field: "end_applying"},
  endVoting: {type: Sequelize.DATE, field: "end_voting"},
  state: {type: Sequelize.STRING, field: "state"}
};
