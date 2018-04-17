import Vue from 'vue'

export function getApiUrl (path) {
  return Vue.$config.serverAddress + '/' + Vue.$config.apiVersion + path
}
