const fs = require('fs')
const url = require('url')
const configPath = 'static/configuration.js'

const panic = (str) => {
  console.error(str)
  process.exit(1)
}

fs.readFile(configPath, (err, data) => {
  if (err) {
    panic(`could not load configuration file ${configPath}: ${err}`)
  }
  let config = eval(data.toString()) // configuration = { ... }
  let be = url.parse(config.serverAddress)
  be.protocol = (process.env['BE_PROTO'] || be.protocol).replace(/:$/, '')
  be.hostname = process.env['BE_HOST'] || be.hostname
  be.port = process.env['BE_PORT'] || be.port
  config.serverAddress = `${be.protocol}://${be.hostname}:${be.port}`
  console.log(config)
  fs.writeFile(configPath, `configuration = ${JSON.stringify(config)}`, (err) => {
    if (err) {
      panic(`could not write config file ${configPath}: ${err}`)
    }
  })
})
