<template>
  <nav class="navbar fixed-top navbar-expand-lg navbar-light mb-2" style="background-color: #e3f2fd;">
    <router-link class="navbar-brand" to='/'>SDA Contest Back Office</router-link>
    <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
      <span class="navbar-toggler-icon"></span>
    </button>
    <div class="collapse navbar-collapse" id="navbarSupportedContent">
      <ul class="navbar-nav mr-auto">
        <li class="nav-item" v-if="user">
          <router-link class="nav-link" to="/contests">Contests</router-link>
        </li>
      </ul>
      <span class="pr-2 navbar-text" v-if="user">{{user.displayName}}</span>
      <router-link type="button" class="btn btn-primary" v-if="!user" to="/sign-in">Sign in</router-link>
      <button type="button" class="btn btn-outline-danger" v-if="user" v-on:click="signOut">Sign out</button>
    </div>
  </nav>
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
