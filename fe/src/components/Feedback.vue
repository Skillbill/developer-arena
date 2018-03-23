<template>
  <div class="feedback-message" v-if="message" v-on:click="removeFeedback">
    <p class="feedback" :class="type">
      {{$t(message)}}
      <button v-on:click="removeFeedback">{{$t('close')}}</button>
    </p>
  </div>
</template>

<script>
export default {
  computed: {
    message() {
      return this.$store.state.feedback && this.$store.state.feedback.message;
    },
    type() {
      return this.$store.state.feedback && this.$store.state.feedback.type;
    }
  },
  methods: {
    removeFeedback: function () {
      this.$store.commit('removeFeedback');
    }
  }
}
</script>
