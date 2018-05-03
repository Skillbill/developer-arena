const http = require('@/lib/http')
const sql = require('@/lib/sql')
const express = require('express')
const router = express.Router()

router.get('/', (req, res) => {
    sql.checkConnection().then(err => {
        res.status(http.ok).send({
            uptime: process.uptime(),
            db: {
                connected: !err,
                error: err
            }
        })
    })
})

module.exports = router
