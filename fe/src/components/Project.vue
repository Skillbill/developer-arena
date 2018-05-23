<template>
  <main class="project">
    <section>
      <div class="progress" v-if="loading"></div>
      <ProjectCard v-else :project="project" :show-video="true" :show-description="true"
        :show-repo="true" :show-edit="true" :show-deliverable="true" :image-scale="2" :show-preview="true" :show-votes="contest.state !== 'PRESENTATION' && contest.state !== 'APPLYING'" />
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
    },
    contest() {
      return this.$store.state.contest;
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
