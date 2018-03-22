// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import store from './store'
import i18n from './i18n'
import firebase from 'firebase'

Vue.config.productionTip = false

firebase.initializeApp(configuration.firebase)
let app
firebase.auth().onAuthStateChanged(user => {
  store.commit('setUser', user);
  if (!app) {
    /* eslint-disable no-new */
    app = new Vue({
      i18n,
      el: '#app',
      router,
      components: { App },
      template: '<App/>',
      store
    })
  }
})

store.dispatch('chooseLanguage', localStorage.getItem('language'));
