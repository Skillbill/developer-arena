<template>
  <div class="feedback-message" v-if="message" v-on:click="removeFeedback">
    <p class="feedback" :class="type">
      <template v-if="$te(message)">
        {{$t(message, args)}}
      </template>
      <template v-else>
        {{message}}
      </template>
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
    },
    args() {
      return this.$store.state.feedback && this.$store.state.feedback.args;
    }
  },
  methods: {
    removeFeedback: function () {
      this.$store.commit('removeFeedback');
    }
  }
}
</script>
