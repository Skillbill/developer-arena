<template>
  <div class="home ml-2">
    <h1>Welcome to the Back Office</h1>
    <h3 v-if="!user">Please sign in</h3>
    <h3 v-else>You are signed in as {{user.displayName}}</h3>
    <h3 v-if="user && !user.isAdmin">You don't have admin rights</h3>
  </div>
</template>

<script>
import {mapGetters} from 'vuex'

export default {
  name: 'Home',
  computed: {
    ...mapGetters({
      user: 'getUser'
    })
  }
}
</script>
