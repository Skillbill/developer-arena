const logger = require('./logger')
const fs = require('fs')
let config = {}

module.exports = {
    init: (filePath) => {
        logger.log(`initializing config from ${filePath}`)
        config = JSON.parse(fs.readFileSync(filePath))
        return config
    },
    get: () => Object.assign({}, config)
}
