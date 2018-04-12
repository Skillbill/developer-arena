import Vue from 'vue'
import VueI18n from 'vue-i18n'

Vue.use(VueI18n)

const messages = {
  en: require('./locales/en'),
  it: require('./locales/it')
}

const dateTimeFormats = {
  'en': {
    short: {
      year: 'numeric',
      month: 'numeric',
      day: 'numeric'
    },
    long: {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      weekday: 'short',
      hour: 'numeric',
      minute: 'numeric'
    }
  },
  'it': {
    short: {
      year: 'numeric',
      month: 'numeric',
      day: 'numeric'
    },
    long: {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      weekday: 'short',
      hour: 'numeric',
      minute: 'numeric'
    }
  }
}

const i18n = new VueI18n({
  locale: 'en',
  fallbackLocale: 'en',
  messages,
  dateTimeFormats
})

let language = localStorage.getItem('language');
if (!language && navigator.language) {
  language = navigator.language.split('-')[0];
  if(Object.keys(messages).indexOf(language) > -1) {
    localStorage.setItem('language', language);
  } else {
    localStorage.setItem('language', 'en');
  }
}

export default i18n
