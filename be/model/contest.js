const Sequelize = require('sequelize');

module.exports = {
  id: { type: Sequelize.INTEGER, autoIncrement: true, primaryKey: true },
  title: {type: Sequelize.STRING, field: "title"},
  description: {type: Sequelize.STRING, field: "description"},
  endPresentation: {type: Sequelize.DATE, field: "end_presentation"},
  endApplying: {type: Sequelize.DATE, field: "end_applying"},
  endVoting: {type: Sequelize.DATE, field: "end_voting"},
  state: {type: Sequelize.STRING, field: "state"}
};
