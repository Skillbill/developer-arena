import Vue from 'vue'
import VueI18n from 'vue-i18n'

Vue.use(VueI18n)

const messages = {
  en: require('./locales/en'),
  it: require('./locales/it')
}
const i18n = new VueI18n({
  locale: 'en',
  messages
})

let language = localStorage.getItem('language');
if (!language && navigator.language) {
  language = navigator.language.split('-');
  localStorage.setItem('language', language[0]);
}

export default i18n
