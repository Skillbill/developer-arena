const Sequelize = require('sequelize')

module.exports = {
    id: { type: Sequelize.INTEGER, autoIncrement: true, primaryKey: true },
    projectId: {type: Sequelize.INTEGER, field: 'project_id'},
    kind: {type: Sequelize.STRING, field: 'kind' },
    mimetype: {type: Sequelize.STRING, field: 'mimetype' },
    mtime: {type: Sequelize.DATE, field: 'mtime' },
    name: {type: Sequelize.STRING, field: 'name'},
    data: {type: Sequelize.BLOB, field: 'data'}
}
