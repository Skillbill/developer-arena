// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import store from './store'
import i18n from './i18n'
import auth from './auth'
import {register as registerDirectives} from './directives'
import {gtag} from './utils'

Vue.config.productionTip = false;
let app;

function initVueApp() {
  if (!app) {
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
  const gaKey = store.state.configuration.googleAnalyticsKey;
  if(gaKey) {
    window.dataLayer = window.dataLayer || [];
    gtag('config', gaKey, {'send_page_view': false});
  }

  store.dispatch('chooseLanguage', localStorage.getItem('language'));
  store.dispatch('loadLimits');
  store.dispatch('loadLastContest');
  auth.initializeApp();
  auth.onAuthStateChanged(user => {
    store.dispatch('updateUser', user).then(() => {
      initVueApp();
    });
  });
});
