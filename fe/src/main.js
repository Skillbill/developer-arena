// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import VueI18n from 'vue-i18n'

Vue.config.productionTip = false
Vue.use(VueI18n)

const messages = {
  en: require('./locales/en'),
  it: require('./locales/it')
}
const i18n = new VueI18n({
  locale: 'en',
  messages
})
//        setTimeout(() => {
//          this.$i18n.locale = 'it'
//        }, 1000)

var firebase = require('firebase/app')
require('firebase/auth')

firebase.initializeApp(configuration.firebase)
let app
firebase.auth().onAuthStateChanged(user => {
  if (!app) {
    /* eslint-disable no-new */
    app = new Vue({
      i18n,
      el: '#app',
      router,
      components: { App },
      template: '<App/>'
    })
  }
})
