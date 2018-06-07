const logger = require('@/lib/logger')
const fs = require('fs')

let config = {}

const initFromPath = (filePath) => new Promise((resolve, reject) => {
    logger.log(`initializing config from ${filePath}`)
    fs.readFile(filePath, (err, data) => {
        if (err) {
            return reject(err)
        }
        try {
            config = JSON.parse(data)
            resolve(config)
        } catch (err) {
            reject(`${filePath}: ${err}`)
        }
    })
})

const initWithConfit = (client) => new Promise((resolve, reject) => {
    const env = process.env.NODE_ENV
    if (!env) {
        return reject('confit error: NODE_ENV not set')
    }
    const path = `/${env}/be.json`
    logger.log(`initializing with Confit from ${path}`)
    client.getConf(path).then(obj => {
        config = obj
        resolve(config)
    }).catch(reject)
})

function init(resource) {
    switch (typeof resource) {
    case 'string':
        return initFromPath(resource)

    case 'object':
        return initWithConfit(resource)

    default:
        return Promise.reject('unexpected resource type: ' + typeof resource)
    }
}

module.exports = {
    init,
    get: () => Object.assign({}, config)
}
