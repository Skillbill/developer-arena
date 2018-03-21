const sql = require('../lib/sql')
const lk = require('../lib/lookups')

const model = {
    project: require('./project'),
    vote: require('./vote'),
    file: require('./file')
}

const fileKind = {
    deliverable: 'DELIVERABLE',
    image: 'IMAGE'
}

const getProjectById = (id) => {
    const projectTable = sql.getProjectTable()
    const fileTable = sql.getFileTable()
    const voteTable = sql.getVoteTable()
    projectTable.hasOne(fileTable, {as: 'deliverable', foreignKey: model.file.projectId})
    projectTable.hasMany(voteTable, {as: 'votes', foreignKey: model.file.projectId})
    return projectTable.findOne({
        where: {
            id: id
        },
        include: [
            {
                model: fileTable,
                required: false,
                as: 'deliverable',
                attributes: [model.file.name.field],
                where: {
                    kind: fileKind.deliverable
                }
            },
            {
                model: voteTable,
                required: false,
                as: 'votes',
                attributes: [[model.vote.voterId.field, 'userId']],
                where: {
                    [model.vote.projectId.field]: id
                }
            }
        ]
    })
}

const getProjectsByContest = (contestId) => {
    return sql.getProjectTable().findAll({
        where: {
            [model.project.contestId.field]: contestId
        }
    })
}

const getWithDeliverable = (projectId) => {
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

const getWithImage = (projectId) => {
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

const createFile = (projectId, kind, file) => {
    return sql.getFileTable().create({
        projectId: projectId,
        mimetype: file.mimetype,
        kind: kind,
        mtime: file.mtime,
        name: file.name,
        data: file.data
    })
}

const submit = (project) => {
    return new Promise((resolve, reject) => {
        sql.getProjectTable().create(project).then(created => {
            return Promise.all([
                project.deliverable ? createFile(created.id, fileKind.deliverable, project.deliverable) : Promise.resolve(),
                project.image ? createFile(created.id, fileKind.image, project.image) : Promise.resolve()
            ]).then(() =>  resolve(created))
        }).catch (err => {
            reject(err.name && err.name === 'SequelizeUniqueConstraintError' ? lk.error.alreadyExists : err)
        })
    })
}

const vote = (project, voterId) => {
    return new Promise((resolve, reject) => {
        sql.getVoteTable().create({
            contestId: project.contestId,
            projectId: project.id,
            voterId: voterId
        }).then(resolve).catch(err => {
            reject(err.name && err.name === 'SequelizeUniqueConstraintError' ? lk.error.alreadyExists : err)
        })
    })
}

module.exports = {
    getProjectById,
    getProjectsByContest,
    getWithDeliverable,
    getWithImage,
    submit,
    vote
}
