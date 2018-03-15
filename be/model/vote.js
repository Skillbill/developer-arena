const Sequelize = require('sequelize')

module.exports = {
    id: { type: Sequelize.INTEGER, autoIncrement: true, primaryKey: true },
    contestId: { type: Sequelize.INTEGER, field: 'contest_id'},
    projectId: { type: Sequelize.INTEGER, field: 'project_id'},
    voterId: { type: Sequelize.STRING, field: 'voter_id' }
}
