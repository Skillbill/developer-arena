import Vue from 'vue'
import App from './App'
import router from './router'
import store from './store'
import axios from 'axios'
import auth from './auth'
import VueLogger from 'vuejs-logger'

Vue.config.productionTip = false
Vue.use(VueLogger, {logLevel: 'debug'})

axios({
  method: 'get',
  url: '/static/configuration.json'
}).then(rep => {
  let config = rep.data
  Vue.prototype.$config = config
  auth.init(config, vueAppData)
}).catch(e => {
  Vue.$log.error(e)
})

const vueAppData = {
  el: '#app',
  router,
  store,
  components: { App },
  template: '<App/>'
}
