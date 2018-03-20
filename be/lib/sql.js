const config = require('../config').get()
const Sequelize = require('sequelize')

const model = {
    contest: require('../model/contest'),
    contestI18n: require('../model/contest-i18n'),
    project: require('../model/project'),
    deliverable: require('../model/deliverable'),
    vote: require('../model/vote')
}

const sqlUri = `postgresql://${config.db.user}:${config.db.password}@${config.db.host}:${config.db.port}/sda-contest`
const sequelize = new Sequelize(sqlUri, {
    operatorsAliases: Sequelize.Op,
    define: {
        timestamps: false
    },
    logging: false
})

const getContestTable = () => {
    return sequelize.define('contest', model.contest, {freezeTableName: true})
}

const getContestI18nTable = () => {
    return sequelize.define('contest_i18n', model.contestI18n, {freezeTableName: true})
}

const getProjectTable = () => {
    return sequelize.define('project', model.project, {freezeTableName: true})
}

const getDeliverableTable = () => {
    return sequelize.define('deliverable', model.deliverable, {freezeTableName: true})
}

const getVoteTable = () => {
    return sequelize.define('vote', model.vote, {freezeTableName: true})
}

module.exports = {
    getContestTable,
    getContestI18nTable,
    getProjectTable,
    getDeliverableTable,
    getVoteTable
}
