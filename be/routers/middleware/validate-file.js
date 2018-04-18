const error = require('@/lib/error')
const limits = require('@/limits')

const Image = Object.assign({}, limits.image, {kind: 'image'})
const Deliverable = Object.assign({}, limits.deliverable, {kind: 'deliverable'})

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
    if (file.allowedTypes && !file.allowedTypes.includes(mimetype)) {
        return next(error.new(error.fileInvalidType, {type: mimetype, file: file.kind}))
    }
    next()
}

module.exports = {
    image: (req, res, next) => validate(Image, req, res, next),
    deliverable: (req, res, next) => validate(Deliverable, req, res, next)
}
