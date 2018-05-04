const http = require('@/lib/http')
const persistence = require('@/lib/persistence')
const error = require('@/lib/error')
const express = require('express')
const router = express.Router()

router.delete('/:projectId', deleteProject)
router.put('/:projectId/approve', approveProject)
router.delete('/:projectId/approve', approveProject)

function deleteProject(req, res, next) {
    const id = req.params.projectId
    persistence.destroyProject(id).then(count => {
        if (count == 0) {
            return next(error.projectNotFound)
        }
        res.status(http.noContent).send()
    }).catch(err => {
        next(error.new(error.internal, {cause: err}))
    })
}

function approveProject(req, res, next) {
    const id = req.params.projectId
    const value = (req.method == 'PUT') ? true : false
    persistence.getProjectById(id).then(project => {
        if (!project) {
            return next(error.projectNotFound)
        }
        return persistence.setProjectApproved(id, value)
    }).then(() => {
        res.status(http.noContent).send()
    }).catch(err => {
        next(error.new(error.internal, {cause: err}))
    })
}

module.exports = router
