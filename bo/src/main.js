import Vue from 'vue'
import router from './router/index'
import store from './store/index'
import firebase from 'firebase'
import axios from 'axios'
import App from './App'

Vue.config.productionTip = false
axios({
  method: 'get',
  url: '/static/configuration.json'
}).then(rep => {
  let config = rep.data
  Vue.prototype.$config = config
  firebase.initializeApp(config.firebase)
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
}).catch(e => {
  console.error(e)
})
