const logger = require('@/lib/logger')
const fs = require('fs')
let config = {}

module.exports = {
    init: (filePath) => {
        logger.log(`initializing config from ${filePath}`)
        try {
            config = JSON.parse(fs.readFileSync(filePath))
        } catch (err) {
            throw `${filePath}: ${err}`
        }
        return config
    },
    get: () => Object.assign({}, config)
}
