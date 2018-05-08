import Vue from 'vue'
import axios from 'axios'
import store from '@/lib/store'
import feedback from '@/lib/feedback'
import * as utils from '@/lib/utils'
import auth from './auth'

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

const deleteContest = (id) => {
  return getHeaders().then(headers => {
    return instance({
      method: 'delete',
      url: '/admin/contest/' + id,
      headers
    })
  }).then(response => {
    return response
  }).catch(e => {
    apiError(e)
    return null
  })
}

const getProjectsByContest = (contestId) => {
  return getHeaders().then(headers => {
    return instance({
      method: 'get',
      url: `contest/${contestId}/project`,
      headers
    }).then(response => {
      let projects = response.data.projects
      projects.sort((a, b) => a.submitted < b.submitted)
      return projects
    }).catch(e => {
      apiError(e)
      return null
    })
  })
}

const getProjectDeliverable = (contestId, projectId) => {
  return instance({
    method: 'get',
    url: `contest/${contestId}/project/${projectId}/deliverable`,
    responseType: 'blob'
  }).then((response) => {
    Vue.$log.info(response.headers.contentType)
    const url = window.URL.createObjectURL(new Blob([response.data]))
    const link = document.createElement('a')
    link.href = url
    link.setAttribute('download', 'file')
    document.body.appendChild(link)
    link.click()
  }).catch(e => {
    apiError(e)
    return null
  })
}

const setProjectApproved = (contestId, projectId, bool) => {
  return getHeaders().then(headers => {
    return instance({
      method: bool ? 'put' : 'delete',
      url: `admin/contest/${contestId}/project/${projectId}/approve`,
      headers
    }).then(response => {
      return true
    }).catch(e => {
      apiError(e)
      return null
    })
  })
}

const deleteProject = (contestId, projectId) => {
  return getHeaders().then(headers => {
    return instance({
      method: 'delete',
      url: `admin/contest/${contestId}/project/${projectId}`,
      headers
    })
  }).then(response => {
    return response
  }).catch(e => {
    apiError(e)
    return null
  })
}

const getUserById = id => {
  return getHeaders().then(headers => {
    return instance({
      method: 'get',
      url: 'admin/user/' + id,
      headers
    }).then(response => {
      if (Vue.$config.firebase.devMode) {
        let matchNumId = response.data.user.uid.match(/\d+/)
        return auth.fakeUser(matchNumId && matchNumId[0])
      }
      return Vue.$config.firebase.devMode ? auth.fakeUser(response.data.user.uid) : response.data.user
    }).catch(e => {
      apiError(e)
      return null
    })
  })
}

const getUsersById = ids => {
  return getHeaders().then(headers => {
    let requests = []
    ids.forEach(id => {
      requests.push(getUserById(id))
    })
    return Promise.all(requests).then(responses => {
      return responses
    }).catch(e => {
      apiError(e)
      return null
    })
  })
}

const apiError = e => {
  let error = e.response && e.response.data && e.response.data.error
  if (error && error.code) {
    if (!feedback.forApiErrorCode(error.code)) {
      feedback.apiError(error)
      Vue.$log.error(`API error n°${error.code}: ${error.msg}`)
    }
  } else if (e.request) {
    feedback.offline()
    Vue.$log.error('Connection error: back-end unreachable')
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
  createContest,
  deleteContest,
  getProjectsByContest,
  getProjectDeliverable,
  setProjectApproved,
  deleteProject,
  getUserById,
  getUsersById
}
