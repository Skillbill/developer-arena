import Vue from 'vue'
import App from './App'
import router from './lib/router'
import store from './lib/store'
import auth from './lib/auth'
import api from './lib/api'
import Confit from 'confit-client'
import BootstrapVue from 'bootstrap-vue'
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'
import Toastr from 'toastr'
import 'toastr/build/toastr.min.css'
import VueLogger from 'vuejs-logger'
import axios from 'axios'
import localConfig from '../configuration.json'

Vue.config.productionTip = false
let vm = null
Vue.use(BootstrapVue)
Vue.use(VueLogger, {logLevel: 'info', showConsoleColors: true, showLogLevel: true})
Vue.$toastr = Vue.prototype.$toastr = Toastr

let confitPath = location.origin + location.pathname + 'static/confitRepoId'
Vue.$log.info(`Protocol: ${location.protocol}, Host: ${location.hostname}, Path: ${location.pathname}, Port: ${location.port}`)

axios({
  method: 'get',
  url: confitPath
}).then(rep => {
  return new Confit({
    repoId: rep.data
  }).getConf(location.hostname + '-bo', {
    alias: true
  })
}).catch(e => {
  if (e.response && e.response.status === 404) {
    Vue.$log.info('Using the local configuration file')
    return localConfig
  } else {
    return Promise.reject(e)
  }
}).then(config => {
  Vue.$log.info('Config used:', config)
  config.statRes = location.origin + location.pathname + 'static'
  Vue.$config = Vue.prototype.$config = config
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
