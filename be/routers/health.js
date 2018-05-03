const http = require('@/lib/http')
const error = require('@/lib/error')
const sql = require('@/lib/sql')
const express = require('express')
const router = express.Router()

router.get('/', (req, res, next) => {
    sql.checkConnection().then(err => {
        res.status(http.ok).send({
            uptime: process.uptime(),
            db: {
                connected: !err,
                error: err
            }
        })
    }).catch(err => {
        next(error.new(error.internal, {cause: err}))
    })
})

module.exports = router
