<template>
  <main class="profile">
    <section>
      <template v-if="!loading">
        <h2>{{$t('profile.title')}}</h2>
        <form action="#" method="post" class="submit-profile" v-on:submit.prevent="submit">
          <fieldset>
            <label for="profile-email">
              <span>{{$t('profile.email')}} *</span>
            </label>
            <input type="email" name="email" id="profile-email" required v-model="email" placeholder="name@email.com">
          </fieldset>
          <button type="submit">{{$t('profile.send')}}</button>
        </form>
      </template>
      <div class="progress" v-if="loading"></div>
    </section>
  </main>
</template>

<script>

export default {
  data() {
    return {
      email: null,
      loading: false
    }
  },
  computed: {
    user() {
      return this.$store.state.user;
    },
    userClaims() {
      return this.$store.state.userClaims;
    }
  },
  created() {
    if(this.user) {
      if(this.user.email) {
        this.email = this.user.email;
      } else if(this.userClaims && this.userClaims.email) {
        this.email = this.userClaims.email;
      }
    }
  },
  methods: {
    submit() {
      this.loading = true;
      this.$store.dispatch('saveProfile', {email: this.email}).then(() => {
        return this.$store.dispatch('refreshUser').then(() => {
          this.loading = false;
          if(this.$route.query.redirect) {
            this.$router.replace(this.$route.query.redirect);
          }
        })
      })
    }
  }
}
</script>
