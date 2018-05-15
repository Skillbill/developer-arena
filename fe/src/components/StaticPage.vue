<template>
  <main>
    <section>
      <div class="progress" v-if="loading" key="loading"></div>
      <div v-else v-md="contents"></div>
    </section>
  </main>
</template>

<script>
import axios from 'axios';

export default {
  data() {
    return {
      loading: true,
      contents: ''
    }
  },
  created() {
    axios({
      method: 'get',
      url: this.$route.meta.md.replace('[lang]', this.$store.state.language)
    }).then(response => {
      this.loading = false;
      this.contents = response ? response.data : '';
    }).catch(e => {
      this.loading = false;
      console.error(e);
      this.$store.commit('setFeedbackError', 'api.errors.generic');
    });
  }
}
</script>
