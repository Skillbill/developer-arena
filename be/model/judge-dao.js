const sql = require('@/lib/sql')

const Judge = sql.getJudgeTable()
const Image = sql.getJudgeImageTable()
Judge.belongsTo(Image, {as: 'image', targetKey: 'id'})

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
            id: id
        },
        include: {
            model: Image,
            required: false,
            as: 'image',
            attributes: ['mtime']
        }
    })
}

const findByIdWithImage = (id) => {
    return Judge.findOne({
        where: {
            id: id
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
            return Promise.all([
                Promise.resolve(judge),
                data.image ? Image.create(data.image, { transaction: tx }) : Promise.resolve(null)
            ]).then(([judge, image]) => {
                if (image) {
                    judge.set('imageId', image.id)
                    judge.save()
                }
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

const updateImage = (id, data) => new Promise((resolve, reject) => {
    findById(id).then(judge => {
        if (!judge) {
            return reject('judge not found')
        }
        let p
        if (data) {
            if (!judge.imageId) {
                p = Image.create(data).then(image => {
                    judge.set('imageId', image.id)
                    judge.save()
                    return Promise.resolve()
                }).catch(err => Promise.reject(err))
            } else {
                p = Image.update(data, { where: {id: judge.imageId} })
            }
        } else {
            p = Image.destroy({ where: {id: judge.imageId} })
        }
        p.then(resolve).catch(reject)
    }).catch(reject)
})

const destroy = (id) => new Promise((resolve, reject) => {
    findById(id).then(judge => {
        if (!judge) {
            return resolve(0)
        }
        sql.transaction().then(tx => {
            Promise.all([
                Judge.destroy({where: {id: id}, transaction: tx}),
                judge.imageId ? Image.destroy({where: {id: judge.imageId}, transaction: tx}) : Promise.resolve(0)
            ]).then(([count]) => {
                tx.commit()
                resolve(count)
            }).catch(err => {
                tx.rollback()
                reject(err)
            })
        }).catch(reject)
    }).catch(reject)
})

module.exports = {
    findAll,
    findById,
    findByIdWithImage,
    create,
    update,
    updateImage,
    destroy
}
