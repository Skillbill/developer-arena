import Vue from 'vue'
import Vuex from 'vuex'
import axios from 'axios'
import i18n from '../i18n'
import router from '../router'

Vue.use(Vuex)

const store = new Vuex.Store({
  state: {
    user: null,
    contest: null,
    error: null,
    language: null
  },
  mutations: {
    setUser (state, user) {
      state.user = user;
    },
    setContest (state, contest) {
      state.contest = contest;
    },
    setError (state, error) {
      state.error = error;
    },
    setLanguage (state, language) {
      state.language = language;
    }
  },
  actions: {
    chooseLanguage ({commit, dispatch}, language) {
      localStorage.setItem('language', language);
      i18n.locale = language;
      commit('setLanguage', language);
      window.router = router
      if (router.currentRoute.path === '/') {
        dispatch('loadLastContest');
      } else {
        router.push({ path: '/' });
      }
    },
    loadLastContest ({commit}) {
      axios({
        method: 'get',
        url: configuration.serverAddress + '/' + configuration.apiVersion + '/contest/last',
        headers: {'Accept-Language': this.state.language}
      }).then(response => {
        commit('setContest', response.data.contest);
      }).catch(e => {
        commit('setError', e);
      })
    }
  }
})

export default store
