const logger = require('@/lib/logger')
const fs = require('fs')
const confit = require('confit-client')

let config = {}

const initFromPath = () => new Promise((resolve, reject) => {
    const cfgpath = process.env.CONFIG || require.resolve('@/config.json')
    logger.log(`initializing config from ${cfgpath}`)
    fs.readFile(cfgpath, (err, data) => {
        if (err) {
            return reject(err)
        }
        try {
            config = JSON.parse(data)
            resolve(config)
        } catch (err) {
            reject(`${cfgpath}: ${err}`)
        }
    })
})

const initWithConfit = () => new Promise((resolve, reject) => {
    const env = process.env.NODE_ENV
    if (!env) {
        return reject('confit error: NODE_ENV not set')
    }
    const path = `/${env}/be.json`
    logger.log(`initializing with Confit from ${path}`)
    confit.load({ path }).then(obj => {
        config = obj
        resolve(config)
    }).catch(reject)
})

module.exports = {
    initWithConfit,
    initFromPath,
    get: () => Object.assign({}, config)
}
