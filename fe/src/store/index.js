import Vue from 'vue'
import Vuex from 'vuex'
import axios from 'axios'
import i18n from '../i18n'
import * as utils from '../utils'

Vue.use(Vuex)

const store = new Vuex.Store({
  state: {
    configuration: null,
    user: null,
    contest: null,
    feedback: null,
    language: null,
    project: null,
    projects: null,
    limits: null
  },
  mutations: {
    setConfiguration (state, configuration) {
      state.configuration = configuration;
    },
    setUser (state, user) {
      state.user = user;
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
    setProject (state, project) {
      state.project = project;
    },
    setProjects (state, projects) {
      state.projects = projects;
    },
    setLimits (state, limits) {
      state.limits = limits;
    }
  },
  actions: {
    loadConfiguration({commit}) {
      return axios({
        method: 'get',
        url: '/static/configuration.json'
      }).then(response => {
        commit('setConfiguration', response.data);
      }).catch(e => {
        console.error(e);
        commit('setFeedbackError', utils.getApiErrorMessage(e));
      })
    },
    chooseLanguage ({commit, dispatch, state}, language) {
      if (state.language === language) {
        return;
      }
      localStorage.setItem('language', language);
      i18n.locale = language;
      commit('setLanguage', language);
    },
    async loadLastContest ({commit}) {
      commit('setContest', null);
      const headers = await utils.getDefaultHeaders();
      return axios({
        method: 'get',
        url: utils.getApiUrl('/contest/last'),
        headers
      }).then(response => {
        commit('setContest', response.data.contest);
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
      }).catch(e => {
        console.error(e);
        commit('setFeedbackError', utils.getApiErrorMessage(e));
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
    async loadProjects ({commit}, {contestId}) {
      const headers = await utils.getDefaultHeaders();
      return axios({
        method: 'get',
        url: utils.getApiUrl(`/contest/${contestId}/project`),
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
    async voteProject ({commit, dispatch}, {projectId, contestId}) {
      const headers = await utils.getDefaultHeaders({auth: true});
      return axios({
        method: 'put',
        url: utils.getApiUrl(`/contest/${contestId}/project/${projectId}/vote`),
        headers
      }).then(response => {
        return Promise.all([dispatch('loadProjects', {contestId}), dispatch('loadProject', {contestId, projectId})]);
      }).catch(e => {
        console.error(e);
        commit('setFeedbackError', utils.getApiErrorMessage(e));
      })
    }
  }
})

export default store
