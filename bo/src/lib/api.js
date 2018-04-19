import Vue from 'vue'
import axios from 'axios'
import store from '@/lib/store'
import feedback from '@/lib/feedback'
import * as utils from '@/lib/utils'

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

const getContests = () => {
  return getHeaders().then(headers => {
    return instance({
      method: 'get',
      url: 'admin/contest',
      headers
    }).then(response => {
      let contests = response.data.contests
      contests.sort((a, b) => a.id > b.id)
      return contests
    }).catch(e => {
      apiError(e)
      return null
    })
  })
}

const getContestById = id => {
  return getHeaders().then(headers => {
    return instance({
      method: 'get',
      url: 'admin/contest/' + id,
      headers
    }).then(response => {
      let contest = response.data.contest
      contest.i18n = utils.fromI18n(contest.i18n)
      return contest
    }).catch(e => {
      apiError(e)
      return null
    })
  })
}

const patchContest = (contest) => {
  let data = Object.assign({}, contest)
  data.i18n = utils.toI18n(data.i18n)
  return getHeaders().then(headers => {
    return instance({
      method: 'patch',
      url: '/admin/contest/' + contest.id,
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

const createContest = (contest) => {
  let data = Object.assign({}, contest)
  data.i18n = utils.toI18n(data.i18n)
  return getHeaders().then(headers => {
    return instance({
      method: 'post',
      url: '/admin/contest',
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
    if (error.code === 1017) {
      feedback.invalidDates()
    } else {
      feedback.apiError(error)
      Vue.$log.warn('API Error: ', error)
    }
  } else {
    Vue.$log.error(e)
  }
}

export default {
  init,
  checkAdmin,
  getContests,
  getContestById,
  patchContest,
  createContest
}
