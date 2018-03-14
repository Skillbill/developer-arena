const Sequelize = require('sequelize')

module.exports = {
    id: { type: Sequelize.INTEGER, autoIncrement: true, primaryKey: true },
    entityId: {type: Sequelize.INTEGER, field: 'entity_id'},
    entityAttribute: {type: Sequelize.STRING, field: 'entity_attribute'},
    language: {type: Sequelize.STRING, field: 'language'},
    translation: {type: Sequelize.STRING, field: 'translation'}
}
