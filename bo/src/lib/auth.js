import Vue from 'vue'
import firebase from 'firebase'
import store from '@/lib/store'
import router from '@/lib/router'
import api from '@/lib/api'
import feedback from '@/lib/feedback'
import * as utils from '@/lib/utils'

const getFakeUid = () => {
  let uid = sessionStorage.getItem('uid')
  if (!uid) {
    uid = Math.floor(Math.random() * 1000).toString()
    sessionStorage.setItem('uid', uid)
  }
  return uid
}

const getFakeUser = (uid = null) => {
  if (!uid) uid = getFakeUid()
  let photoURL = 'https://randomuser.me/api/portraits/' +
                  (((Number(uid) % 200) <= 100) ? 'men' : 'women') +
                  '/' + (Number(uid) % 100) + '.jpg'
  return {
    isAdmin: true,
    uid,
    displayName: `User ${uid}`,
    email: 'fake@email.com',
    emailVerified: false,
    isAnonymous: false,
    phoneNumber: null,
    photoURL: photoURL,
    customClaims: {
      email: 'custom@email.com'
    },
    providerData: [
      {
        displayName: `User ${uid}`,
        email: 'fake@email.com',
        phoneNumber: null,
        photoURL: photoURL,
        providerId: 'password',
        uid
      }
    ]
  }
}

const createSessionUser = () => {
  let user = getFakeUser()
  Vue.$log.info('Auth: created and added to session: ', user.displayName)
  sessionStorage.setItem('user', JSON.stringify(user))
  return user
}

const getSessionUser = () => {
  const sessionItem = sessionStorage.getItem('user')
  if (sessionItem) {
    const user = JSON.parse(sessionItem)
    return user
  } else {
    return null
  }
}

const auth = {
  providers: [
    'google.com',
    'github.com',
    'facebook.com',
    'twitter.com'
  ],
  init (config, showApp) {
    this.providers = this.providers.map(provider => utils.getProviderInfo(provider))
    if (config.firebase.devMode) {
      let user = getSessionUser()
      Vue.$log.info('Auth initialization in devMode with:', user ? user.displayName : 'no user', 'signed in')
      if (user) {
        this.signIn(null)
      }
      showApp()
    } else {
      Vue.$log.info('Auth initialization in normal mode')
      firebase.initializeApp(config.firebase)
      firebase.auth().onAuthStateChanged(user => this.authStateChanged(user, showApp))
      firebase.auth().getRedirectResult()
        .then(this.afterRedirect)
        .catch(this.afterRedirectError)
    }
  },
  authStateChanged (user, showApp) {
    Vue.$log.info('Auth state changed for: ', user ? (user.displayName + ' id:' + user.uid) : 'no user')
    store.commit('setUser', user)
    if (user) {
      api.checkAdmin().then(isAdmin => {
        if (isAdmin === true) {
          feedback.isAdmin()
          Vue.set(user, 'isAdmin', true)
          router.push('contests')
        } else if (isAdmin === false) {
          feedback.notAdmin()
          router.push('/')
        } else {
          this.signOut()
        }
        showApp()
      })
    } else {
      router.push('/')
      showApp()
    }
  },
  afterRedirect (result) {
    if (result && result.user) {
      Vue.$log.debug('afterRedirect: ', result.user.displayName)
    } else {
      Vue.$log.debug('afterRedirect: ', 'no user in result :', result)
    }
  },
  afterRedirectError (error) {
    if (error.email && error.code === 'auth/account-exists-with-different-credential') {
      firebase.auth().fetchProvidersForEmail(error.email).then(providers => {
        if (providers.length !== 1) Vue.$log.info('After firebase account exists error, ', providers.length, ' providers were found')
        Vue.$log.info(`Asking user "${error.email}"` +
          ` that tried to login with "${error.credential.providerId}"` +
          ` to login using his existing account at "${providers[0]}"`
        )
        router.push({
          name: 'signInWithProvider',
          params: {
            email: error.email,
            providerUsed: error.credential.providerId,
            providerToUse: providers[0]
          }
        })
      })
    }
    Vue.$log.debug('afterRedirectError', error)
  },
  signIn (provider) {
    if (!Vue.$config.firebase.devMode) {
      firebase.auth().signInWithRedirect(new firebase.auth[provider.providerName]())
    } else {
      let user = getSessionUser()
      if (!user) user = createSessionUser()
      user.getIdToken = function () {
        return Promise.resolve(this.isAdmin ? 'admin' : 'user')
      }
      Vue.$log.info(`SignIn with fakeUser ${user.displayName}`)
      store.commit('setUser', user)
      router.push('/contests')
    }
  },
  signOut () {
    if (!Vue.$config.firebase.devMode) {
      firebase.auth().signOut()
    } else {
      sessionStorage.removeItem('user')
      store.commit('setUser', null)
      router.push('/')
    }
  },
  getFakeUser
}

export default auth
