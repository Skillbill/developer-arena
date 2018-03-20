const sql = require('../lib/sql')
const lk = require('../lib/lookups')

const model = {
    project: require('./project'),
    deliverable: require('./deliverable')
}

const getProjectById = (id) => {
    const projectTable = sql.getProjectTable()
    const delivTable = sql.getDeliverableTable()
    projectTable.hasOne(delivTable, {as: 'deliverable', foreignKey: model.deliverable.projectId})
    return projectTable.findOne({
        where: {
            id: id
        },
        include: [{
            model: delivTable,
            required: false,            
            as: 'deliverable',
            attributes: [model.deliverable.name.field]
        }]
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
    const delivTable = sql.getDeliverableTable()
    projectTable.hasOne(delivTable, {as: 'deliverable', foreignKey: model.deliverable.projectId})
    return projectTable.findOne({
        where: {
            id: projectId
        },
        include: [{
            model: delivTable,
            as: 'deliverable'
        }]
    })
}

const submit = (project) => {
    if (!project.deliverable) {
        return sql.getProjectTable().create(project)
    }
    return new Promise((resolve, reject) => {
        sql.getProjectTable().create(project).then(created => {
            sql.getDeliverableTable().create({
                projectId: created.id,
                mimetype: project.deliverable.mimetype,
                data: project.deliverable.data
            }).then(() => resolve(created))
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
    submit,
    vote
}
