const express = require('express')

const router = express.Router({mergeParams: true})

router.use('/', require('./contest'))
router.use('/:contestId/project/', require('./project'))

module.exports = router
