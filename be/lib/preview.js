const logger = require('@/lib/logger')
const tar = require('tar')
const fs = require('fs-extra')
const path = require('path')
const stream = require('stream')

const approot = path.dirname(require.resolve('@/package.json'))

const prepareDir = (project) => new Promise((resolve, reject) => {
    const v = [ approot, 'preview', project.contestId + '', project.id + '' ]
    const dir = path.join(...v)
    fs.remove(dir, () => {
        fs.mkdirp(dir, err =>  err ? reject(err) : resolve(dir))
    })
})

const extractToFs = (project) => new Promise((resolve, reject) => {
    prepareDir(project).then(dir => {
        const ss = new stream.PassThrough()
        ss.pipe(
            tar.extract({
                cwd: dir
            })
        )
        ss.on('error', err => { throw err })
        ss.on('end', () => resolve(dir))
        ss.end(project.deliverable.data)
    }).catch(err => {
        logger.error(`failed to extract: ${err}`)
        reject(err)
    })
})

module.exports = {
    extractToFs
}
