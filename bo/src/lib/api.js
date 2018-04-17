import Vue from 'vue'
import axios from 'axios'
import store from '@/lib/store'

let instance = null

const init = (config) => {
  instance = axios.create({
    baseURL: config.serverAddress + '/' + config.apiVersion
  })
}

const getHeaders = () => {
  let user = store.state.user
  if (Vue.$config.firebase.devMode) {
    return Promise.resolve({
      'Authorization': 'admin',
      'Content-Type': 'application/json',
      'Accept-Language': 'en'
    })
  } else if (user) {
    return user.getIdToken().then(token => {
      return {
        'Authorization': 'Bearer ' + token,
        'Content-Type': 'application/json',
        'Accept-Language': 'en'
      }
    })
  } else {
    throw new Error('Could not create API headers because user is null')
  }
}

const checkAdmin = () => {
  return getHeaders().then(headers => {
    return instance({
      method: 'get',
      url: '/admin/check',
      headers
    })
  }).then(response => {
    return true
  }).catch(e => {
    if (e.response && e.response.status === 403) {
      return false
    }
    apiError(e)
    throw new Error(e)
  })
}

const patchContest = (id, data) => {
  return getHeaders().then(headers => {
    return instance({
      method: 'patch',
      url: '/admin/contest/' + id,
      data,
      headers
    })
  }).then(response => {
    return response
  }).catch(e => {
    apiError(e)
    throw new Error(e)
  })
}

const apiError = e => {
  let error = e.response && e.response.data && e.response.data.error
  if (error) {
    Vue.$log.error('API Error: ', error)
  } else {
    Vue.$log.debug(e)
  }
}

export default {
  init,
  checkAdmin,
  patchContest
}
