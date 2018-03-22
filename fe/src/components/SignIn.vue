<template>
  <main class="sign-in">
    <section>
      <template v-if="loading">
        <div class="progress"></div>
      </template>
      <template v-else>
        <h2>{{$t('signIn')}}</h2>
        <div v-if="!user">
          <div class="social-buttons">
            <button class="github" v-on:click="signIn('GithubAuthProvider')">GitHub</button>
            <button class="twitter" v-on:click="signIn('TwitterAuthProvider')">Twitter</button>
            <button class="google" v-on:click="signIn('GoogleAuthProvider')">Google</button>
            <button class="facebook" v-on:click="signIn('FacebookAuthProvider')">Facebook</button>
          </div>
          <form v-on:submit="signIn('email')">
            <fieldset>
              <label for="login-email">{{$t('email')}}</label>
              <input type="email" id="login-email" v-model="email" required><br>
              <label for="login-password">{{$t('password')}}</label>
              <input type="password" id="login-password" v-model="password" required><br>
              <button>{{ $t('submit') }}</button>
            </fieldset>
            <router-link to="/sign-up">{{$t('signUp')}}</router-link>
          </form>
        </div>
        <div v-else>
          <p>{{$t('signedInAs', {name: user.displayName || user.email})}}</p>
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
      loading: false,
      email: null,
      password: null
    }
  },
  computed: {
    user() {
      return this.$store.state.user;
    }
  },
  methods: {
    signIn(providerName) {
      let signInFn;
      this.$store.commit('removeFeedback');
      this.loading = true;
      if(providerName === 'email') {
        signInFn = firebase.auth().signInWithEmailAndPassword(this.email, this.password);
      } else {
        const provider = new firebase.auth[providerName]();
        signInFn = firebase.auth().signInWithPopup(provider);
      }
      signInFn.then((result) => {
        this.loading = false;
        if(this.$route.query.redirect) {
          this.$router.replace(this.$route.query.redirect);
        }
      }).catch((error) => {
        console.error(error, error.message);
        let errorMessage = `firebase.${error.code.replace('/', '-')}`;
        if(!this.$i18n.te(errorMessage)) {
          errorMessage = 'firebase.generic-error';
        }
        this.$store.commit('setFeedbackError', errorMessage);
        this.loading = false;
      });
    }
  }
}
</script>
