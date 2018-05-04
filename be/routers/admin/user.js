const http = require('@/lib/http')
const error = require('@/lib/error')
const auth = require('@/lib/auth')
const express = require('express')
const router = express.Router()

router.get('/:userId', getUserInfo)

function getUserInfo(req, res, next) {
    const id = req.params.userId
    auth.getUserById(id).then(user => {
        if (!user) {
            return next(error.userNotFound)
        }
        res.status(http.ok).send({user: user})
    }).catch(err => {
        next(error.new(error.internal, {cause: err}))
    })
}

module.exports = router
