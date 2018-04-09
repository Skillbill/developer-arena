<template>
  <main class="projects">
    <section>
      <div v-show="!loading">
        <ul v-if="projects && projects.length > 0">
          <li v-for="item in projects" :key="item.id">
            <ProjectCard :project="item"/>
          </li>
        </ul>
        <div class="card" v-else>
          <p v-if="contest && contest.state === 'PRESENTATION'" class="text-align-center">{{$t('contest.notStarted')}} {{$d(new Date(contest.endPresentation), 'short')}}</p>
          <p v-else class="text-align-center">{{$t('contest.noProjects')}}</p>
        </div>
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
    },
    contest() {
      return this.$store.state.contest;
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
