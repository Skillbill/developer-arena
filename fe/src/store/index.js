import Vue from 'vue'
import Vuex from 'vuex'
import axios from 'axios'
import i18n from '../i18n'
import confit from 'confit-client/dist/confit-client.es.min.js'
import * as utils from '../utils'
import localConfig from '../../configuration.json'

Vue.use(Vuex)

const store = new Vuex.Store({
  state: {
    configuration: null,
    user: null,
    userClaims: null,
    contest: null,
    feedback: null,
    language: null,
    project: null,
    projects: null,
    limits: null,
    firebaseRedirectResultConsumed: false,
    pageTitle: null
  },
  mutations: {
    setConfiguration (state, configuration) {
      state.configuration = configuration;
    },
    setUser (state, user) {
      state.user = user;
    },
    setUserClaims (state, userClaims) {
      state.userClaims = userClaims;
    },
    setContest (state, contest) {
      state.contest = contest;
    },
    setFeedbackOk (state, data) {
      state.feedback = utils.getFeedback(data, 'ok');
    },
    setFeedbackError (state, data) {
      state.feedback = utils.getFeedback(data, 'ko');
    },
    removeFeedback (state, message) {
      state.feedback = null;
    },
    setLanguage (state, language) {
      state.language = language;
    },
    setJury (state, jury) {
      state.jury = jury;
    },
    setProject (state, project) {
      state.project = project;
    },
    setProjects (state, projects) {
      state.projects = projects;
    },
    setLimits (state, limits) {
      state.limits = limits;
    },
    setFirebaseRedirectResultConsumed (state, firebaseRedirectResultConsumed) {
      state.firebaseRedirectResultConsumed = firebaseRedirectResultConsumed;
    },
    setPageTitle (state, title) {
      state.pageTitle = title;
    }
  },
  getters: {
    contestStorting: state => {
      let sorting = ['date'];
      if(state.contest && state.contest.state === 'APPLYING') {
        sorting = ['update'].concat(sorting);
      }
      if(state.contest && state.contest.state === 'VOTING') {
        sorting = ['trend'].concat(sorting);
      }
      if(state.contest && (state.contest.state === 'CLOSED' || state.contest.state === 'PAST')) {
        sorting = ['rank'].concat(sorting);
      }
      return sorting;
    }
  },
  actions: {
    async loadConfiguration({commit}) {
      let confitPath = location.origin + location.pathname + 'static/confitRepoId';
      let repoId = null;
      let config = null;
      try {
        repoId = process.env.CONFIT_REPO_ID || (await axios.get(confitPath)).data;
        config = await confit.load({
          repoId: repoId,
          alias: location.hostname + '-fe'
        })
        if(process.env.NODE_ENV === 'development') {
          console.log('Using the confit configuration file');
        }
      } catch (error) {
        if (error.response && error.response.status === 404) {
          if(process.env.NODE_ENV === 'development') {
            console.log('Using the local configuration file');
          }
        } else {
          console.error('Fallback to local configuration file because trying to use confit gave an error:\n', error.message);
        }
        config = localConfig;
      }
      if(process.env.NODE_ENV === 'development') {
        console.log('Config used:', config);
      }
      commit('setConfiguration', config);
    },
    chooseLanguage ({commit, dispatch, state}, language) {
      utils.gtag('event', 'change_language', {
        'event_category': 'browse',
        'event_label': language
      });
      if (state.language === language) {
        return;
      }
      localStorage.setItem('language', language);
      document.documentElement.lang = language;
      i18n.locale = language;
      commit('setLanguage', language);
    },
    setPageTitle({commit}, title = '') {
      let pageTitle = i18n.t('siteName');
      if(title) {
        title = title.replace(/\*/gi, '');
        pageTitle = title + ' | ' + pageTitle;
      }
      document.title = pageTitle;
      commit('setPageTitle', pageTitle);
    },
    async loadLastContest ({commit, dispatch}) {
      commit('setContest', null);
      const headers = await utils.getDefaultHeaders();
      return axios({
        method: 'get',
        url: utils.getApiUrl('/contest/last'),
        headers
      }).then(response => {
        commit('setContest', response.data.contest);
        dispatch('setPageTitle', response.data.contest ? response.data.contest.title : '');
      }).catch(e => {
        console.error(e);
        commit('setFeedbackError', utils.getApiErrorMessage(e));
      })
    },
    async loadLastUserProject ({commit}) {
      const headers = await utils.getDefaultHeaders();
      return axios({
        method: 'get',
        url: utils.getApiUrl(`/contest/${this.state.contest.id}/project`),
        params: {
          user: this.state.user.uid
        },
        headers
      }).then(response => {
        commit('setProject', response.data.project);
      }).catch(e => {
        if(e.response.status === 404) {
          return;
        }
        console.error(e);
        commit('setFeedbackError', utils.getApiErrorMessage(e));
      })
    },
    async submitProject ({commit}, {projectFormData, edit, onUploadProgress}) {
      let url = `/contest/${this.state.contest.id}/project` + (edit && this.state.project ? `/${this.state.project.id}` : '');
      const headers = await utils.getDefaultHeaders({auth: true});
      return axios({
        method: edit ? 'put' : 'post',
        url: utils.getApiUrl(url),
        headers,
        data: projectFormData,
        onUploadProgress
      }).then(response => {
        commit('setProject', response.data.project);
        store.commit('setFeedbackOk', edit ? 'project.editOk' : 'project.submitOk');
        utils.gtag('event', 'project', {
          'event_category': 'browse',
          'event_label': edit ? 'edit' : 'submit'
        });
      }).catch(e => {
        console.error(e);
        commit('setFeedbackError', utils.getApiErrorMessage(e));
        return Promise.reject(e);
      })
    },
    async loadContest ({commit}, {contestId}) {
      const headers = await utils.getDefaultHeaders();
      return axios({
        method: 'get',
        url: utils.getApiUrl(`/contest/${contestId}`),
        headers
      }).then(response => {
        commit('setContest', response.data.contest);
      }).catch(e => {
        console.error(e);
        commit('setFeedbackError', utils.getApiErrorMessage(e));
      })
    },
    async loadJury ({commit}, {contestId}) {
      const headers = await utils.getDefaultHeaders();
      return axios({
        method: 'get',
        url: utils.getApiUrl(`/contest/${contestId}/jury`),
        headers
      }).then(response => {
        commit('setJury', response.data.jury.sort((a, b) => a.id - b.id));
      }).catch(e => {
        console.error(e);
        commit('setFeedbackError', utils.getApiErrorMessage(e));
      })
    },
    async loadProjects ({commit}, {contestId, sort}) {
      const headers = await utils.getDefaultHeaders();
      return axios({
        method: 'get',
        url: utils.getApiUrl(`/contest/${contestId}/project`),
        params: {sort},
        headers
      }).then(response => {
        commit('setProjects', response.data.projects);
      }).catch(e => {
        console.error(e);
        commit('setFeedbackError', utils.getApiErrorMessage(e));
      })
    },
    async loadProject ({commit}, {contestId, projectId}) {
      const headers = await utils.getDefaultHeaders();
      return axios({
        method: 'get',
        url: utils.getApiUrl(`/contest/${contestId}/project/${projectId}`),
        headers
      }).then(response => {
        commit('setProject', response.data.project);
      }).catch(e => {
        console.error(e);
        commit('setFeedbackError', utils.getApiErrorMessage(e));
      })
    },
    async loadLimits ({commit}) {
      const headers = await utils.getDefaultHeaders();
      return axios({
        method: 'get',
        url: utils.getApiUrl(`/limits`),
        headers
      }).then(response => {
        commit('setLimits', response.data.limits);
      }).catch(e => {
        console.error(e);
        commit('setFeedbackError', utils.getApiErrorMessage(e));
      })
    },
    async voteProject ({commit, dispatch}, {method, projectId, contestId}) {
      const headers = await utils.getDefaultHeaders({auth: true});
      return axios({
        method,
        url: utils.getApiUrl(`/contest/${contestId}/project/${projectId}/vote`),
        headers
      }).then(response => {
        utils.gtag('event', 'project', {
          'event_category': 'browse',
          'event_label': 'vote'
        });
        return Promise.all([dispatch('loadProjects', {contestId}), dispatch('loadProject', {contestId, projectId})]);
      }).catch(e => {
        console.error(e);
        commit('setFeedbackError', utils.getApiErrorMessage(e));
      })
    },
    async saveProfile({commit, dispatch}, data) {
      const headers = await utils.getDefaultHeaders({auth: true});
      return axios({
        method: 'put',
        url: utils.getApiUrl(`/me/email`),
        headers,
        data
      }).then(() => {
        commit('setFeedbackOk', 'profile.saved');
      }).catch(e => {
        console.error(e);
        commit('setFeedbackError', utils.getApiErrorMessage(e));
      })
    },
    updateUser({commit}, user) {
      commit('setUser', user);
      if(user) {
        return user.getIdTokenResult(true).then(result => {
          if(process.env.NODE_ENV === 'development') {
            console.log('User Token', result.token);
            console.log('User Claims', result.claims);
          }
          commit('setUserClaims', result.claims);
        });
      } else {
        commit('setUserClaims', null);
        return Promise.resolve();
      }
    },
    refreshUser({dispatch}) {
      return dispatch('updateUser', this.state.user);
    },
    async generatePreview({commit, dispatch}, {contestId, projectId}) {
      const headers = await utils.getDefaultHeaders({auth: true});
      return axios({
        method: 'put',
        url: utils.getApiUrl(`/contest/${contestId}/project/${projectId}/preview`),
        headers
      }).then(() => {
        return dispatch('loadProject', {contestId, projectId});
      }).catch(e => {
        console.error(e);
        commit('setFeedbackError', utils.getApiErrorMessage(e));
      })
    }
  }
})

export default store
