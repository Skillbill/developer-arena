const logger = require('@/lib/logger')
const libconfig = require('@/lib/config')
const auth = require('@/lib/auth')

const express = require('express')
const bodyParser = require('body-parser')
const i18n = require('i18n')
const fileUpload = require('express-fileupload')
const cors = require('cors')
const Confit = require('confit-client')

async function init(app) {
    logger.log('starting server')
    try {
        const cfgpath = process.env.CONFIG || require.resolve('@/config.json')
        let confit
        if (process.env.CONFIT_TOKEN && process.env.CONFIT_REPOID) {
            confit = new Confit()
            logger.info(`confit repoId: ${confit.repoId}`)
        }
        const config = await libconfig.init(confit || cfgpath)
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
