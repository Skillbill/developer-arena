// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import store from './store'
import i18n from './i18n'
import auth from './auth'
import {register as registerDirectives} from './directives'
import configuration from '../configuration';

Vue.config.productionTip = false;
let app;

function initVueApp() {
  if (!app) {
    /* eslint-disable no-new */
    app = new Vue({
      i18n,
      el: '#app',
      router,
      components: { App },
      template: '<App/>',
      store
    })
  }
}

auth.initializeApp(configuration.firebase);
auth.onAuthStateChanged(user => {
  store.commit('setUser', user);
  initVueApp();
});

registerDirectives();

store.dispatch('chooseLanguage', localStorage.getItem('language'));
store.dispatch('loadLimits');
store.dispatch('loadLastContest');

window.store = store;
