const Sequelize = require('sequelize')

module.exports = {
    id: { type: Sequelize.INTEGER, autoIncrement: true, primaryKey: true },
    contestId: {type: Sequelize.INTEGER, field: 'contest_id'},
    attribute: {type: Sequelize.STRING, field: 'attribute'},
    language: {type: Sequelize.STRING, field: 'language'},
    text: {type: Sequelize.STRING, field: 'text'}
}
