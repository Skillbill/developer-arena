<template>
  <div>
    <div style="height: 56px"></div>
    <b-navbar id="my-nav" class="fixed-top" toggleable="md">
      <b-navbar-toggle target="nav_collapse"></b-navbar-toggle>
      <b-navbar-brand to="/">Developer Arena Back Office</b-navbar-brand>
      <b-collapse is-nav id="nav_collapse">
        <b-navbar-nav>
          <b-nav-item v-if="user && user.isAdmin" to="/contests">Contests</b-nav-item>
        </b-navbar-nav>
        <b-navbar-nav class="ml-auto">
          <b-nav-text class="pr-2" v-if="user">{{getUserDisplay(user)}}</b-nav-text>
          <b-button v-if="!user" variant="primary" to="/sign-in">Sign in</b-button>
          <b-button v-if="user" variant="outline-danger" @click="signOut">signOut</b-button>
        </b-navbar-nav>
      </b-collapse>
    </b-navbar>
  </div>
</template>

<script>
import {mapGetters} from 'vuex'
import auth from '@/lib/auth'
import * as utils from '@/lib/utils'

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
    },
    getUserDisplay (user) {
      return utils.getUserDisplay(user)
    }
  }
}
</script>

<style scoped>
#my-nav {
  background-color: #e3f2fd;
}
</style>
