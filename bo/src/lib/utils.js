import Vue from 'vue'

export function getApiUrl (path) {
  return Vue.prototype.$config.serverAddress + '/' + Vue.prototype.$config.apiVersion + path
}
