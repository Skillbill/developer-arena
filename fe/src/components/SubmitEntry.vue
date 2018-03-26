<template>
  <main class="submit">
    <section>
      <template v-if="!loading && contest">
        <template v-if="!project || edit">
          <h2>{{$t('project.submit')}}</h2>
          <form action="#" method="post" class="submit-project" enctype="multipart/form-data" v-on:submit.prevent="submit">
            <fieldset>
              <label for="project-name">{{$t('project.title')}}</label>
              <input type="text" name="title" id="project-name" placeholder="Awesome Project" required>
              <label for="project-description">{{$t('project.description')}}</label>
              <textarea type="text" name="description" id="project-description" placeholder="Project description..." required rows="5"></textarea>
              <label for="project-repository">{{$t('project.repo')}}</label>
              <input type="url" name="repoURL" id="project-repository" placeholder="https://github.com/yourname/yourproject">
              <label for="project-thumbnail">{{$t('project.thumb')}}</label>
              <input type="file" name="image" id="project-thumbnail">
              <label for="project-file">{{$t('project.file')}}</label>
              <input type="file" name="deliverable" id="project-file">
            </fieldset>
            <button type="submit">{{$t('project.send')}}</button>
          </form>
        </template>
        <template v-else>
          <p>{{$t('project.submitted')}}</p>
          <button v-on:click="editProject">{{$t('project.edit')}}</button>
        </template>
      </template>
      <div class="progress" v-else></div>
    </section>
  </main>
</template>

<script>
export default {
  data() {
    return {
      loading: false,
      edit: false
    }
  },
  computed: {
    contest () {
      return this.$store.state.contest;
    },
    project () {
      return this.$store.state.project;
    }
  },
  created() {
    if(!this.$store.state.contest) {
      this.$store.dispatch('loadLastContest');
    }
  },
  methods: {
    submit(event) {
      let form = this.$el.querySelector('form');
      let formData = new FormData(form);
      this.loading = true;
      this.$store.dispatch('submitProject', formData).then(() => {
        this.loading = false;
      });
    },
    editProject() {
      this.edit = true;
    }
  }
}
</script>
