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
Vue.use(VueLogger, {
  logLevel: process.env.NODE_ENV === 'production' ? 'error' : 'info',
  showConsoleColors: true,
  showLogLevel: true
})
Vue.$toastr = Vue.prototype.$toastr = Toastr

Vue.$log.info(`Protocol: ${location.protocol}, Host: ${location.hostname}, Path: ${location.pathname}, Port: ${location.port}`)

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

const getConfig = async () => {
  let confitPath = location.origin + location.pathname + 'static/confitRepoId'
  let repoId = null
  let config = null
  try {
    repoId = process.env.CONFIT_REPOID || (await axios.get(confitPath)).data
    config = await new Confit({
      repoId: repoId
    }).getConf(location.hostname + '-bo', {
      alias: true
    })
    if (process.env.NODE_ENV === 'development') {
      Vue.$log.info('Using the confit configuration file')
    }
  } catch (error) {
    if (error.response && error.response.status === 404) {
      if (process.env.NODE_ENV === 'development') {
        Vue.$log.info('Using the local configuration file')
      }
    } else {
      Vue.$log.error('Fallback to local configuration file because trying to use confit gave an error:\n', error.message)
    }
    config = localConfig
  }
  return config
}

getConfig().then(config => {
  Vue.$log.info('Config used:', config)
  config.statRes = location.origin + location.pathname + 'static'
  Vue.$config = Vue.prototype.$config = config
  auth.init(config, showApp)
  api.init(config)
}).catch(e => {
  Vue.$log.error(e)
})
