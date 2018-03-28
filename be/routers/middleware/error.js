const logger = require('../../lib/logger')
const http = require('../../lib/lookups').http
const error = require('../../lib/error')

const logError = [
    http.internalError
]

module.exports = (err, req, res) => { // add next?
    if (!err) {
        logger.trace()
        logger.error(`FIXME: error "${err}" passed to error middleware`)
        err = error.internal
    }
    const log = logError.includes(err.http) ? logger.error : logger.info
    log({error: err})

    let args = {}
    if (err.args) {
        Object.keys(err.args).map(k => {
            args[k] = res.__(err.args[k]) || err.args[k]
        })
    }
    res.status(err.http).send({
        error: {
            code: err.code,
            msg: res.__(err.msg, args)
        }
    })
}
