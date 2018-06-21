const libContest = require('@/lib/contest')
const sql = require('@/lib/sql')
const Op = require('sequelize').Op

const Contest = sql.getContestTable()
const I18n = sql.getContestI18nTable()
const Jury = sql.getJuryTable()

Contest.hasMany(I18n, { as: 'i18n', foreignKey: 'contestId'})
Contest.hasMany(Jury, { as: 'jury', foreignKey: 'contestId'})

const _i18n = (language) => ({
    model: I18n,
    as: 'i18n',
    required: false,
    where: language ? {language: language} : {}
})

const _jury = (contestId) => ({
    model: Jury,
    as: 'jury',
    required: false,
    attributes: ['judgeId'],
    where: { contestId }
})

const findAll = (language) => Contest.findAll({
    include: _i18n(language)
})

const findById = (id, language) => Contest.findOne({
    where:{
        id: id
    },
    include: [ _i18n(language), _jury(id) ]
})

const findLast = (language) => Contest.max('id', {
    where: {
        state: {
            [Op.ne]: libContest.state.draft
        }
    }}).then(id => id ? findById(id, language) : Promise.resolve())

const _create_i18n = (contestId, lst, tx) => Promise.all(lst.map(el => I18n.create(Object.assign(el, {contestId: contestId}), {transaction: tx})))

const create = (data) => new Promise((resolve, reject) => {
    sql.transaction().then(tx => {
        Contest.create(data, {
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

const _replace_i18n = (contestId, lst, tx) => I18n.destroy({
    where: {
        contestId: contestId
    },
    transaction: tx
}).then(() => lst ? _create_i18n(contestId, lst, tx) : Promise.resolve({}))

const _update_contest = (id, data, tx) => new Promise((resolve, reject) => {
    Contest.update(data, {
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
            _replace_i18n(id, data.i18n, tx)
        ]).then(([contest, i18n]) => {
            tx.commit()
            resolve({
                contest: contest,
                i18n: i18n
            })
        }).catch(err => {
            tx.rollback()
            reject(err)
        })
    }).catch(err => {
        reject(err)
    })
})

const destroy = (id) => Contest.destroy({where: {id: id}})

module.exports = {
    findAll,
    findById,
    findLast,
    create,
    update,
    destroy
}
