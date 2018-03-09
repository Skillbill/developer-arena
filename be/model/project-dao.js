const lk = require('../lib/lookups');
const logger = require('../lib/logger');
const sql = require('../lib/sql');

const model = {
  project: require('./project'),
  deliverable: require('./deliverable')
}

const Op = require('sequelize').Op

const getProjectById = (id) => {
  return sql.getProjectTable().findById(id);
}

const getProjectsByContest = (contestId) => {
  return sql.getProjectTable().findAll({
    where: {
      [model.project.contestId.field]: contestId
    }
  });
};

const getWithDeliverable = (projectId) => {
  const projectTable = sql.getProjectTable();
  const delivTable = sql.getDeliverableTable();
  projectTable.hasOne(delivTable, {as: 'deliverable', foreignKey: model.deliverable.projectId});
  return projectTable.findOne({
    where: {
      id: projectId
    },
    include: [{
      model: delivTable,
      as: 'deliverable'
    }]
  });
}

const submit = (project) => {
  if (!project.deliverable) {
    return sql.getProjectTable().create(project);
  }
  return new Promise((resolve, reject) => {
    sql.getProjectTable().create(project).then(created => {
      sql.getDeliverableTable().create({
        projectId: created.id,
        mimetype: project.deliverable.mimetype,
        data: project.deliverable.data
      }).then(() => resolve(created))
    }).catch (err => {
      reject(err);
    });
  });
}

module.exports = {
  getProjectById,
  getProjectsByContest,
  getWithDeliverable,
  submit
};
