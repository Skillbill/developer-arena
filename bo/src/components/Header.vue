<template>
  <div class="d-flex flex-column flex-md-row align-items-center p-3 px-md-4 mb-3 bg-white border-bottom box-shadow">
    <h5 class="my-0 mr-md-auto font-weight-normal">SDA Constest Back Office</h5>
    <nav class="my-2 my-md-0 mr-md-3">
      <router-link class="p-2 text-dark" v-if="user" to="/edit-dates">Dates</router-link>
      <router-link class="p-2 text-dark" v-if="user" to="/contests">Contests</router-link>
      <span class="p-2 text-muted" v-if="user">{{user.displayName}}</span>
    </nav>
    <button type="button" class="btn btn-primary" v-if="!user" v-on:click="signIn">Sign in</button>
    <button type="button" class="btn btn-outline-danger" v-if="user" v-on:click="signOut">Sign out</button>
  </div>
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
  methods: {
    signIn () {
      var provider = new firebase.auth.GithubAuthProvider()
      firebase.auth().signInWithRedirect(provider)
    },
    signOut () {
      firebase.auth().signOut().then(this.onSignOut, this.onError)
      this.$store.commit('setUser', null)
    },
    onSignOut () {
      console.log('onSignOut')
      this.$router.push('/')
    },
    onError () {
      console.error('onError')
    }
  }
}
</script>
