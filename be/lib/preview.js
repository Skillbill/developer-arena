const logger = require('@/lib/logger')
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

const _extract = (file, mime, dir, result) => {
    const onEntry = (entry) => {
        if (entry.type != 'Directory') {
            result.push(entry.path)
        }
    }
    const rs = new fs.createReadStream(file)
    switch (mime) {
    case 'application/x-compressed':
    case 'application/x-zip-compressed':
    case 'application/zip':
    case 'multipart/x-zip':
        return rs.pipe(unzip.Parse()).on('entry', onEntry).pipe(fstream.Writer(dir || '.'))
    default:
        return rs.pipe(untar({C: dir})).on('entry', onEntry)
    }
}

const extract = (file, options) => new Promise((resolve, reject) => {
    if (!options) {
        options = {}
    }
    copyToDisk(file, options.dst).then(tmpfile => {
        let lst = []
        _extract(tmpfile, file.mimetype, options.dst, lst)
            .on('error', err => reject(err))
            .on('close', () => {
                resolve(lst)
                if (options.cleanup) {
                    fs.unlink(tmpfile, err => {
                        if (err) {
                            logger.warn(`could not delete ${tmpfile}: ${err}`)
                        }
                    })
                }
            })
    }).catch(reject)
})

const create = (project) => new Promise((resolve, reject) => {
    const dir = getDirname(project)
    fs.remove(dir, () => {
        fs.mkdirp(dir, err => {
            if (err) {
                reject(err)
                return
            }
            extract(project.deliverable, {dst: dir, cleanup: true})
                .then(files => {
                    resolve({
                        root: path.relative(appRoot, dir),
                        files: files
                    })
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
