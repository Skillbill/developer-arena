import Vue from 'vue'
import App from './App'
import router from './lib/router'
import store from './lib/store'
import auth from './lib/auth'
import api from './lib/api'
import BootstrapVue from 'bootstrap-vue'
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'
import Toastr from 'toastr'
import 'toastr/build/toastr.min.css'
import axios from 'axios'
import VueLogger from 'vuejs-logger'

Vue.config.productionTip = false
let vm = null
Vue.use(BootstrapVue)
Vue.use(VueLogger, {logLevel: 'info', showConsoleColors: true, showLogLevel: true})
Vue.$toastr = Vue.prototype.$toastr = Toastr

let configurationPath = location.origin + location.pathname + 'static/configuration.json'
Vue.$log.info(`Protocol: ${location.protocol}, Host: ${location.hostname}, Path: ${location.pathname}, Port: ${location.port}`)
Vue.$log.info(`configuration loaded from: ${configurationPath}`)

axios({
  method: 'get',
  url: configurationPath
}).then(rep => {
  let config = rep.data
  config.statRes = location.origin + location.pathname + 'static'
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
