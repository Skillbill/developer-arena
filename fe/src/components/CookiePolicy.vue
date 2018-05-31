<template>
  <div class="cookie-policy-banner" v-if="showMessage">
    <p>"{{$t('siteName')}}" {{$t('cookiePolicyMessage')}}</p>
    <div class="buttons end">
      <button v-on:click="remove">{{$t('accept')}}</button>
      <button v-on:click="removeAndReadMore">{{$t('readMore')}}</button>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      accepted: null,
      STORAGE_COOKIE_ITEM: 'cookie-policy-accepted'
    }
  },
  computed: {
    showMessage() {
      return this.accepted === false;
    }
  },
  created() {
    this.accepted = !!localStorage.getItem(this.STORAGE_COOKIE_ITEM);
  },
  methods: {
    remove: function () {
      this.accepted = true;
      localStorage.setItem(this.STORAGE_COOKIE_ITEM, '1');
    },
    removeAndReadMore() {
      this.remove();
      this.$router.push('/cookie-policy');
    }
  }
}
</script>
