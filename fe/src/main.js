// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import store from './store'
import i18n from './i18n'
import auth from './auth'
import {register as registerDirectives} from './directives'

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
    });
    if(process.env.NODE_ENV === 'development') {
      window.app = app;
      window.store = store;
      window.router = router;
    }
  }
}

registerDirectives();

store.dispatch('loadConfiguration').then(() => {
  store.dispatch('chooseLanguage', localStorage.getItem('language'));
  store.dispatch('loadLimits');
  store.dispatch('loadLastContest');
  auth.initializeApp();
  auth.onAuthStateChanged(user => {
    store.commit('setUser', user);
    if(user && process.env.NODE_ENV === 'development') {
      user.getIdToken().then(token => {
        console.log(`User Token: ${token}`);
      });
    }
    initVueApp();
  });
});
