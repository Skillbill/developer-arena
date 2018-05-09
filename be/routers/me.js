const http = require('@/lib/http')
const error = require('@/lib/error')
const auth = require('@/lib/auth')
const express = require('express')
const router = express.Router()

router.use(auth.middleware)

router.put('/email', (req, res, next) => {
    auth.setUserEmail(req.user.uid, req.body.email).then(() => {
        res.status(http.noContent).send()
    }).catch(err => {
        next(error.new(error.internal, {cause: err}))
    })
})

module.exports = router
