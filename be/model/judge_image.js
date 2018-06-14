const Sequelize = require('sequelize')

module.exports = {
    id: { type: Sequelize.INTEGER, autoIncrement: true, primaryKey: true },
    judgeId : {type: Sequelize.INTEGER, field: 'judge_id'},
    mimetype: {type: Sequelize.STRING, field: 'mimetype' },
    mtime: {type: Sequelize.DATE, field: 'mtime' },
    name: {type: Sequelize.STRING, field: 'name'},
    data: {type: Sequelize.BLOB, field: 'data'}
}
