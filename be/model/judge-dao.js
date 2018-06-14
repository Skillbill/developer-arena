const sql = require('@/lib/sql')

const Judge = sql.getJudgeTable()
const Jury = sql.getJuryTable()
const Image = sql.getJudgeImageTable()

Judge.hasOne(Image, {as: 'image', foreignKey: 'judgeId'})
Judge.hasMany(Jury, {as: 'jury', foreignKey: 'judgeId'})

const findAll = () => Judge.findAll({
    include: {
        model: Image,
        required: false,
        as: 'image',
        attributes: ['mtime']
    }
})

const findById = (id) => {
    return Judge.findOne({
        where: {
            id
        },
        include: {
            model: Image,
            required: false,
            as: 'image',
            attributes: ['mtime']
        }
    })
}

const findByContestId = (contestId) => Judge.findAll({
    include: [
        {
            model: Jury,
            as: 'jury',
            where: {
                contestId
            },
            attributes: []
        },
        {
            model: Image,
            as: 'image',
            attributes: ['mtime']
        }
    ]
})

const findByIdWithImage = (id) => {
    return Judge.findOne({
        where: {
            id
        },
        include: {
            model: Image,
            required: true,
            as: 'image',
        }
    })
}

const create = (data) => new Promise((resolve, reject) => {
    sql.transaction().then(tx => {
        Judge.create(data, { transaction: tx }).then(judge => {
            let p
            if (data.image) {
                data.image.judgeId = judge.id
                p = Image.create(data.image, { transaction: tx })
            } else {
                p = Promise.resolve()
            }
            p.then(() => {
                tx.commit()
                resolve(judge)
            }).catch(err => {
                tx.rollback()
                reject(err)
            })
        }).catch(err => {
            reject(err)
        })
    }).catch(err => {
        reject(err)
    })
})

const update = (id, data) => new Promise((resolve, reject) => {
    Judge.update(data, {
        where: {
            id: id
        },
        returning: true,
        limit: 1
    }).then(row => {
        resolve(row[1][0])
    }).catch(err => {
        reject(err)
    })
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
