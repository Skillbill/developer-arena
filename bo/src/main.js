import Vue from 'vue'
import router from './router/index'
import store from './store/index'
import firebase from 'firebase'
import configuration from '../static/configuration'
import App from './App'

Vue.config.productionTip = false
firebase.initializeApp(configuration.firebase)
let app
firebase.auth().onAuthStateChanged(function (user) {
  store.commit('setUser', user)
  if (!app) {
    /* eslint-disable no-new */
    app = new Vue({
      el: '#app',
      router,
      store,
      components: { App },
      template: '<App/>'
    })
  }
  console.log('onAuthStateChanged')
})
