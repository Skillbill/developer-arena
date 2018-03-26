const lk = require('../lib/lookups')
const sql = require('../lib/sql')

const Op = require('sequelize').Op

const findAllContests = () => {
    return sql.getContestTable().findAll({})
}

const findContestById = (id) => {
    return sql.getContestTable().findById(id)
}

const findLastContest = (language) => {
    const contestTable = sql.getContestTable()
    const contestI18nTable = sql.getContestI18nTable()
    contestTable.hasMany(contestI18nTable, { as: 'i18n', foreignKey: 'entityId' })
    return contestTable.findOne({
        order: [['id', 'DESC']],
        where:{
            state: {
                [Op.ne]: lk.contest.state.draft
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

module.exports = {
    findAllContests,
    findContestById,
    findLastContest
}
