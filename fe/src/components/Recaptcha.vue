<template>
  <div id="g-recaptcha" class="g-recaptcha" :data-sitekey="siteKey"></div>
</template>
<script>
export default {
  props: {
    siteKey: {
      type: String,
      required: true
    },
    eventVerify: {
      type: String,
      required: true
    }
  },
  methods: {
    execute() {
      if (this.siteKey) {
        window.grecaptcha.execute();
      } else {
        this.callback();
      }
    },
    reset() {
      window.grecaptcha.reset();
    },
    callback(token) {
      this.$emit(this.eventVerify, token);
      this.reset();
    }
  },
  mounted () {
    if (this.siteKey !== '') {
      window.grecaptcha.render('g-recaptcha', {
        size: 'invisible',
        badge: 'inline',
        sitekey: this.siteKey,
        callback: this.callback,
        hl: this.$store.state.language
      });
    }
  }
}
</script>
