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

Vue.config.productionTip = false
let vm = null
Vue.use(BootstrapVue)
Vue.use(VueLogger, {logLevel: 'info', showConsoleColors: true, showLogLevel: true})
Vue.$toastr = Vue.prototype.$toastr = Toastr

Vue.$log.info(`Protocol: ${location.protocol}, Host: ${location.hostname}, Path: ${location.pathname}, Port: ${location.port}`)

new Confit({
  repoId: 'f7ca505d-a32f-4909-aab3-a28b4f1c4ee8'
}).getConf(location.hostname + '-bo', {
  alias: true
}).then(config => {
  Vue.$log.info('Retreived config from confit:', config)
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
