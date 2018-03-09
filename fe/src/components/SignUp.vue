<template>
  <div class="sign-up">
    <h1>{{ $t('signUp') }}</h1>
    <input type="text" v-model="email" v-bind:placeholder="$t('email')"><br>
    <input type="password" v-model="password" v-bind:placeholder="$t('password')"><br>
    <button v-on:click="signUp">{{ $t('submit') }}</button>
  </div>
</template>

<script>
var firebase = require('firebase/app')
require('firebase/auth')

export default {
  name: 'SignUp',
  data: function () {
    return {
      email: '',
      password: ''
    }
  },
  methods: {
    signUp: function () {
      firebase.auth().createUserWithEmailAndPassword(this.email, this.password).then(
        (user) => {
          this.$router.replace(this.$route.query.redirect)
        },
        (err) => {
          alert(err.message)
        }
      )
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

</style>
