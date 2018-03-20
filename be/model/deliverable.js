const Sequelize = require('sequelize')

module.exports = {
    id: { type: Sequelize.INTEGER, autoIncrement: true, primaryKey: true },
    projectId: {type: Sequelize.INTEGER, field: 'project_id'},
    mimetype: {type: Sequelize.STRING, field: 'mimetype' },
    name: {type: Sequelize.STRING, field: 'name'},
    data: {type: Sequelize.BLOB, field: 'data'}
}
