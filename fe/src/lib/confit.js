const http = require('http')
const https = require('https')
const qs = require('querystring')

const defaults = {
  hostname: process.env['CONFIT_HOST'] || 'confit.skillbill.net/api',
  port: process.env['CONFIT_PORT'],
  token: process.env['CONFIT_TOKEN'],
  repoId: process.env['CONFIT_REPOID'],
  insecure: process.env['CONFIT_INSECURE'] || false
}

const Confit = function (options) {
  if (!options) {
    options = {}
  }
  for (const k in defaults) {
    this[k] = options[k] !== undefined ? options[k] : defaults[k]
  }
}

Confit.prototype._getConf = function (path) {
  const agent = this.insecure ? http : https
  return new Promise((resolve, reject) => {
    let data = ''
    agent.get({
      host: this.hostname,
      port: this.port,
      headers: this.token ? {Authorization: `token ${this.token}`} : undefined,
      path: path
    }, res => {
      if (res.statusCode < 200 || res.statusCode > 299) {
        reject(new Error(`Confit call failed with status: ${res.statusCode}: ${res.statusMessage} (at ${res.url})`))
      } else {
        res.on('data', chunk => { data += chunk })
        res.on('end', () => resolve(JSON.parse(data)))
      }
    }).on('error', err => reject(err))
  })
}

Confit.prototype.getConf = function (rsc, options) {
  if (!options) {
    options = {}
  }
  let relpath = `/repo/${this.repoId}`
  if (options.alias) {
    relpath += `/alias/${rsc}`
  } else {
    relpath += `/path/${rsc}`
  }
  if (options.ref) {
    relpath += '?' + qs.stringify({ref: options.ref})
  }
  return this._getConf(relpath)
}

export default Confit
