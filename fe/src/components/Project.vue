<template>
  <main class="project">
    <section>
      <div class="progress" v-if="loading"></div>
      <ProjectCard :project="project" v-else/>
      <div class="card" v-if="project">
        {{project.description}}
      </div>
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
    project() {
      return this.$store.state.project;
    }
  },
  created() {
    this.loading = true;
    this.$store.dispatch('loadProject', {contestId: this.$route.params.contestId, projectId: this.$route.params.projectId}).then(() => {
      this.loading = false;
    });
  }
}
</script>
