const Sequelize = require('sequelize')

module.exports = {
    contestId: { type: Sequelize.INTEGER, field: 'contest_id'},
    judgeId: { type: Sequelize.INTEGER, field: 'judge_id'}
}
