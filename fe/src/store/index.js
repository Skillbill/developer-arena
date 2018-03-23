import Vue from 'vue'
import Vuex from 'vuex'
import axios from 'axios'
import i18n from '../i18n'

Vue.use(Vuex)

const store = new Vuex.Store({
  state: {
    user: null,
    contest: null,
    feedback: null,
    language: null
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
    loadLastContest ({commit}) {
      commit('setContest', null);
      axios({
        method: 'get',
        url: configuration.serverAddress + '/' + configuration.apiVersion + '/contest/last',
        headers: {'Accept-Language': this.state.language}
      }).then(response => {
        commit('setContest', response.data.contest);
      }).catch(e => {
        commit('setFeedbackError', e.message);
      })
    }
  }
})

export default store
