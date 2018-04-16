const libContest = require('@/lib/contest')
const sql = require('@/lib/sql')

const Op = require('sequelize').Op

const getTableWithI18n = (includes, language) => {
    const contest = sql.getContestTable()
    const i18n = sql.getContestI18nTable()
    contest.hasMany(i18n, { as: 'i18n', foreignKey: 'entityId' })
    let filter = {}
    if (language) {
        filter = { language: language }
    }
    includes.push({
        model: i18n,
        as: 'i18n',
        where: filter
    })
    return contest
}

const findAll = () => sql.getContestTable().findAll({})

const findById = (id, language) => {
    let includes = []
    const table = getTableWithI18n(includes, language)
    return table.findOne({
        where:{
            id: id
        },
        include: includes
    })
}

const findLast = (language) => {
    let includes = []
    const table = getTableWithI18n(includes, language)
    return table.findOne({
        order: [['id', 'DESC']],
        where:{
            state: {
                [Op.ne]: libContest.state.draft
            }
        },
        include: includes
    })
}

const _create_i18n = (contestId, data, tx) => {
    const table = sql.getContestI18nTable()
    return Promise.all(data.map(el => table.create(Object.assign(el, {entityId: contestId}), {transaction: tx})))
}

const create = (data) => new Promise((resolve, reject) => {
    sql.transaction().then(tx => {
        sql.getContestTable().create(data, {
            transaction: tx
        }).then(contest => {
            return Promise.all([
                Promise.resolve(contest),
                _create_i18n(contest.id, data.i18n, tx)
            ])
        }).then(([contest, i18n]) => {
            tx.commit()
            resolve(Object.assign(contest.toJSON(), {i18n: i18n}))
        }).catch(err => {
            tx.rollback()
            reject(err)
        })
    })
})


const _update_i18n = (constestId, data, tx) => new Promise((resolve, reject) => {
    const table = sql.getContestI18nTable()
    Promise.all(data.map(row => table.update({translation: row.translation}, {
        returning: true,
        limit: 1,
        where: {
            entityId: constestId,
            language: row.language,
            entityAttribute: row.entityAttribute
        },
        transaction: tx
    }))).then(rows => {
        resolve(rows.map(row => row[1][0]).filter(row => row != null))
    }).catch(err => {
        reject(err)
    })
})

const _update_contest = (id, data, tx) => new Promise((resolve, reject) => {
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
        },
        transaction: tx
    }).then(row => {
        resolve(row[1][0])
    }).catch(err => {
        reject(err)
    })
})

const update = (id, data) => new Promise((resolve, reject) => {
    sql.transaction().then(tx => {
        Promise.all([
            _update_contest(id, data, tx),
            _update_i18n(id, data.i18n, tx)
        ]).then(([contest, i18n]) => {
            tx.commit()
            resolve({
                contest: contest,
                i18n: i18n
            })
        }).catch (err => {
            tx.rollback()
            reject(err)
        })
    })
})

const destroy = (id) => sql.getContestTable().destroy({where: {id: id}})

module.exports = {
    findAll,
    findById,
    findLast,
    create,
    update,
    destroy
}
