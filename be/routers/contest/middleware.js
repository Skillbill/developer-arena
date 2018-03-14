const lk = require('../../lib/lookups')

const maxAllowedSize = 32 * 1024 * 1024

const allowedTypes = [
    'application/gzip',
    'application/x-tar',
    'application/x-bzip2',
    'application/zip'
]

const fileSize = (file) => file.data.length

const validateDeliverable = (req, res, next) => {
    if (!req.files || !req.files.deliverable) {
        return next()
    }
    if (fileSize(req.files.deliverable) > maxAllowedSize) {
        return res.status(lk.http.unprocessableEntity).send({error: 'file too big'})
    }
    const {name, mimetype} = req.files.deliverable
    if (!name) {
        return res.status(lk.http.unprocessableEntity).send({error: 'no file name specified'})
    }
    if (!allowedTypes.includes(mimetype)) {
        return res.status(lk.http.unsupportedType).send({error: `file type ${mimetype} is not supported`})
    }
    next()
}

module.exports = {
    validateDeliverable
}
