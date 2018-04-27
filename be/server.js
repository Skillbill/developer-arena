const logger = require('@/lib/logger')
const libconfig = require('@/lib/config')
const auth = require('@/lib/auth')

const path = require('path')
const express = require('express')
const bodyParser = require('body-parser')
const i18n = require('i18n')
const fileUpload = require('express-fileupload')
const cors = require('cors')

logger.info('starting server')

try {
    const cfgpath = process.env.CONFIG || path.join(__dirname, './config.json')
    const config = libconfig.init(path.resolve(cfgpath))

    auth.init(config)
    const app = express()
    logger.info('starting api')
    i18n.configure(Object.assign({
        queryParameter: 'lang',
        directory: __dirname + '/locales',
        updateFiles: false
    }, config.i18n))
    app.disable('x-powered-by')
    app.use(bodyParser.json())
    app.use(bodyParser.urlencoded({extended: false}))
    app.use(i18n.init)
    app.use(fileUpload())
    app.use(cors())
    app.use(require('./routers/middleware/logger'))
    app.use('/info', require('./routers/info'))
    app.use('/1.0', require('./routers'))

    const port = process.env.BE_PORT || 3000
    app.listen(port, () => {
        logger.log(`server listening on ${port}`)
    })
} catch (error) {
    logger.error('could not start the server:', error)
}

if (process.pid == 1) { // docker
    // allow ^C on a foreground instance to stop the container
    process.on('SIGINT', () => {
        logger.log('got SIGINT: exit')
        process.exit()
    })

    // promptly shutdown on docker stop */
    process.on('SIGTERM', () => {
        logger.log('got SIGTERM: exit')
        process.exit()
    })
}
