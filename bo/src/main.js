import Vue from 'vue'
import App from './App'
import router from './router'
import store from './store'
import axios from 'axios'
import auth from './auth'

Vue.config.productionTip = false
axios({
  method: 'get',
  url: '/static/configuration.json'
}).then(rep => {
  let config = rep.data
  Vue.prototype.$config = config
  auth.init(config, vueAppData)
}).catch(e => {
  console.error(e)
})

const vueAppData = {
  el: '#app',
  router,
  store,
  components: { App },
  template: '<App/>'
}
