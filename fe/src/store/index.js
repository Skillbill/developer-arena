import Vue from 'vue'
import Vuex from 'vuex'
import axios from 'axios'
import i18n from '../i18n'
import * as utils from '../utils'

Vue.use(Vuex)

const store = new Vuex.Store({
  state: {
    user: null,
    contest: null,
    feedback: null,
    language: null,
    project: null
  },
  mutations: {
    setUser (state, user) {
      state.user = user;
    },
    setContest (state, contest) {
      state.contest = contest;
    },
    setFeedbackOk (state, message) {
      state.feedback = {type: 'ok', message};
    },
    setFeedbackError (state, message) {
      state.feedback = {type: 'ko', message};
    },
    removeFeedback (state, message) {
      state.feedback = null;
    },
    setLanguage (state, language) {
      state.language = language;
    },
    setProject (state, project) {
      state.project = project;
    }
  },
  actions: {
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
    async submitProject ({commit}, {projectFormData, edit}) {
      let url = `/contest/${this.state.contest.id}/project` + (edit && this.state.project ? `/${this.state.project.id}` : '');
      const headers = await utils.getDefaultHeaders({auth: true});
      return axios({
        method: edit ? 'put' : 'post',
        url: utils.getApiUrl(url),
        headers,
        data: projectFormData
      }).then(response => {
        commit('setProject', response.data.project);
        store.commit('setFeedbackOk', edit ? 'project.editOk' : 'project.submitOk');
      }).catch(e => {
        console.error(e);
        commit('setFeedbackError', utils.getApiErrorMessage(e));
      })
    }
  }
})

export default store
