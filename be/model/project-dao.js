const sql = require('../lib/sql')

const model = {
    project: require('./project'),
    vote: require('./vote'),
    file: require('./file')
}

const fileKind = {
    deliverable: 'DELIVERABLE',
    image: 'IMAGE'
}

const getFullTable = (includes) => {
    const table = sql.getProjectTable()
    const fileTable = sql.getFileTable()
    const voteTable = sql.getVoteTable()
    table.hasMany(fileTable, {as: 'files', foreignKey: model.file.projectId})
    table.hasMany(voteTable, {as: 'votes', foreignKey: model.file.projectId})
    includes.push(...[
        {
            model: fileTable,
            required: false,
            as: 'files',
            attributes: [model.file.name.field, model.file.kind.field],
        },
        {
            model: voteTable,
            required: false,
            as: 'votes',
            attributes: [[model.vote.voterId.field, 'userId'], 'ts']
        }
    ])
    return table
}

const findById = (id) => {
    let includes = []
    return getFullTable(includes).findOne({
        where: {
            id: id
        },
        include: includes
    })
}

const findByUser = (contestId, userId) => {
    let includes = []
    return getFullTable(includes).findOne({
        where: {
            contestId: contestId,
            userId: userId,
        },
        include: includes
    })
}

const findAllByContest = (contestId) => {
    let includes = []
    return getFullTable(includes).findAll({
        where: {
            contestId: contestId
        },
        include: includes
    })
}

const findWithDeliverable = (projectId) => {
    const projectTable = sql.getProjectTable()
    const fileTable = sql.getFileTable()
    projectTable.hasOne(fileTable, {as: 'deliverable', foreignKey: model.file.projectId})
    return projectTable.findOne({
        where: {
            id: projectId
        },
        include: [{
            model: fileTable,
            as: 'deliverable',
            where: {
                kind: fileKind.deliverable
            }
        }]
    })
}

const findWithImage = (projectId) => {
    const projectTable = sql.getProjectTable()
    const fileTable = sql.getFileTable()
    projectTable.hasOne(fileTable, {as: 'image', foreignKey: model.file.projectId})
    return projectTable.findOne({
        where: {
            id: projectId
        },
        include: [{
            model: fileTable,
            as: 'image',
            where: {
                kind: fileKind.image
            }
        }]
    })
}

const createFile = (projectId, kind, file, tx) => {
    return sql.getFileTable().create({
        projectId: projectId,
        mimetype: file.mimetype,
        kind: kind,
        mtime: file.mtime,
        name: file.name,
        data: file.data
    }, {transaction: tx})
}

const replaceFile = (projectId, userId, kind, file, tx) => {
    const table = sql.getFileTable()
    const projectTable = sql.getProjectTable()
    table.hasMany(projectTable, {as: 'project', foreignKey: model.file.projectId})
    return new Promise((resolve, reject) => {
        table.destroy({
            where: {
                projectId: projectId,
                kind: kind
            },
            include: [{
                model: projectTable,
                as: 'project',
                attributes: [[model.project.userId.field, 'userId']],
                where: {
                    userId: userId
                }
            }],
            transaction: tx
        }).then(() => {
            return createFile(projectId, kind, file, tx)
        }).then(() => {
            resolve()
        }).catch(err => {
            reject(err)
        })
    })
}

const submit = (project) => {
    return new Promise((resolve, reject) => {
        sql.transaction().then(tx => {
            return sql.getProjectTable().create(project, {transaction: tx}).then(created => {
                return Promise.all([
                    Promise.resolve(created),
                    project.deliverable ? createFile(created.id, fileKind.deliverable, project.deliverable, tx) : Promise.resolve(),
                    project.image ? createFile(created.id, fileKind.image, project.image, tx) : Promise.resolve()
                ])
            }).then(([newProject]) => {
                tx.commit()
                resolve(newProject)
            }).catch (err => {
                tx.rollback()
                reject(err)
            })
        })
    })
}

const update = (projectId, data) => {
    return new Promise((resolve, reject) => {
        sql.transaction().then(tx => {
            return sql.getProjectTable().update(data, {
                fields: ['title', 'description', 'updated', 'repoURL', 'video'],
                returning: true,
                limit: 1,
                where: {
                    id: projectId
                }
            }).then(row => {
                return Promise.all([
                    Promise.resolve(row[1][0]),
                    data.deliverable ? replaceFile(projectId, data.userId, fileKind.deliverable, data.deliverable, tx) : Promise.resolve(),
                    data.image ? replaceFile(projectId, data.userId, fileKind.image, data.image, tx) : Promise.resolve()
                ])
            }).then(([project]) => {
                tx.commit()
                resolve(project)
            }).catch (err => {
                tx.rollback()
                reject(err)
            })
        })
    })
}

const vote = (project, voterId) => {
    return new Promise((resolve, reject) => {
        sql.getVoteTable().create({
            contestId: project.contestId,
            projectId: project.id,
            voterId: voterId,
            ts: new Date()
        }).then(resolve).catch(err => {
            reject(err)
        })
    })
}

module.exports = {
    findById,
    findByUser,
    findAllByContest,
    findWithDeliverable,
    findWithImage,
    submit,
    update,
    vote
}
