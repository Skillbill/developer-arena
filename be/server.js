const logger = require('@/lib/logger')
const libconfig = require('@/lib/config')
const auth = require('@/lib/auth')

const express = require('express')
const bodyParser = require('body-parser')
const i18n = require('i18n')
const fileUpload = require('express-fileupload')
const cors = require('cors')

async function init(app) {
    logger.log('starting server')
    try {
        let config
        if (process.env.CONFIT_REPO_SECRET && process.env.CONFIT_REPO_ID) {
            config = await libconfig.initWithConfit()
        } else {
            config = await libconfig.initFromPath()
        }
        auth.init(config)
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

        if (config.server.logger) {
            app.use(require('./routers/middleware/logger'))
        }
        app.use('/info', require('./routers/info'))
        app.use('/1.0', require('./routers'))
        const port = config.server.port
        if (port) {
            app.listen(port, () => {
                logger.log(`server listening on ${port}`)
            })
        }
    } catch (error) {
        logger.error('could not start the server:', error)
    }
}

for (const signal of ['SIGINT', 'SIGTERM']) {
    process.on(signal, () => {
        logger.log(`got ${signal}: exit`)
        process.exit()
    })
}

const app = express()
init(app)

module.exports = app
