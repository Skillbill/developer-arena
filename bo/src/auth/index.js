import Vue from 'vue'
import firebase from 'firebase'
import store from '../store'
import axios from 'axios'
import * as utils from '../utils'

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
  init (config, vueAppData) {
    let vm
    firebase.initializeApp(config.firebase)
    firebase.auth().onAuthStateChanged(function (user) {
      store.commit('setUser', user)
      if (user) {
        user.getIdToken().then(token => {
          let headers = {
            'Authorization': 'admin',
            'Content-Type': 'application/json',
            'Accept-Language': 'en'
          }
          return axios({
            method: 'get',
            url: utils.getApiUrl('/admin/check'),
            headers
          })
        }).then((response) => {
          Vue.$log.debug('admin check: ', response)
          store.commit('addFeedback', {
            title: 'Success',
            message: 'You are an admin'
          })
        }).catch(e => {
          // this.signOut((r) => Vue.$log.debug('Not admin: signed out: ', r), (e) => Vue.$log.error('Not admin: ', e))
          let error = e.response && e.response.data && e.response.data.error
          if (error) {
            store.commit('addFeedback', {
              title: 'Error',
              message: `status code: ${error.code}, text: ${error.msg}`
            })
            Vue.$log.error(e)
          } else {
            Vue.$log.debug('admin check: ', e)
          }
        })
      }

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
    firebase.auth().signOut().then(onSignOut).catch(onError)
  }
}

export default auth
