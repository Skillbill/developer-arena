<template>
  <b-navbar class="fixed-top" toggleable="md" style="background-color: #e3f2fd;">
    <b-navbar-toggle target="nav_collapse"></b-navbar-toggle>
    <b-navbar-brand to="/">SDA Contest Back Office</b-navbar-brand>
    <b-collapse is-nav id="nav_collapse">
      <b-navbar-nav>
        <b-nav-item v-if="user" to="/contests">Contests</b-nav-item>
      </b-navbar-nav>
      <b-navbar-nav class="ml-auto">
        <b-nav-text class="pr-2" v-if="user">{{user.displayName}}</b-nav-text>
        <b-button v-if="!user" variant="primary" to="/sign-in">Sign in</b-button>
        <b-button v-if="user" variant="outline-danger" @click="signOut">signOut</b-button>
      </b-navbar-nav>
    </b-collapse>
  </b-navbar>
</template>

<script>
import {mapGetters} from 'vuex'
import auth from '@/lib/auth'

export default {
  name: 'Header',
  computed: {
    ...mapGetters({
      user: 'getUser'
    })
  },
  methods: {
    signOut () {
      auth.signOut()
    }
  }
}
</script>
