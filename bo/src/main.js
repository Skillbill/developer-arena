import Vue from 'vue'
import App from './App'
import router from './lib/router'
import store from './lib/store'
import axios from 'axios'
import auth from './lib/auth'
import api from './lib/api'
import VueLogger from 'vuejs-logger'
import Toastr from 'toastr'

Vue.config.productionTip = false
let vm = null
Vue.use(VueLogger, {logLevel: 'info', showConsoleColors: true, showLogLevel: true})
Vue.$toastr = Vue.prototype.$toastr = Toastr

Vue.$log.info(`Host: ${location.hostname}, Path: ${location.pathname}, Port: ${location.port}`)

axios({
  method: 'get',
  url: '/static/configuration.json'
}).then(rep => {
  let config = rep.data
  Vue.$config = Vue.prototype.$config = config
  if (typeof Vue.$config.firebase.devMode !== 'boolean') Vue.$log.error('devMode in configuration.json should be a boolean')
  auth.init(config, showApp)
  api.init(config)
}).catch(e => {
  Vue.$log.error(e)
})

const showApp = () => {
  if (!vm) {
    vm = new Vue({
      el: '#app',
      router,
      store,
      components: { App },
      template: '<App/>'
    })
  }
}
