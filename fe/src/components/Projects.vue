<template>
  <main class="projects">
    <section>
      <div v-show="!loading">
        <template v-if="contest && contest.state === 'PRESENTATION'">
          <div class="card">
            <span class="text-align-center">{{$t('contest.notStarted')}} {{$d(new Date(contest.endPresentation), 'short')}}</span>
          </div>
        </template>
        <template v-else>
          <div class="links-list" v-if="contest && projects && projects.length > 0" role="navigation">
            <span>{{$t('sorting.label')}}</span>
            <ul>
              <li v-for="item in contestStorting" :key="item">
                <router-link :to="{name: 'Projects', params: {contestId: contest.id}, query: {sort: item}}">{{$t(`sorting.${item}`)}}</router-link>
              </li>
            </ul>
          </div>
          <ul class="projects-list" v-if="contest && projects && projects.length > 0">
            <li v-for="(item, index) in projects" :key="item.id">
              <ProjectCard :project="item" :rankPosition="isRanking ? index + 1 : null" :show-default-image="true" :show-votes="contest.state !== 'PRESENTATION' && contest.state !== 'APPLYING'"/>
            </li>
          </ul>
          <div class="card" v-else>
            <span class="text-align-center">{{$t('contest.noProjects')}}</span>
          </div>
        </template>
      </div>
      <div class="progress" v-show="loading"></div>
      <template v-if="contest && contest.state === 'APPLYING'">
        <form action="#" class="submit-project sticky-bottom" v-on:submit.prevent="applyContest">
          <button type="submit">{{ $t('applyContest') }}</button>
        </form>
      </template>
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
    },
    isRanking() {
      return this.$route.query.sort === 'rank';
    },
    contestStorting() {
      return this.$store.getters.contestStorting;
    }
  },
  created() {
    this.loadProjects();
  },
  beforeRouteUpdate (to, from, next) {
    next();
    this.loadProjects();
  },
  methods: {
    loadProjects() {
      this.loading = true;
      const {contestId, sort} = this.$route.params;
      this.$store.dispatch('loadContest', {contestId}).then(() => {
        return this.$store.dispatch('loadProjects', {contestId, sort});
      }).then(() => {
        this.loading = false;
      });
    },
    applyContest() {
      this.$router.push('/submit-entry');
    }
  }
}
</script>
