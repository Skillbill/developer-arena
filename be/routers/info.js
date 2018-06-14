const express = require('express')
const router = express.Router({mergeParams: true})
const http = require('@/lib/http')
const version = require('../version.json')

router.get('/', (req, res) => {
    res.status(http.ok).send(version)
})

module.exports = router
