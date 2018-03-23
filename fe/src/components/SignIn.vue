<template>
  <main class="sign-in">
    <section>
      <template v-if="loading">
        <div class="progress"></div>
      </template>
      <template v-else>
        <h2 v-if="singIn">{{$t('signIn')}}</h2>
        <h2 v-else>{{$t('signUp')}}</h2>
        <div v-if="!user">
          <div class="social-buttons">
            <button class="github" v-on:click="signIn('GithubAuthProvider')">GitHub</button>
            <button class="twitter" v-on:click="signIn('TwitterAuthProvider')">Twitter</button>
            <button class="google" v-on:click="signIn('GoogleAuthProvider')">Google</button>
            <button class="facebook" v-on:click="signIn('FacebookAuthProvider')">Facebook</button>
          </div>
          <form v-if="singIn" v-on:submit="signIn('email')">
            <fieldset>
              <label for="login-email">{{$t('email')}}</label>
              <input type="email" id="login-email" v-model="email" required><br>
              <label for="login-password">{{$t('password')}}</label>
              <input type="password" id="login-password" v-model="password" required><br>
              <button>{{ $t('submit') }}</button>
            </fieldset>
          </form>
          <form v-else v-on:submit="signUp">
            <fieldset>
              <label for="signup-email">{{$t('email')}}</label>
              <input type="email" id="signup-email" v-model="email" required><br>
              <label for="signup-password">{{$t('password')}}</label>
              <input type="password" id="signup-password" v-model="password" required><br>
              <label for="signup-password-confirm">{{$t('passwordConfirm')}}</label>
              <input type="password" id="signup-password-confirm" v-model="passwordConfirm" required><br>
              <button>{{ $t('submit') }}</button>
            </fieldset>
          </form>
          <button v-if="singIn" v-on:click="switchToSignUp()">{{$t('signUp')}}</button>
          <button v-else v-on:click="switchToSignIn()">{{$t('signIn')}}</button>
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
      password: null,
      passwordConfirm: null,
      singIn: true
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
    },
    signUp () {
      this.$store.commit('removeFeedback');
      if(this.password !== this.passwordConfirm) {
        this.$store.commit('setFeedbackError', 'wrongPasswordConfirm');
        this.$el.querySelector('#signup-password-confirm').focus();
        return;
      }
      this.loading = true;
      firebase.auth().createUserWithEmailAndPassword(this.email, this.password).then(user => {
        this.$store.commit('setFeedbackOk', 'accountCreated');
        user.sendEmailVerification();
        if(this.$route.query.redirect) {
          this.$router.replace(this.$route.query.redirect);
        } else {
          this.$router.replace('sign-in');
        }
        this.loading = false;
      }).catch(error => {
        console.error(error, error.message);
        let errorMessage = `firebase.${error.code.replace('/', '-')}`;
        if(!this.$i18n.te(errorMessage)) {
          errorMessage = 'firebase.generic-error';
        }
        this.$store.commit('setFeedbackError', errorMessage);
        this.loading = false;
      });
    },
    switchToSignUp() {
      this.singIn = false;
    },
    switchToSignIn() {
      this.singIn = true;
    }
  }
}
</script>
