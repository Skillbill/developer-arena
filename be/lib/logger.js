const moment = require('moment')
const colors = require('colors/safe')
const out = console

const theme = {
    log: 'white',
    trace: 'grey',
    info: 'grey',
    debug: 'cyan',
    warn: 'yellow',
    error: 'red'
}

colors.setTheme(theme)
Object.keys(theme).forEach(kind => {
    module.exports[kind] = (...args) => {
        const now = moment(new Date()).format()
        out[kind](colors[theme[kind]](`${now}`, ...args.map(e => typeof e == 'object' ? JSON.stringify(e) : e)))
    }
})
