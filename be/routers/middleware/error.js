const logger = require('@/lib/logger')
const http = require('@/lib/http')
const error = require('@/lib/error')

const logError = [
    http.internalError
]

module.exports = (err, req, res) => {
    if (!err || !err.http) {
        logger.error('FIXME: invalid err passed to error middleware')
        logger.error(err)
        err = error.new(error.internal, {cause: 'unknown'})
    }
    if (logError.includes(err.http)) {
        logger.error({error: err})
    }
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
