import Vue from 'vue'
import firebase from 'firebase'
import store from '@/lib/store'
import router from '@/lib/router'
import api from '@/lib/api'
import feedback from '@/lib/feedback'

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
    firebase.initializeApp(config.firebase)
    firebase.auth().onAuthStateChanged(function (user) {
      store.commit('setUser', user)
      if (!user) {
        showApp()
      } else {
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
          showApp()
        })
      }
    })
    firebase.auth().getRedirectResult()
      .then(this.afterRedirect)
      .catch(this.onError)
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
  signOut (onSignOut, onError) {
    store.commit('setUser', null)
    router.push('/')
    firebase.auth().signOut().then(onSignOut).catch(onError)
  }
}

export default auth
