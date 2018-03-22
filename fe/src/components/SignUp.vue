<template>
  <main class="sign-up">
    <section>
      <h2>{{ $t('signUp') }}</h2>
      <form>
        <fieldset>
          <label for="email">{{$t('email')}}</label>
          <input type="email" id="email" v-model="email" v-bind:placeholder="$t('email')"><br>
          <label for="password">{{$t('password')}}</label>
          <input type="password" id="password" v-model="password" v-bind:placeholder="$t('password')"><br>
          <button v-on:click="signUp">{{ $t('submit') }}</button>
        </fieldset>
      </form>
    </section>
  </main>
</template>

<script>
import firebase from 'firebase'

export default {
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
