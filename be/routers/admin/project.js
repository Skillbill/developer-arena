const http = require('@/lib/http')
const persistence = require('@/lib/persistence')
const error = require('@/lib/error')
const express = require('express')
const router = express.Router({mergeParams: true})

router.put('/:projectId/approve', approveProject)
router.delete('/:projectId/approve', approveProject)

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
