<template>
  <main class="sign-up">
    <section>
      <template v-if="loading">
        <div class="progress"></div>
      </template>
      <template v-else>
        <h2>{{ $t('signUp') }}</h2>
        <form v-on:submit="signUp">
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
        <router-link to="/sign-in">{{$t('signIn')}}</router-link>
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
      passwordConfirm: null
    }
  },
  methods: {
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
    }
  }
}
</script>
