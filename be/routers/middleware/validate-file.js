const lk = require('../../lib/lookups')

const Image = {
    kind: 'image',
    maxAllowedSize: 2 * 1024 * 1024,
    allowedTypes: [
        'image/jpeg',
        'image/png'
    ]
}

const Deliverable = {
    kind: 'deliverable',
    maxAllowedSize: 32 * 1024 * 1024,
    allowedTypes: [
        'application/gzip',
        'application/x-tar',
        'application/x-bzip2',
        'application/zip'
    ]
}

const fileSize = (file) => file.data.length

const validate = (obj, req, res, next) => {
    if (!req.files || !req.files[obj.kind]) {
        return next()
    }
    if (fileSize(req.files[obj.kind]) > obj.maxAllowedSize) {
        return res.status(lk.http.unprocessableEntity).send({error: `${obj.kind} too big`})
    }
    const {name, mimetype} = req.files[obj.kind]
    if (!name) {
        return res.status(lk.http.unprocessableEntity).send({error: `no file name specified for ${obj.kind}`})
    }
    if (!obj.allowedTypes.includes(mimetype)) {
        return res.status(lk.http.unsupportedType).send({error: `type ${mimetype} for ${obj.kind} is not supported`})
    }
    next()
}

module.exports = {
    image: (req, res, next) => validate(Image, req, res, next),
    deliverable: (req, res, next) => validate(Deliverable, req, res, next)
}
