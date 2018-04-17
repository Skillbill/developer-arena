import Vue from 'vue'
import axios from 'axios'
import store from '@/lib/store'
import feedback from '@/lib/feedback'

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
      'Content-Type': 'application/json'
    })
  } else if (user) {
    return user.getIdToken().then(token => {
      return {
        'Authorization': 'Bearer ' + token,
        'Content-Type': 'application/json'
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
    return null
  })
}

const getContestById = id => {
  return getHeaders().then(headers => {
    return instance({
      method: 'get',
      url: 'admin/contest/' + id,
      headers
    }).then(response => {
      return response.data.contest
    }).catch(e => {
      apiError(e)
      return null
    })
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
    return null
  })
}

const apiError = e => {
  let error = e.response && e.response.data && e.response.data.error
  if (error) {
    feedback.apiError(error)
    Vue.$log.warn('API Error: ', error)
  } else {
    Vue.$log.error(e)
  }
}

export default {
  init,
  checkAdmin,
  getContestById,
  patchContest
}
