<template>
  <main class="submit">
    <section>
      <div v-show="!loading">
        <div v-show="!project || edit">
          <h2>{{$t(edit ? 'project.edit' : 'project.submit')}}</h2>
          <form action="#" method="post" class="submit-project" enctype="multipart/form-data" v-on:submit.prevent="submit">
            <fieldset>
              <label for="project-name">{{$t('project.title')}}</label>
              <input type="text" name="title" id="project-name" required v-model="title" maxlength="50">
              <label for="project-description">{{$t('project.description')}}</label>
              <textarea type="text" name="description" id="project-description" required rows="5" v-model="description"></textarea>
              <template v-if="!edit">
                <label for="project-repository">{{$t('project.repo')}}</label>
                <input type="url" name="repoURL" id="project-repository" placeholder="https://github.com/yourname/yourproject">
                <label for="project-thumbnail">{{$t('project.thumb')}}</label>
                <input type="file" name="image" id="project-thumbnail">
                <label for="project-file">{{$t('project.file')}}</label>
                <input type="file" name="deliverable" id="project-file">
              </template>
            </fieldset>
            <button type="submit">{{$t('project.send')}}</button>
          </form>
        </div>
        <div v-show="project && !edit">
          <p>{{$t('project.submitted')}}</p>
          <button v-on:click="editProject">{{$t('project.edit')}}</button>
        </div>
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
      edit: false,
      title: null,
      description: null
    }
  },
  computed: {
    project () {
      return this.$store.state.project;
    }
  },
  created() {
    this.loading = true;
    this.$store.dispatch('loadLastContest').then(() => {
      this.$store.dispatch('loadLastUserProject').then(() => {
        if(this.$store.state.project) {
          this.title = this.$store.state.project.title;
          this.description = this.$store.state.project.description;
        }
        this.loading = false;
      })
    })
  },
  methods: {
    submit(event) {
      let form = this.$el.querySelector('form');
      let projectFormData = new FormData(form);
      this.loading = true;
      this.$store.dispatch('submitProject', {projectFormData, edit: this.edit}).then(() => {
        this.loading = false;
        this.edit = false;
      });
    },
    editProject() {
      this.edit = true;
    }
  }
}
</script>
