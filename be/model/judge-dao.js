const sql = require('@/lib/sql')

const Judge = sql.getJudgeTable()
const Bio = sql.getJudgeBioTable()
const Image = sql.getJudgeImageTable()
const Jury = sql.getJuryTable()

Judge.hasMany(Bio, {as: 'bio', foreignKey: 'judgeId'})
Judge.hasOne(Image, {as: 'image', foreignKey: 'judgeId'})
Judge.hasMany(Jury, {as: 'jury', foreignKey: 'judgeId'})

const _bio_include = (language) => {
    let filter = language ? {language} : true
    return {
        model: Bio,
        required: false,
        as: 'bio',
        attributes: ['language', 'text'],
        where: filter
    }
}

const _image_include = (opts) => Object.assign({}, {
    model: Image,
    required: false,
    as: 'image',
}, opts)

const findAll = () => Judge.findAll({
    include: [ _bio_include(), _image_include({attributes: ['mtime']}) ]
})

const findById = (id) => {
    return Judge.findOne({
        where: {
            id
        },
        include: [ _bio_include(), _image_include({attributes: ['mtime']}) ]
    })
}

const findByContestId = (contestId, language) => Judge.findAll({
    include: [
        {
            model: Jury,
            as: 'jury',
            where: {
                contestId
            },
            attributes: []
        },
        _bio_include(language),
        _image_include({attributes: ['mtime']})
    ]
})

const findByIdWithImage = (id) => {
    return Judge.findOne({
        where: {
            id
        },
        include: _image_include({required: true})
    })
}

const _create_bio = (judgeId, lst, transaction) => Promise.all(
    lst.map(el => Bio.create(Object.assign(el, {judgeId}), {transaction}))
)

const create = (data) => new Promise((resolve, reject) => {
    sql.transaction().then(tx => {
        Judge.create(data, {transaction: tx}).then(judge => {
            _create_bio(judge.id, data.bio, tx).then(bio => {
                tx.commit()
                resolve(Object.assign(judge.toJSON(), {bio}))
            }).catch(err => {
                tx.rollback()
                reject(err)
            })
        }).catch(reject)
    }).catch(reject)
})

const _update_judge = (id, data, transaction) => Judge.update(data, {
    where: {id},
    transaction,
    returning: true,
    limit: 1
}).then(row => row[1][0])

const _replace_bio = (judgeId, lst, transaction) => Bio.destroy({
    where: {judgeId},
    transaction
}).then(() => lst ? _create_bio(judgeId, lst, transaction) : Promise.resolve([]))

const update = (id, data) => new Promise((resolve, reject) => {
    sql.transaction().then(tx => {
        Promise.all([
            _update_judge(id, data, tx),
            _replace_bio(id, data.bio, tx)
        ]).then(([judge, bio]) => {
            tx.commit()
            resolve(Object.assign(judge.toJSON(), {bio}))
        }).catch(err => {
            tx.rollback()
            reject(err)
        })
    }).catch(reject)
})

const updateImage = (judgeId, data) => {
    if (!data) {
        return Image.destroy({where: {judgeId}})
    }
    return findById(judgeId).then(judge => {
        if (!judge) {
            return Promise.reject('judge not found')
        }
        data.judgeId = judgeId
        let p
        if (!judge.image) {
            p = Image.create(data)
        } else {
            p = Image.update(data, { where: {judgeId} })
        }
        return p
    })
}

const addToJury = (judgeId, contestId) => Jury.create({
    contestId,
    judgeId
})

const removeFromJury = (judgeId, contestId) => Jury.destroy({
    where: {
        contestId,
        judgeId
    }
})

const destroy = (id) => Judge.destroy({where: {id}})

module.exports = {
    findAll,
    findById,
    findByContestId,
    findByIdWithImage,
    create,
    update,
    updateImage,
    addToJury,
    removeFromJury,
    destroy
}
