import Vue from 'vue'
import firebase from 'firebase'
import store from '../store'

const auth = {
  init (config, vueAppData) {
    let vm
    firebase.initializeApp(config.firebase)
    firebase.auth().onAuthStateChanged(function (user) {
      store.commit('setUser', user)
      if (!vm) {
        /* eslint-disable no-new */
        vm = new Vue(vueAppData)
      }
    })
    firebase.auth().getRedirectResult()
      .then(this.afterRedirect)
      .catch(this.onError)
  },
  afterRedirect (result) {
    if (result && result.user) {
      console.log('afterRedirect: ', result.user.displayName)
    } else {
      console.log('afterRedirect: ', 'no user in result :', result)
    }
  },
  signIn () {
    var provider = new firebase.auth.GithubAuthProvider()
    firebase.auth().signInWithRedirect(provider)
  },
  signOut (onSignOut, onError) {
    firebase.auth().signOut().then(onSignOut).catch(onError)
  }
}

export default auth
