const moment = require('moment')
const out = console;

(() => {
    ['log', 'trace', 'info', 'debug', 'warn', 'error'].forEach(kind => {
        module.exports[kind] = (...args) => {
            const now = moment(new Date()).format()
            args.unshift(`[${now}]`)
            out[kind](...args)
        }
    })
})()
