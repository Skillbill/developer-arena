const logger = require('@/lib/logger')
const fs = require('fs-extra')
const path = require('path')
const stream = require('stream')
const tar = require('tar')

const approot = path.dirname(require.resolve('@/package.json'))
const getDirname = (project) => path.join(approot, 'preview', project.contestId + '', project.id + '')

const extract = (file, dir) => new Promise((resolve, reject) => {
    const ss = new stream.PassThrough()
    ss.pipe(
        tar.extract({
            cwd: dir
        })
    )
    ss.on('error', err => {
        logger.error(`failed to extract: ${err}`)
        reject(err)
    })
    ss.on('end', () => resolve(dir))
    ss.end(file.data)
})

const create = (project) => new Promise((resolve, reject) => {
    const dir = getDirname(project)
    fs.remove(dir, () => {
        fs.mkdirp(dir, err => {
            if (err) {
                reject(err)
                return
            }
            extract(project.deliverable, dir).then(resolve).catch(reject)
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
