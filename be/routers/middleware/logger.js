const logger = require('@/lib/logger')

module.exports = (req, res, next) => {
    res.on('finish', () => {
        const xff = req.headers['x-forwarded-for']
        logger.info(...[
            xff ? xff.split(',')[0] : req.ip,
            `"${req.user ? req.user.uid : ''}"`,
            `"${req.method} ${req.originalUrl}"`,
            res.statusCode,
            `"${req.headers['user-agent']}"`
        ])
    })
    next()
}
