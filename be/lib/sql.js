const config = require('@/lib/config').get()
const Sequelize = require('sequelize')

const model = {
    contest: require('../model/contest'),
    contestI18n: require('../model/contest-i18n'),
    project: require('../model/project'),
    file: require('../model/file'),
    vote: require('../model/vote'),
    judge: require('../model/judge'),
    judge_bio: require('../model/judge_bio'),
    judge_image: require('../model/judge_image'),
    jury: require('../model/jury'),
}

const sqlUri = `postgresql://${config.db.user}:${config.db.password}@${config.db.host}:${config.db.port}/${config.db.database}`
const sequelize = new Sequelize(sqlUri, {
    operatorsAliases: Sequelize.Op,
    define: {
        timestamps: false
    },
    logging: false
})

const checkConnection = () => new Promise((resolve, reject) => {
    sequelize.authenticate()
        .then(() => resolve())
        .catch(err => {
            if (err instanceof Sequelize.Error) {
                resolve(err)
            } else {
                reject(err)
            }
        })
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

const getFileTable = () => {
    return sequelize.define('file', model.file, {freezeTableName: true})
}

const getVoteTable = () => {
    return sequelize.define('vote', model.vote, {freezeTableName: true})
}

const getJudgeTable = () => {
    return sequelize.define('judge', model.judge, {freezeTableName: true})
}

const getJudgeBioTable = () => {
    return sequelize.define('judge_bio', model.judge_bio, {freezeTableName: true})
}

const getJudgeImageTable = () => {
    return sequelize.define('judge_image', model.judge_image, {freezeTableName: true})
}

const getJuryTable = () => {
    return sequelize.define('jury', model.jury, {freezeTableName: true})
}

module.exports = {
    checkConnection: checkConnection,
    transaction: sequelize.transaction.bind(sequelize),
    getContestTable,
    getContestI18nTable,
    getProjectTable,
    getFileTable,
    getVoteTable,
    getJudgeTable,
    getJudgeBioTable,
    getJudgeImageTable,
    getJuryTable
}
