const express = require('express')
const router = express.Router({mergeParams: true})

router.use('/limits', require('./limits'))
router.use('/contest', require('./contest'))
router.use('/admin', require('./admin'))

const errorMW = require('./middleware/error')
router.use(function(err, req, res, next) {
    errorMW(err, req, res, next)
})

module.exports = router
