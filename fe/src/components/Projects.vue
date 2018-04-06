<template>
  <main class="projects">
    <section>
      <div v-show="!loading">
        <ul>
          <li v-for="item in projects" :key="item.id">
            <ProjectCard :project="item"/>
          </li>
        </ul>
      </div>
      <div class="progress" v-show="loading"></div>
    </section>
  </main>
</template>

<script>
import ProjectCard from '@/components/ProjectCard';

export default {
  components: {
    ProjectCard
  },
  data() {
    return {
      loading: false
    }
  },
  computed: {
    projects() {
      return this.$store.state.projects;
    }
  },
  created() {
    this.loading = true;
    this.$store.dispatch('loadContest', {contestId: this.$route.params.contestId}).then(() => {
      return this.$store.dispatch('loadProjects', {contestId: this.$route.params.contestId});
    }).then(() => {
      this.loading = false;
    });
  }
}
</script>
