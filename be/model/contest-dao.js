const libContest = require('../lib/contest')
const sql = require('../lib/sql')

const Op = require('sequelize').Op

const findAll = () => {
    return sql.getContestTable().findAll({})
}

const findById = (id, language) => {
    if (!language) {
        return sql.getContestTable().findById(id)
    }
    const contestTable = sql.getContestTable()
    const contestI18nTable = sql.getContestI18nTable()
    contestTable.hasMany(contestI18nTable, { as: 'i18n', foreignKey: 'entityId' })
    return contestTable.findOne({
        where:{
            id: id
        },
        include: [{
            model: contestI18nTable,
            as: 'i18n',
            where: {
                language: {
                    [Op.eq]: language
                }
            }
        }]
    })
}

const findLast = (language) => {
    const contestTable = sql.getContestTable()
    const contestI18nTable = sql.getContestI18nTable()
    contestTable.hasMany(contestI18nTable, { as: 'i18n', foreignKey: 'entityId' })
    return contestTable.findOne({
        order: [['id', 'DESC']],
        where:{
            state: {
                [Op.ne]: libContest.state.draft
            }
        },
        include: [{
            model: contestI18nTable,
            as: 'i18n',
            where: {
                language: {
                    [Op.eq]: language
                }
            }
        }]
    })
}

const update = (id, data) => {
    return new Promise((resolve, reject) => {
        sql.getContestTable().update(data, {
            fields: [
                'endPresentation',
                'endApplying',
                'endVoting',
                'state'
            ],
            returning: true,
            limit: 1,
            where: {
                id: id
            }
        }).then(row => resolve(row[1][0])).catch(reject)
    })
}

module.exports = {
    findAll,
    findById,
    findLast,
    update
}
