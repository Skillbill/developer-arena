const http = require('@/lib/http')
const limits = require('@/lib/config').get().limits
const express = require('express')
const router = express.Router({mergeParams: true})

router.get('/', (req, res) => {
    res.status(http.ok).send({limits: limits})
})

module.exports = router
