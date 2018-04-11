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
              <label for="project-description">
                {{$t('project.description')}} *
                <small class="hint">{{$t('project.descriptionHint')}}</small>
              </label>
              <textarea type="text" name="description" id="project-description" required rows="8" v-model="description"></textarea>
              <label for="project-video">{{$t('project.video')}}</label>
              <input type="url" name="video" id="project-video" placeholder="https://youtu.be/Lo2qQmj0_h4" v-model="video" maxlength="50">
              <label for="project-repository">{{$t('project.repo')}}</label>
              <input type="url" name="repoURL" id="project-repository" placeholder="https://github.com/yourname/yourproject" v-model="repoURL">
              <label for="project-thumbnail">
                {{$t('project.thumb')}}
                <small class="hint">{{$t('project.thumbHint')}}</small>
              </label>
              <input type="file" name="image" id="project-thumbnail" :accept="acceptedImageTypes">
              <label for="project-file">{{$t('project.file')}} {{edit? '' : '*'}}</label>
              <input type="file" name="deliverable" id="project-file" :required=!edit :accept="acceptedDeliverableTypes">
              <p class="text-align-right">* {{$t('project.requiredFields')}}</p>
            </fieldset>
            <button type="submit">{{$t('project.send')}}</button>
          </form>
        </div>
        <div v-show="project && !edit" class="card">
          <p>{{$t('project.submitted')}}</p>
          <button v-on:click="editProject">{{$t('project.edit')}}</button>
          <button v-on:click="viewProject">{{$t('project.viewYour')}}</button>
        </div>
      </div>
      <div class="progress" v-if="loading"></div>
      <ProgressBar v-if="uploading" :progress=progress :label="$t('project.uploading')"></ProgressBar>
    </section>
  </main>
</template>

<script>
import ProgressBar from '@/components/ProgressBar'
import * as utils from '@/utils'

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
    },
    acceptedDeliverableTypes() {
      if(this.$store.state.limits && this.$store.state.limits.deliverable) {
        return this.$store.state.limits.deliverable.allowedTypes.join(', ');
      }
    },
    acceptedImageTypes() {
      if(this.$store.state.limits && this.$store.state.limits.image) {
        return this.$store.state.limits.image.allowedTypes.join(', ');
      }
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
    });
    if(this.$route.query.edit) {
      this.edit = true;
    }
  },
  methods: {
    submit(event) {
      this.$store.commit('removeFeedback');
      let form = this.$el.querySelector('form');
      let projectFormData = new FormData(form);

      if(this.video && this.$store.state.limits && this.$store.state.limits.video) {
        let youtubeRegExpr = new RegExp(this.$store.state.limits.video.acceptedRegex);
        let match = this.video.match(youtubeRegExpr);
        if(!match || match.length < 2) {
          this.$store.commit('setFeedbackError', 'project.invalidYoutubeVideo');
          form.querySelector('[name="video"]').focus();
          return;
        }
      }

      const isValidFile = (field) => {
        let valid = true;
        let file = projectFormData.get(field);
        if(file && file.name && file.size && file.type && this.$store.state.limits && this.$store.state.limits[field]) {
          if(this.$store.state.limits[field].allowedTypes.indexOf(file.type) === -1) {
            this.$store.commit('setFeedbackError', {message: `project.${field}InvalidType`, args: {types: utils.getTypesString(this.$store.state.limits[field].allowedTypes)}});
            valid = false;
          } else if(file.size > this.$store.state.limits[field].maxAllowedSize) {
            this.$store.commit('setFeedbackError', {message: `project.${field}InvalidSize`, args: {size: utils.getFileSizeString(this.$store.state.limits[field].maxAllowedSize)}});
            valid = false;
          }
        }
        if(!valid) {
          form.querySelector(`[name="${field}"]`).focus();
        }
        return valid;
      }

      if(!isValidFile('image') || !isValidFile('deliverable')) {
        return;
      }

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
    },
    viewProject() {
      this.$router.push(`/contest/${this.project.contestId}/project/${this.project.id}`);
    }
  }
}
</script>
