import Vue from 'vue'
import Vuex from 'vuex'
import axios from 'axios'
import * as utils from '../utils'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    user: null,
    contest: null
  },
  getters: {
    getUser: state => state.user,
    getContest: state => state.contest,
    getContestDate0: state => state.contest ? state.contest.endApplying.substring(0, 10) : null,
    getContestDate1: state => state.contest ? state.contest.endPresentation.substring(0, 10) : null,
    getContestDate2: state => state.contest ? state.contest.endVoting.substring(0, 10) : null
  },
  mutations: {
    setUser (state, user) {
      state.user = user
    },
    setContest (state, contest) {
      state.contest = contest
    },
    setContestDate0 (state, newDate) {
      state.contest.endApplying = newDate.concat('T00:00:00.000Z')
    },
    setContestDate1 (state, newDate) {
      state.contest.endPresentation = newDate.concat('T00:00:00.000Z')
    },
    setContestDate2 (state, newDate) {
      state.contest.endVoting = newDate.concat('T00:00:00.000Z')
    }
  },
  actions: {
    async loadLastContest ({commit}) {
      commit('setContest', null)
      var headers = {}
      axios({
        method: 'get',
        url: utils.getApiUrl('/contest/last'),
        headers
      }).then(response => {
        commit('setContest', response.data.contest)
      }).catch(e => {
        console.error(e)
      })
    }
  }
})
