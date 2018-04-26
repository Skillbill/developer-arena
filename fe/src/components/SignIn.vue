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
              <div v-if="proceedWithProvider" class="card">
                <p>{{$t('proceedWithProvider', this.proceedWithProvider)}}</p>
                <ProviderButton :provider="this.proceedWithProvider.provider" :onProceed="signIn" :label="$t('proceedWithProviderButton', this.proceedWithProvider)"></ProviderButton>
              </div>
              <div class="social-buttons">
                <template v-for="provider in providers">
                  <ProviderButton :provider="provider" :onProceed="signIn" :key="provider"></ProviderButton>
                </template>
              </div>
            </section>
            <section class="email">
              <transition name="switch-form">
                <form v-if="signInSection === 'signIn'" v-on:submit.prevent="signIn('email')" key="sign-in-form">
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
                <form v-if="signInSection === 'passwordLost'" v-on:submit.prevent="resetPassword" key="pwd-lost-form">
                  <fieldset>
                    <legend>{{$t('resetPassword')}}</legend>
                    <label for="login-email">{{$t('email')}}</label>
                    <input type="email" id="login-email" v-model="email" required>
                    <div class="buttons end">
                      <button type="submit">{{ $t('submit') }}</button>
                    </div>
                  </fieldset>
                </form>
                <form v-if="signInSection === 'signUp'" v-on:submit.prevent="signUp" key="sign-up-form">
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
          <div v-if="providerPassword && !emailVerified">
            <p>{{$t('signedInAsAndVerifyEmail', {name: user.displayName || user.email})}}</p>
            <button @click="resendEmailVerification">{{$t('resendVerificationEmail')}}</button>
          </div>
          <p v-else>{{$t('signedInAs', {name: user.displayName || user.email})}}</p>
        </div>
      </template>
    </section>
  </main>
</template>

<script>
import auth from '@/auth'
import ProviderButton from '@/components/ProviderButton'

function showFirebaseErroMessage(error) {
  if(auth.isDevMode()) {
    this.$store.commit('setFeedbackError', error.message);
    return;
  }
  let errorMessage = `firebase.${(error.code || '').replace('/', '-')}`;
  if(!this.$i18n.te(errorMessage)) {
    errorMessage = 'firebase.generic-error';
  }
  this.$store.commit('setFeedbackError', errorMessage);
}

export default {
  data() {
    return {
      providers: auth.getEnabledProviders(),
      loading: false,
      email: null,
      password: null,
      passwordConfirm: null,
      signInSection: 'signIn',
      proceedWithProvider: null
    }
  },
  components: {
    ProviderButton
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
    if(this.$store.state.firebaseRedirectResultConsumed) {
      return;
    }
    auth.getRedirectResult().then((result) => {
      this.$store.commit('setFirebaseRedirectResultConsumed', true);
      this.redirectAfterSignIn(result ? result.user : null);
    }).catch((error) => {
      console.error(error, error.message);
      this.$store.commit('setFirebaseRedirectResultConsumed', true);
      if(error.email && error.code === 'auth/account-exists-with-different-credential') {
        auth.fetchProvidersForEmail(error.email).then(providers => {
          if(providers[0] && providers[0] !== 'password') {
            this.proceedWithProvider = {provider: providers[0], email: error.email};
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
      this.$store.commit('removeFeedback');
      this.loading = true;
      if(providerName === 'email') {
        auth.signInWithEmailAndPassword(this.email, this.password).then((result) => {
          this.loading = false;
          this.redirectAfterSignIn(result);
        }).catch((error) => {
          console.error(error, error.message);
          showFirebaseErroMessage.apply(this, [error]);
          this.loading = false;
        });
      } else {
        const provider = auth.getProvider(providerName);
        scopes.forEach((scope) => {
          provider.addScope(scope);
        });
        auth.signInWithRedirect(provider);
      }
    },
    resetPassword () {
      this.loading = true;
      auth.sendPasswordResetEmail(this.email, {url: document.location.href}).then(() => {
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
      auth.createUserWithEmailAndPassword(this.email, this.password).then(user => {
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
    resendEmailVerification () {
      this.loading = true;
      let continueUrl = document.location.href;
      if(this.$route.query.redirect) {
        const a = document.createElement('a');
        a.href = this.$router.resolve(this.$route.query.redirect).href;
        continueUrl = a.protocol + '//' + a.host + a.pathname + a.search + a.hash;
      }
      this.user.sendEmailVerification({url: continueUrl}).then(() => {
        this.$store.commit('setFeedbackOk', 'verificationEmailResent');
        this.loading = false;
      }).catch(error => {
        console.error(error, error.message);
        showFirebaseErroMessage.apply(this, [error]);
        this.loading = false;
      })
    },
    switchToSignUp() {
      this.signInSection = 'signUp';
    },
    switchToPasswordLost() {
      this.signInSection = 'passwordLost';
    },
    switchToSignIn() {
      this.signInSection = 'signIn';
    },
    redirectAfterSignIn(user) {
      if(user) {
        if(user.providerData[0].providerId === 'password' && !user.emailVerified) {
          return;
        }
        if(this.$route.query.redirect) {
          this.$router.replace(this.$route.query.redirect);
        } else {
          this.$router.replace('/');
        }
      }
    }
  }
}
</script>
