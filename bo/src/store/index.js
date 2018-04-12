import Vue from 'vue'
import Vuex from 'vuex'
import uuid from 'uuid4'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    user: null,
    feedbacks: []
  },
  getters: {
    getUser: state => state.user,
    getFeedbacks: state => state.feedbacks
  },
  mutations: {
    setUser (state, user) {
      state.user = user
    },
    addFeedback (state, feedbackData) {
      let id = uuid()
      let cbRemove = () => {
        this.commit('removeFeedback', id)
      }
      feedbackData.id = id
      feedbackData.remove = cbRemove
      setTimeout(cbRemove, 2000)
      state.feedbacks.push(feedbackData)
    },
    removeFeedback (state, id) {
      state.feedbacks = state.feedbacks.filter(elem => elem.id !== id)
    }
  },
  actions: {
  }
})
