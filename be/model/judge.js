const Sequelize = require('sequelize')

module.exports = {
    id: { type: Sequelize.INTEGER, autoIncrement: true, primaryKey: true },
    name: { type: Sequelize.STRING, field: 'name'},
    email: { type: Sequelize.STRING, field: 'email'},
    twitter: { type: Sequelize.STRING, field: 'twitter'},
    site: { type: Sequelize.STRING, field: 'site'},
    description: { type: Sequelize.STRING, field: 'description' },
}
