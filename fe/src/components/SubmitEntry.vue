<template>
  <main class="submit">
    <section>
      <div v-show="!loading && !uploading">
        <div v-show="project" class="card">
          <p>{{$t('project.submitted')}}</p>
          <button v-on:click="viewProject">{{$t('project.viewYour')}}</button>
          <template v-if="project">
            <a v-if="project.hasPreview" class="button success" :href="previewUrl" target="_blank">{{$t('project.showPreview')}}</a>
          </template>
          <button v-if="!edit" v-on:click="editProject">{{$t('project.edit')}}</button>
        </div>
        <div v-show="!project || edit">
          <h2>{{$t(edit ? 'project.edit' : 'project.submit')}}</h2>
          <form action="#" method="post" class="submit-project" enctype="multipart/form-data" v-on:submit.prevent="submit">
            <fieldset>
              <label for="project-name">
                <span>{{$t('project.title')}} *</span>
              </label>
              <input type="text" name="title" id="project-name" required v-model="title" maxlength="50">
              <label for="project-description">
                <span>{{$t('project.description')}} *</span>
                <small class="hint">{{$t('project.descriptionHint')}}</small>
              </label>
              <textarea type="text" name="description" id="project-description" required rows="8" v-model="description"></textarea>
              <label for="project-video">
                <span>{{$t('project.video')}}</span>
              </label>
              <input type="url" name="video" id="project-video" placeholder="https://youtu.be/Lo2qQmj0_h4" v-model="video" maxlength="50">
              <label for="project-repository">
                <span>{{$t('project.repo')}}</span>
              </label>
              <input type="url" name="repoURL" id="project-repository" placeholder="https://github.com/yourname/yourproject" v-model="repoURL">
              <label for="project-thumbnail">
                {{$t('project.thumb')}}
                <small class="hint">{{$t('project.thumbHint')}}</small>
              </label>
              <input type="file" name="image" id="project-thumbnail" :accept="acceptedImageTypes">
              <label for="project-file">
                <span>{{$t('project.file')}} {{edit? '' : '*'}}</span>
              </label>
              <input type="file" name="deliverable" id="project-file" :required=!edit :accept="acceptedDeliverableTypes">
              <p class="text-align-right">* {{$t('project.requiredFields')}}</p>
            </fieldset>
            <button type="submit">{{$t('project.send')}}</button>
          </form>
        </div>
      </div>
      <div class="progress" v-if="loading"></div>
      <ProgressBar v-if="uploading" :progress="progress" :label="$t('project.uploading')"></ProgressBar>
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
      if(this.$store.state.user && this.$store.state.project && this.$store.state.project.userId === this.$store.state.user.uid) {
        return this.$store.state.project;
      }
    },
    acceptedDeliverableTypes() {
      if(this.$store.state.limits && this.$store.state.limits.deliverable &&
          this.$store.state.limits.deliverable.allowedTypes && this.$store.state.limits.deliverable.allowedTypes.length > 0) {
        return this.$store.state.limits.deliverable.allowedTypes.join(', ');
      }
    },
    acceptedImageTypes() {
      if(this.$store.state.limits && this.$store.state.limits.image &&
          this.$store.state.limits.image.allowedTypes && this.$store.state.limits.image.allowedTypes.length > 0) {
        return this.$store.state.limits.image.allowedTypes.join(', ');
      }
    },
    previewUrl() {
      return utils.getProjectPreviewUrl(this.project);
    }
  },
  created() {
    this.loading = true;
    this.$store.dispatch('loadLastContest').then(() => {
      this.$store.dispatch('loadLastUserProject').then(() => {
        if(this.project) {
          this.title = this.project.title;
          this.description = this.project.description;
          this.repoURL = this.project.repoURL;
          this.video = this.project.video;
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
        let file = form.querySelector(`[name="${field}"]`).files[0];
        if(file && file.name && file.size && file.type && this.$store.state.limits && this.$store.state.limits[field]) {
          if(this.$store.state.limits[field].allowedTypes && this.$store.state.limits[field].allowedTypes.length > 0 &&
              this.$store.state.limits[field].allowedTypes.indexOf(file.type) === -1) {
            this.$store.commit('setFeedbackError', {message: `project.${field}InvalidType`, args: {types: utils.getTypesString(this.$store.state.limits[field].allowedTypes)}});
            valid = false;
          } else if(this.$store.state.limits[field].maxSize > 0 && file.size > this.$store.state.limits[field].maxSize) {
            this.$store.commit('setFeedbackError', {message: `project.${field}InvalidSize`, args: {size: utils.getFileSizeString(this.$store.state.limits[field].maxSize)}});
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
        this.progress = 0;
        this.generatePreview();
      }).catch(() => {
        this.uploading = false;
        this.edit = false;
        this.progress = 0;
      });
    },
    editProject() {
      this.edit = true;
    },
    viewProject() {
      this.$router.push(`/contest/${this.project.contestId}/project/${this.project.id}`);
    },
    generatePreview() {
      if(this.project) {
        this.loading = true;
        this.$store.dispatch('generatePreview', {projectId: this.project.id, contestId: this.project.contestId}).then(() => {
          this.loading = false;
        });
      }
    }
  }
}
</script>
