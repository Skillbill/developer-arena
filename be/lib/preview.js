const logger = require('@/lib/logger')
const maxSize = require('@/limits').deliverable.maxAllowedExtractedSize
const fs = require('fs-extra')
const fstream = require('fstream')
const path = require('path')
const untar = require('tar').extract
const unzip = require('unzip')

const appRoot = path.dirname(require.resolve('@/package.json'))
const getDirname = (project) => path.join(appRoot, 'preview', project.contestId + '', project.id + '')

const copyToDisk = (file, dir) => new Promise((resolve, reject) => {
    const filepath = path.join(dir, file.name)
    fs.writeFile(filepath, file.data, err => {
        err ? reject(err) : resolve(filepath)
    })
})

const _extract = (file, mime, dir) => new Promise((resolve, reject) => {
    let lst = []
    let bcount = 0
    let rs = new fs.createReadStream(file)

    function checkSize() {
        if (bcount > maxSize) {
            reject(`hit maximum size (${maxSize})`)
            this.end()
        }
    }

    switch (mime) {
    case 'application/x-compressed':
    case 'application/x-zip-compressed':
    case 'application/zip':
    case 'multipart/x-zip':
        rs = rs.pipe(unzip.Parse())
            .on('entry', e => {
                lst.push(e.path)
                e.on('data', function (d) {
                    bcount += d.length
                    checkSize.call(this)
                })
            })
            .on('error', reject)
            .pipe(fstream.Writer(dir || '.'))
        break
    default:
        rs = rs.pipe(untar({C: dir}))
            .on('entry', function(e) {
                lst.push(e.path)
                bcount += e.size
                checkSize.call(this)
            })
            .on('error', reject)
    }
    rs.on('close', () => resolve({files: lst, bytes: bcount}))
})

const extract = (file, options) => new Promise((resolve, reject) => {
    if (!options) {
        options = {}
    }
    copyToDisk(file, options.dst).then(tmpfile => {
        _extract(tmpfile, file.mimetype, options.dst).then(report => {
            resolve(report)
            if (options.cleanup) {
                fs.unlink(tmpfile, err => {
                    if (err) {
                        logger.warn(`could not delete ${tmpfile}: ${err.message}`)
                    }
                })
            }
        }).catch(reject)
    }).catch(reject)
})

const create = (project) => new Promise((resolve, reject) => {
    const dir = getDirname(project)
    fs.remove(dir, err => {
        if (err) {
            logger.warn(`fs.remove ${dir}: ${err.message}`)
        }
        fs.mkdirp(dir, err => {
            if (err) {
                reject(err)
                return
            }
            extract(project.deliverable, {dst: dir, cleanup: true})
                .then(report => {
                    if (report.bytes == 0) {
                        resolve()
                        destroy(project)
                        return
                    }
                    resolve(Object.assign(report, {
                        root: path.relative(appRoot, dir),
                    }))
                })
                .catch(reject)
        })
    })
})

const destroy = (project) => new Promise((resolve, reject) => {
    fs.remove(getDirname(project), err => {
        err ? reject(err) : resolve()
    })
})

module.exports = {
    create,
    destroy
}
