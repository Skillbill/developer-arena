const error = require('../../lib/error')

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

const validate = (file, req, res, next) => {
    if (!req.files || !req.files[file.kind]) {
        return next()
    }
    if (fileSize(req.files[file.kind]) > file.maxAllowedSize) {
        return next(error.new(error.fileTooBig, {file: file.kind}))
    }
    const {name, mimetype} = req.files[file.kind]
    if (!name) {
        return next(error.new(error.fileNoName, {file: file.kind}))
    }
    if (!file.allowedTypes.includes(mimetype)) {
        return next(error.new(error.fileInvalidType, {type: mimetype, file: file.kind}))
    }
    next()
}

module.exports = {
    image: (req, res, next) => validate(Image, req, res, next),
    deliverable: (req, res, next) => validate(Deliverable, req, res, next)
}
