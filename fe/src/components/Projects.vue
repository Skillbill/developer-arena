<template>
  <main class="projects">
    <section>
      <div v-show="!loading">
        <ul id="example-1">
          <li v-for="item in projects" :key="item.id">
            <div class="card">
              <h3><a href="project.html">{{ item.title }}</a></h3>
              <a href="project.html"><img src="static/graphics/assets/dummy/project.jpg" alt="Project Name thumbnail"></a>
              <div class="info">
                <strong>12 votes</strong>
              </div>
              <button>Vote</button>
            </div>
          </li>
        </ul>
      </div>
      <div class="progress" v-show="loading"></div>
    </section>
  </main>
</template>

<script>
export default {
  data() {
    return {
      loading: false,
      projects: []
    }
  },
  created() {
    this.loading = true;
    const contestPromise = this.$store.state.contest ? Promise.resolve() : this.$store.dispatch('loadLastContest');
    contestPromise.then(() => {
      return this.$store.dispatch('loadProjects');
    }).then(() => {
      this.projects = this.$store.state.projects;
      this.loading = false;
    })
  },
  methods: {
  }
}
</script>
