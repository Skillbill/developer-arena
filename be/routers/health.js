const http = require('@/lib/http')
const express = require('express')
const router = express.Router()

router.get('/', (req, res) => {
    res.status(http.ok).send({
        uptime: process.uptime()
    })
})

module.exports = router
