import Vue from 'vue'
import firebase from 'firebase'
import store from '@/lib/store'
import router from '@/lib/router'
import api from '@/lib/api'
import feedback from '@/lib/feedback'

const fakeUser = () => {
  let uid = sessionStorage.getItem('uid')
  if (!uid) {
    uid = Math.floor(Math.random() * 1000).toString()
    sessionStorage.setItem('uid', uid)
  }
  return {
    uid,
    displayName: `User ${uid}`,
    email: 'fake@email.com',
    emailVerified: true,
    isAnonymous: false,
    phoneNumber: null,
    photoURL: '/static/graphics/assets/dummy/user.svg',
    providerData: [
      {
        displayName: `User ${uid}`,
        email: 'fake@email.com',
        phoneNumber: null,
        photoURL: '/static/graphics/assets/dummy/user.svg',
        providerId: 'fake',
        uid
      }
    ]
  }
}

const createSessionUser = () => {
  sessionStorage.setItem('user', JSON.stringify(fakeUser()))
}

const getSessionUser = () => {
  const sessionItem = sessionStorage.getItem('user')
  if (sessionItem) {
    const user = JSON.parse(sessionItem)
    user.getIdToken = () => {
      return Promise.resolve('admin')
    }
    return user
  } else {
    return null
  }
}

const auth = {
  providers: {
    google: {
      name: 'Google',
      providerName: 'GoogleAuthProvider',
      scopes: ['https://www.googleapis.com/auth/userinfo.email']
    },
    github: {
      name: 'GitHub',
      providerName: 'GithubAuthProvider'
    },
    facebook: {
      name: 'Facebook',
      providerName: 'FacebookAuthProvider'
    },
    twitter: {
      name: 'Twitter',
      providerName: 'TwitterAuthProvider'
    }
  },
  init (config, showApp) {
    if (config.firebase.devMode) {
      let user = getSessionUser()
      if (!user) user = createSessionUser()
      store.commit('setUser', user)
      router.push('/edit-contest')
      showApp()
    } else {
      firebase.initializeApp(config.firebase)
      firebase.auth().onAuthStateChanged(user => {
        store.commit('setUser', user)
        user ? this.checkUser(user).then(showApp) : showApp()
      })
      firebase.auth().getRedirectResult()
        .then(this.afterRedirect)
        .catch(this.onError)
    }
  },
  checkUser (user) {
    api.checkAdmin().then(isAdmin => {
      if (isAdmin) {
        feedback.isAdmin()
        router.push('/edit-contest')
      } else {
        feedback.notAdmin()
      }
    }).catch(e => {
      Vue.$log.error(e)
      feedback.apiError()
    }).then(() => {
      return Promise.resolve()
    })
  },
  afterRedirect (result) {
    if (result && result.user) {
      Vue.$log.debug('afterRedirect: ', result.user.displayName)
    } else {
      Vue.$log.debug('afterRedirect: ', 'no user in result :', result)
    }
  },
  signIn (provider) {
    firebase.auth().signInWithRedirect(new firebase.auth[provider.providerName]())
  },
  signOut () {
    store.commit('setUser', null)
    router.push('/')
    if (!Vue.$config.firebase.devMode) {
      firebase.auth().signOut()
    } else {
      sessionStorage.removeItem('user')
    }
  }
}

export default auth
