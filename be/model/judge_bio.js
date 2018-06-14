const Sequelize = require('sequelize')

module.exports = {
    id: { type: Sequelize.INTEGER, autoIncrement: true, primaryKey: true },
    judgeId: {type: Sequelize.INTEGER, field: 'judge_id'},
    language: {type: Sequelize.STRING, field: 'language'},
    text: {type: Sequelize.STRING, field: 'text'}
}
