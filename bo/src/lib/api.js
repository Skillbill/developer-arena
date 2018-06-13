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

const apiError = e => {
  let error = errorRes(e)
  if (error) {
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

const errorRes = e => {
  return e.response && e.response.data && e.response.data.error
}

const getHeaders = () => {
  let user = store.state.user
  if (user) {
    return user.getIdToken().then(token => {
      return {
        'Authorization': (Vue.$config.firebase.devMode ? '' : 'Bearer ') + token
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
    if (errorRes(e) && errorRes(e).code === 4102) { // resolve even if the user is not admin
      return false
    }
    Promise.reject(e)
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
    })
  })
}

const getJuryById = id => {
  return Promise.resolve(utils.getFakeJury())
  // return getHeaders().then(headers => {
  //   return instance({
  //     method: 'get',
  //     url: 'admin/contest/' + id,
  //     headers
  //   }).then(response => {
  //     return response.data.constest.jury
  //   })
  // })
}

const patchContest = (contest) => {
  let data = Object.assign({}, contest)
  data.i18n = utils.toI18n(data.i18n)
  return getHeaders().then(headers => {
    return instance({
      method: 'patch',
      url: '/admin/contest/' + contest.id,
      data,
      headers: {
        ...headers,
        'Content-Type': 'application/json'
      }
    })
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
      headers: {
        ...headers,
        'Content-Type': 'application/json'
      }
    })
  })
}

const deleteContest = (id) => {
  return getHeaders().then(headers => {
    return instance({
      method: 'delete',
      url: '/admin/contest/' + id,
      headers
    })
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
  })
}

const setProjectApproved = (contestId, projectId, bool) => {
  return getHeaders().then(headers => {
    return instance({
      method: bool ? 'put' : 'delete',
      url: `admin/contest/${contestId}/project/${projectId}/approve`,
      headers
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
  })
}

const getUserById = id => {
  return getHeaders().then(headers => {
    return instance({
      method: 'get',
      url: 'admin/user/' + id,
      headers
    }).then(response => {
      let user = response.data.user
      if (Vue.$config.firebase.devMode) {
        let matchNumId = user.uid.match(/\d+/)
        return auth.getFakeUser(matchNumId && matchNumId[0])
      } else {
        return user
      }
    })
  })
}

const getUsersById = ids => {
  let requests = []
  ids.forEach(id => {
    requests.push(getUserById(id).catch(e => {
      Vue.$log.error(`Could not get user ${id}: ${e}`)
    }))
  })
  return Promise.all(requests).then(responses => {
    return responses
  })
}

const createProjectPreview = (contestId, projectId) => {
  return getHeaders().then(headers => {
    return instance({
      method: 'put',
      url: `admin/contest/${contestId}/project/${projectId}/preview`,
      headers
    })
  })
}

const deleteProjectPreview = (contestId, projectId) => {
  return getHeaders().then(headers => {
    return instance({
      method: 'delete',
      url: `admin/contest/${contestId}/project/${projectId}/preview`,
      headers
    })
  })
}

const getJudges = () => {
  return getHeaders().then(headers => {
    return instance({
      method: 'get',
      url: 'judge',
      headers
    }).then(response => {
      let judges = response.data.judges
      judges.sort((a, b) => a.id > b.id)
      return judges
    })
  })
}

const getJudgeImage = id => {
  return getHeaders().then(headers => {
    return instance({
      method: 'get',
      url: 'judge/' + id + '/image',
      headers
    }).then(response => {
      return response.data
    }).catch(e => {
      if (errorRes(e) && errorRes(e).code === 4403) { // resolve even if the judge does not have an image
        return null
      }
      Promise.reject(e)
    })
  })
}

const getJudgesImage = ids => {
  let requests = []
  ids.forEach(id => {
    requests.push(getJudgeImage(id).catch(e => {
      Vue.$log.error(`Could not get judge ${id} image: ${e}`)
    }))
  })
  return Promise.all(requests).then(responses => {
    return responses
  })
}

const createJudge = (judge) => {
  let data = new FormData()
  Object.keys(judge).forEach(key => {
    data.append(key, judge[key])
  })
  return getHeaders().then(headers => {
    return instance({
      method: 'post',
      url: '/admin/judge',
      data,
      headers
    })
  })
}

const patchJudge = (judge) => {
  let data = new FormData()
  Object.keys(judge).forEach(key => {
    if (key !== 'id') data.append(key, judge[key])
  })
  return getHeaders().then(headers => {
    return instance({
      method: 'patch',
      url: '/admin/judge/' + judge.id,
      data,
      headers
    })
  })
}

const deleteJudge = (id) => {
  return getHeaders().then(headers => {
    return instance({
      method: 'delete',
      url: '/admin/judge/' + id,
      headers
    })
  })
}

const putJudgeImage = (id, file) => {
  let data = new FormData()
  data.append('image', file)
  return getHeaders().then(headers => {
    return instance({
      method: 'post',
      url: '/admin/judge/' + id + '/image',
      data,
      headers
    })
  })
}

const deleteJudgeImage = (id) => {
  return getHeaders().then(headers => {
    return instance({
      method: 'delete',
      url: '/admin/judge/' + id + '/image',
      headers
    })
  })
}

const addJudgeToJury = (contestId, judgeId) => {
  return getHeaders().then(headers => {
    return instance({
      method: 'put',
      url: `/admin/contest/${contestId}/jury/?judgeId=${judgeId}`,
      headers
    })
  })
}

const removeJudgeFromJury = (contestId, judgeId) => {
  return getHeaders().then(headers => {
    return instance({
      method: 'delete',
      url: `/admin/contest/${contestId}/jury/?judgeId=${judgeId}`,
      headers
    })
  })
}

export default {
  init,
  apiError,
  checkAdmin,
  getContests,
  getContestById,
  getJuryById,
  patchContest,
  createContest,
  deleteContest,
  getProjectsByContest,
  getProjectDeliverable,
  setProjectApproved,
  deleteProject,
  getUserById,
  getUsersById,
  createProjectPreview,
  deleteProjectPreview,
  getJudges,
  getJudgeImage,
  getJudgesImage,
  createJudge,
  patchJudge,
  deleteJudge,
  putJudgeImage,
  deleteJudgeImage,
  addJudgeToJury,
  removeJudgeFromJury
}
