const http = require('@/lib/http')
const moment = require('moment')

const fmt_rfc7232 = 'ddd, DD MMM YYYY HH:mm:ss z'

const sendfile = (res, file, inline) => {
    const mtime = moment(file.mtime).tz('GMT').format(fmt_rfc7232)
    res.set('Content-Type', file.mimetype)
    res.set('Last-Modified', mtime)
    if (!inline) {
        res.set('Content-Disposition', `attachment; filename="${file.name}"`)
    }
    res.status(http.ok).send(file.data)
}

module.exports = sendfile
