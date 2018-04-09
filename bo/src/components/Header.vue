<template>
  <nav class="navbar navbar-expand-lg navbar-light mb-2" style="background-color: #e3f2fd;">
    <router-link class="navbar-brand" to='/'>SDA Contest Back Office</router-link>
    <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
      <span class="navbar-toggler-icon"></span>
    </button>
    <div class="collapse navbar-collapse" id="navbarSupportedContent">
      <ul class="navbar-nav mr-auto">
        <li class="nav-item" v-if="user">
          <router-link class="nav-link" to="/edit-dates">Dates</router-link>
        </li>
        <li class="nav-item" v-if="user">
          <router-link class="nav-link" to="/contests">Contests</router-link>
        </li>
      </ul>
      <span class="pr-2 navbar-text" v-if="user">{{user.displayName}}</span>
      <button type="button" class="btn btn-primary" v-if="!user" v-on:click="signIn">Sign in</button>
      <button type="button" class="btn btn-outline-danger" v-if="user" v-on:click="signOut">Sign out</button>
    </div>
  </nav>
</template>

<script>
import {mapGetters} from 'vuex'
import firebase from 'firebase'

export default {
  computed: {
    ...mapGetters({
      user: 'getUser'
    })
  },
  created: function () {
    firebase.auth().getRedirectResult().then(result => {
      if (result.user) this.onSignIn(result)
    }).catch(this.onError)
  },
  methods: {
    signIn () {
      var provider = new firebase.auth.GithubAuthProvider()
      firebase.auth().signInWithRedirect(provider)
    },
    signOut () {
      firebase.auth().signOut().then(this.onSignOut).catch(this.onError)
      this.$store.commit('setUser', null)
    },
    onSignOut () {
      console.log('onSignOut')
      this.$router.push('/')
    },
    onSignIn (result) {
      console.log('onSignIn: ', result.user.displayName)
    },
    onError (e) {
      console.error('onError: ', e)
    }
  }
}
</script>
