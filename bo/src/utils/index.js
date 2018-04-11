import configuration from '../../static/configuration'

export function getApiUrl (path) {
  return configuration.serverAddress + '/' + configuration.apiVersion + path
}
