<template>
  <main class="sign-in">
    <section>
      <h2>{{$t('signIn')}}</h2>
      <div class="social-buttons" v-if="!user">
        <button class="github" v-on:click="signIn('GithubAuthProvider')">GitHub</button>
        <button class="twitter" v-on:click="signIn('TwitterAuthProvider')">Twitter</button>
        <button class="google" v-on:click="signIn('GoogleAuthProvider')">Google</button>
        <button class="facebook" v-on:click="signIn('FacebookAuthProvider')">Facebook</button>
      </div>
      <div v-else>
        <p>{{$t('loggedInAs', {name: user.displayName || user.email})}}</p>
      </div>
    </section>
  </main>
</template>

<script>
import firebase from 'firebase'

export default {
  name: 'SignIn',
  computed: {
    user() {
      return this.$store.state.user;
    }
  },
  methods: {
    signIn(providerName) {
      var provider = new firebase.auth[providerName]();
      firebase.auth().signInWithPopup(provider).then((result) => {
        console.log('auth result', result);
      }).catch((error) => {
        console.error('auth error', error);
        this.$store.commit('setFeedbackError', error.message || error);
      });
    }
  }
}
</script>
