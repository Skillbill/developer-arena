<template>
  <main class="jury">
    <section>
      <h2>{{$t("menu.jury")}}</h2>
      <div class="progress" v-if="loading"></div>
      <div v-else>
       <ul class="jury-list">
         <li v-for="judge in jury" :key="judge.id">
             <Judge :judge="judge" />
         </li>
       </ul>
      </div>
    </section>
  </main>
</template>

<script>

import Judge from '@/components/Judge';

export default {
  components: {
    Judge
  },
  data() {
    return {
      loading: false
    }
  },
  computed: {
    jury() {
      return this.$store.state.jury;
    }
  },
  created() {
    this.loading = true;
    this.$store.dispatch('loadJury', {contestId: this.$route.params.contestId}).then(() => {
      this.loading = false;
    });
  }
}
</script>
