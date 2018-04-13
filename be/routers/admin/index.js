const auth = require('@/lib/auth')
const logger = require('@/lib/logger')
const error = require('@/lib/error')
const express = require('express')
const router = express.Router({mergeParams: true})

router.all('*', auth.middleware, adminCheck)
router.use('/contest', require('./contest'))

function adminCheck(req, res, next) {
    if (!req.user.isAdmin) {
        logger.warn(`admin request rejected for ${req.user.uid}`)
        return next(error.notAdmin)
    }
    next()
}

module.exports = router
