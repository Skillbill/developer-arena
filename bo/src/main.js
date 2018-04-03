import Vue from 'vue'
import VueRouter from 'vue-router'
import router from './router/index'
import store from './store/index'
import firebase from 'firebase'
import configuration from '../static/configuration'
import App from './App'

Vue.use(VueRouter)
Vue.config.productionTip = false
firebase.initializeApp(configuration.firebase)
firebase.auth().onAuthStateChanged(function (user) {
  store.commit('setUser', user)
  if (user) {
    router.push('/book-list')
  }
})

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  components: { App },
  template: '<App/>'
})
