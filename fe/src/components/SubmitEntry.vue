<template>
  <main class="submit">
    <section>
      <div v-show="!loading && !uploading">
        <div v-show="!project || edit">
          <h2>{{$t(edit ? 'project.edit' : 'project.submit')}}</h2>
          <form action="#" method="post" class="submit-project" enctype="multipart/form-data" v-on:submit.prevent="submit">
            <fieldset>
              <label for="project-name">{{$t('project.title')}} *</label>
              <input type="text" name="title" id="project-name" required v-model="title" maxlength="50">
              <label for="project-description">{{$t('project.description')}} *</label>
              <textarea type="text" name="description" id="project-description" required rows="5" v-model="description"></textarea>
              <label for="project-video">{{$t('project.video')}}</label>
              <input type="url" name="video" id="project-video" placeholder="https://youtu.be/Lo2qQmj0_h4" v-model="video" maxlength="50">
              <label for="project-repository">{{$t('project.repo')}}</label>
              <input type="url" name="repoURL" id="project-repository" placeholder="https://github.com/yourname/yourproject" v-model="repoURL">
              <label for="project-thumbnail">{{$t('project.thumb')}}</label>
              <input type="file" name="image" id="project-thumbnail">
              <label for="project-file">{{$t('project.file')}} {{edit? '' : '*'}}</label>
              <input type="file" name="deliverable" id="project-file" :required=!edit>
              <p class="text-align-right">* {{$t('project.requiredFields')}}</p>
            </fieldset>
            <button type="submit">{{$t('project.send')}}</button>
          </form>
        </div>
        <div v-show="project && !edit" class="card">
          <p>{{$t('project.submitted')}}</p>
          <button v-on:click="editProject">{{$t('project.edit')}}</button>
        </div>
      </div>
      <div class="progress" v-if="loading"></div>
      <ProgressBar v-if="uploading" :progress=progress :label="$t('project.uploading')"></ProgressBar>
    </section>
  </main>
</template>

<script>
import ProgressBar from '@/components/ProgressBar'
import {getYoutubeVideoKey} from 'shared-utils'

export default {
  components: {
    ProgressBar
  },
  data() {
    return {
      loading: false,
      edit: false,
      title: null,
      description: null,
      video: null,
      repoURL: null,
      uploading: false,
      progress: 0
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
          this.repoURL = this.$store.state.project.repoURL;
          this.video = this.$store.state.project.video;
        }
        this.loading = false;
      })
    })
  },
  methods: {
    submit(event) {
      this.$store.commit('removeFeedback');
      if(this.video && !getYoutubeVideoKey(this.video)) {
        this.$store.commit('setFeedbackError', 'project.invalidYoutubeVideo');
        return;
      }
      let form = this.$el.querySelector('form');
      let projectFormData = new FormData(form);
      this.uploading = true;
      const onUploadProgress = (status) => {
        this.progress = Math.round(status.loaded / status.total * 100);
      }
      this.$store.dispatch('submitProject', {projectFormData, edit: this.edit, onUploadProgress}).then(() => {
        this.uploading = false;
        this.edit = false;
      });
    },
    editProject() {
      this.edit = true;
    }
  }
}
</script>
