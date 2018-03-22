<template>
  <main class="sign-in">
    <section>
      <template v-if="loading">
        <div class="progress"></div>
      </template>
      <template v-else>
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
      </template>
    </section>
  </main>
</template>

<script>
import firebase from 'firebase'

export default {
  data() {
    return {
      loading: false
    }
  },
  computed: {
    user() {
      return this.$store.state.user;
    }
  },
  methods: {
    signIn(providerName) {
      var provider = new firebase.auth[providerName]();
      this.loading = true;
      firebase.auth().signInWithPopup(provider).then((result) => {
        console.log('auth result', result);
        this.loading = false;
        if(this.$route.query.redirect) {
          this.$router.replace(this.$route.query.redirect);
        }
      }).catch((error) => {
        console.error('auth error', error);
        this.$store.commit('setFeedbackError', error.message || error);
        this.loading = false;
      });
    }
  }
}
</script>
