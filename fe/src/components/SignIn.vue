<template>
  <main class="sign-in">
    <section>
      <template v-if="loading">
        <div class="progress"></div>
      </template>
      <template v-else>
        <h2 v-if="signInSection === 'signIn'">{{$t('signIn')}}</h2>
        <h2 v-else-if="signInSection === 'passwordLost'">{{$t('resetPassword')}}</h2>
        <h2 v-else>{{$t('signUp')}}</h2>
        <div v-if="!user">
          <div class="social-buttons">
            <button class="github" v-on:click="signIn('GithubAuthProvider')">GitHub</button>
            <button class="twitter" v-on:click="signIn('TwitterAuthProvider')">Twitter</button>
            <button class="google" v-on:click="signIn('GoogleAuthProvider', ['https://www.googleapis.com/auth/userinfo.email'])">Google</button>
            <button class="facebook" v-on:click="signIn('FacebookAuthProvider')">Facebook</button>
          </div>
          <form v-if="signInSection === 'signIn'" v-on:submit="signIn('email')">
            <fieldset>
              <label for="login-email">{{$t('email')}}</label>
              <input type="email" id="login-email" v-model="email" required><br>
              <label for="login-password">{{$t('password')}}</label>
              <input type="password" id="login-password" v-model="password" required><br>
              <button>{{ $t('submit') }}</button>
              <a class="small-right" v-on:click.prevent="switchToPasswordLost()" href="#">{{ $t('passwordLost') }}</a>
            </fieldset>
          </form>
          <form v-else-if="signInSection === 'passwordLost'" v-on:submit="resetPassword">
            <fieldset>
              <label for="login-email">{{$t('email')}}</label>
              <input type="email" id="login-email" v-model="email" required><br>
              <button>{{ $t('submit') }}</button>
              <a class="small-right" v-on:click.prevent="switchToSignIn()" href="#">{{ $t('back') }}</a>
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
          <button v-if="signInSection !== 'signUp'" v-on:click="switchToSignUp()">{{$t('signUp')}}</button>
          <button v-else v-on:click="switchToSignIn()">{{$t('signIn')}}</button>
        </div>
        <div v-else>
          <p v-if="providerPassword && !emailVerified">{{$t('signedInAsAndVerifyEmail', {name: user.displayName || user.email})}}</p>
          <p v-else>{{$t('signedInAs', {name: user.displayName || user.email})}}</p>
        </div>
      </template>
    </section>
  </main>
</template>

<style scoped>
  .small-right {
    cursor: pointer;
    float: right;
    font-size: 80%;
  }
</style>

<script>
import firebase from 'firebase'

function showFirebaseErroMessage(error) {
  let errorMessage = `firebase.${error.code.replace('/', '-')}`;
  if(!this.$i18n.te(errorMessage)) {
    errorMessage = 'firebase.generic-error';
  }
  this.$store.commit('setFeedbackError', errorMessage);
}

export default {
  data() {
    return {
      loading: false,
      email: null,
      password: null,
      passwordConfirm: null,
      signInSection: 'signIn'
    }
  },
  computed: {
    user() {
      return this.$store.state.user;
    },
    providerPassword() {
      return this.user && this.user.providerData[0].providerId === 'password'
    },
    emailVerified() {
      return this.user && this.user.emailVerified === true
    }
  },
  created () {
    firebase.auth().getRedirectResult().then(() => {
      if(this.$route.query.redirect) {
        this.$router.replace(this.$route.query.redirect);
      }
    }).catch((error) => {
      console.error(error, error.message);
      if(error.email && error.code === 'auth/account-exists-with-different-credential') {
        firebase.auth().fetchProvidersForEmail(error.email).then(providers => {
          if(providers[0] && providers[0] !== 'password') {
            let args = {provider: providers[0], email: error.email};
            this.$store.commit('setFeedbackError', {message: 'proceedWithProvider', args});
          } else {
            showFirebaseErroMessage.apply(this, [error]);
          }
        });
        return;
      }
      showFirebaseErroMessage.apply(this, [error]);
    });
  },
  methods: {
    signIn(providerName, scopes = []) {
      let signInFn;
      this.$store.commit('removeFeedback');
      this.loading = true;
      if(providerName === 'email') {
        signInFn = firebase.auth().signInWithEmailAndPassword(this.email, this.password);
      } else {
        const provider = new firebase.auth[providerName]();
        scopes.forEach((scope) => {
          provider.addScope(scope);
        });
        signInFn = firebase.auth().signInWithRedirect(provider);
      }
      signInFn.then((result) => {
        this.loading = false;
        if(this.$route.query.redirect) {
          this.$router.replace(this.$route.query.redirect);
        }
      }).catch((error) => {
        console.error(error, error.message);
        showFirebaseErroMessage.apply(this, [error]);
        this.loading = false;
      });
    },
    resetPassword () {
      firebase.auth().sendPasswordResetEmail(this.email, {url: document.location.href}).then(() => {
        this.$store.commit('setFeedbackOk', 'resetEmailSent');
      }).catch(error => {
        console.error(error, error.message);
        showFirebaseErroMessage.apply(this, [error]);
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
        let continueUrl = document.location.href;
        if(this.$route.query.redirect) {
          const a = document.createElement('a');
          a.href = this.$router.resolve(this.$route.query.redirect).href;
          continueUrl = a.protocol + '//' + a.host + a.pathname + a.search + a.hash;
        }
        user.sendEmailVerification({url: continueUrl});
        this.signInSection = 'signIn';
        this.loading = false;
      }).catch(error => {
        console.error(error, error.message);
        showFirebaseErroMessage.apply(this, [error]);
        this.loading = false;
      });
    },
    switchToSignUp() {
      this.signInSection = 'signUp';
    },
    switchToPasswordLost() {
      this.signInSection = 'passwordLost';
    },
    switchToSignIn() {
      this.signInSection = 'signIn';
    }
  }
}
</script>
