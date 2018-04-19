const Sequelize = require('sequelize')

module.exports = {
    id: { type: Sequelize.INTEGER, autoIncrement: true, primaryKey: true },
    contestId: { type: Sequelize.INTEGER, field: 'contest_id'},
    userId: { type: Sequelize.STRING, field: 'user_id'},
    submitted: { type:Sequelize.DATE, field: 'submitted'},
    updated: { type:Sequelize.DATE, field: 'updated'},
    title: {type: Sequelize.STRING, field: 'title'},
    description: {type: Sequelize.STRING, field: 'description'},
    repoURL: {type: Sequelize.STRING, field: 'repo_url'},
    video: {type: Sequelize.STRING, field: 'video'},
    approved: {type: Sequelize.BOOLEAN, field: 'approved'}
}
