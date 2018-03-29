<template>
  <main class="sign-in">
    <section>
      <template v-if="loading">
        <div class="progress"></div>
      </template>
      <template v-else>
        <template v-if="!user">
          <h2>{{$t('signIn')}}</h2>
          <div class="sections">
            <section class="social">
              <div class="social-buttons">
                <button class="github" v-on:click="signIn('GithubAuthProvider')">GitHub</button>
                <button class="twitter" v-on:click="signIn('TwitterAuthProvider')">Twitter</button>
                <button class="google" v-on:click="signIn('GoogleAuthProvider', ['https://www.googleapis.com/auth/userinfo.email'])">Google</button>
                <button class="facebook" v-on:click="signIn('FacebookAuthProvider')">Facebook</button>
              </div>
            </section>
            <section class="email">
              <transition name="switch-form">
                <form v-if="signInSection === 'signIn'" v-on:submit="signIn('email')" key="sign-in-form">
                  <fieldset>
                    <legend>{{$t('signInEmail')}}</legend>
                    <label for="login-email">{{$t('email')}}</label>
                    <input type="email" id="login-email" v-model="email" required>
                    <label for="login-password">{{$t('password')}}</label>
                    <input type="password" id="login-password" v-model="password" required>
                    <div class="buttons end">
                      <button type="submit">{{ $t('submit') }}</button>
                    </div>
                  </fieldset>
                </form>
                <form v-if="signInSection === 'passwordLost'" v-on:submit="resetPassword" key="pwd-lost-form">
                  <fieldset>
                    <legend>{{$t('resetPassword')}}</legend>
                    <label for="login-email">{{$t('email')}}</label>
                    <input type="email" id="login-email" v-model="email" required>
                    <div class="buttons end">
                      <button type="submit">{{ $t('submit') }}</button>
                    </div>
                  </fieldset>
                </form>
                <form v-if="signInSection === 'signUp'" v-on:submit="signUp" key="sign-up-form">
                  <fieldset>
                    <legend>{{$t('signUp')}}</legend>
                    <label for="signup-email">{{$t('email')}}</label>
                    <input type="email" id="signup-email" v-model="email" required>
                    <label for="signup-password">{{$t('password')}}</label>
                    <input type="password" id="signup-password" v-model="password" required>
                    <label for="signup-password-confirm">{{$t('passwordConfirm')}}</label>
                    <input type="password" id="signup-password-confirm" v-model="passwordConfirm" required>
                    <div class="buttons end">
                      <button type="submit">{{ $t('submit') }}</button>
                    </div>
                  </fieldset>
                </form>
              </transition>
              <ul class="no-list-style">
                <li v-if="signInSection !== 'passwordLost'" key="pwd-lost-link">
                  <a v-on:click.prevent="switchToPasswordLost()" href="#">{{ $t('passwordLost') }}</a>
                </li>
                <li v-if="signInSection !== 'signIn'" key="sign-in-link">
                  <a v-on:click.prevent="switchToSignIn()" href="#">{{ $t('signInEmail') }}</a>
                </li>
                <li v-if="signInSection !== 'signUp'" key="sign-up-link">
                  <a v-on:click.prevent="switchToSignUp()" href="#">{{$t('signUp')}}</a>
                </li>
              </ul>
            </section>
          </div>
        </template>
        <div v-else>
          <p v-if="providerPassword && !emailVerified">{{$t('signedInAsAndVerifyEmail', {name: user.displayName || user.email})}}</p>
          <p v-else>{{$t('signedInAs', {name: user.displayName || user.email})}}</p>
        </div>
      </template>
    </section>
  </main>
</template>

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
            if (providers[0] === 'google.com') {
              this.signIn('GoogleAuthProvider');
            } else {
              let args = {provider: providers[0], email: error.email};
              this.$store.commit('setFeedbackError', {message: 'proceedWithProvider', args});
            }
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
      this.loading = true;
      firebase.auth().sendPasswordResetEmail(this.email, {url: document.location.href}).then(() => {
        this.$store.commit('setFeedbackOk', 'resetEmailSent');
        this.loading = false;
      }).catch(error => {
        console.error(error, error.message);
        showFirebaseErroMessage.apply(this, [error]);
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
