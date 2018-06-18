<template>
  <div :id="containerId" class="g-recaptcha"></div>
</template>
<script>
import auth from '@/auth';
export default {
  props: {
    containerId: {
      type: String,
      required: true
    },
    eventVerify: {
      type: String,
      required: true
    }
  },
  methods: {
    verify() {
      window.recaptchaVerifier ? window.recaptchaVerifier.verify() : this.callback();
    },
    reset() {
      if (window.recaptchaVerifier) {
        window.recaptchaVerifier.reset();
      }
    },
    callback(token) {
      this.$emit(this.eventVerify, token);
      this.reset();
    }
  },
  mounted () {
    window.recaptchaVerifier = auth.getRecaptchaVerifier(this.containerId, {
      size: 'invisible',
      badge: 'inline',
      callback: this.callback,
      hl: this.$store.state.language
    });
    if (window.recaptchaVerifier) {
      window.recaptchaVerifier.render();
    }
  }
}
</script>
