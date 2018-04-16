import Vue from 'vue'
import App from './App'
import router from './lib/router'
import store from './lib/store'
import axios from 'axios'
import auth from './lib/auth'
import api from './lib/api'
import VueLogger from 'vuejs-logger'

Vue.config.productionTip = false
let vm = null
Vue.use(VueLogger, {logLevel: 'debug'})

axios({
  method: 'get',
  url: '/static/configuration.json'
}).then(rep => {
  let config = rep.data
  Vue.prototype.$config = config
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
