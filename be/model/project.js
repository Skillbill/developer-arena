const Sequelize = require('sequelize')

module.exports = {
    id: { type: Sequelize.INTEGER, autoIncrement: true, primaryKey: true },
    contestId: { type: Sequelize.INTEGER, field: 'contest_id'},
    submitted: { type:Sequelize.DATE, field: 'submitted'},
    title: {type: Sequelize.STRING, field: 'title'},
    description: {type: Sequelize.STRING, field: 'description'},
    repoURL: {type: Sequelize.STRING, field: 'repo_url'},
    filename: {type: Sequelize.STRING, field: 'filename'}
}
