const express = require('express')
const router = express.Router({mergeParams: true})

router.get('/', (req, res) => {
    res.send({
        welcome: res.__('welcome')
    })
})

module.exports = router
