<template>
  <div class="card">
    <h3>
      <strong v-if="position">#{{position}}</strong>
      <router-link :to="{name: 'Project', params: {projectId: project.id}}">{{project.title}}</router-link>
    </h3>
    <router-link :to="{name: 'Project', params: {projectId: project.id}}" v-if="hasImage">
      <img :src="imageUrl" :alt="$t('project.thumb')">
    </router-link>
    <div class="info">
      <strong>{{project.votes.length}} {{$t(project.votes.length === 1 ? "vote" : "votes")}}</strong>
    </div>
    <div class="description" v-if="showDescription" v-html="project.description.replace(/\n/gi, '<br />')"></div>
    <button :class="{success: this.isVoted}" v-if="canVote" v-on:click="vote" :disabled="this.sendingVote || this.isVoted">{{$t(this.voteButtonLabel)}}</button>
    <button v-if="showDeliverable" v-on:click="downloadDeliverable">{{$t('project.download')}}</button>
    <button v-if="showRepo && project.repoURL" v-on:click="goToRepo">{{$t('viewRepo')}}</button>
    <button v-if="showEdit && isOwnProject" v-on:click="goToEdit">{{$t('project.edit')}}</button>
    <div class="video" v-if="showVideo && youtubeVideoCode">
      <YoutubeVideo :code="youtubeVideoCode"/>
    </div>
  </div>
</template>
<script>
import {getProjectImageUrl, getProjectDeliverableUrl} from '@/utils'
import YoutubeVideo from '@/components/YoutubeVideo';

export default {
  props: ['project', 'show-video', 'show-description', 'position', 'show-repo', 'show-edit', 'show-deliverable', 'image-scale'],
  data() {
    return {
      sendingVote: false
    }
  },
  components: {
    YoutubeVideo
  },
  computed: {
    imageUrl() {
      let imageScale = parseInt(this.imageScale) || 1;
      return getProjectImageUrl(this.project, {width: 480 * imageScale, height: 270 * imageScale});
    },
    youtubeVideoCode() {
      if(this.project && this.project.video && this.$store.state.limits && this.$store.state.limits.video) {
        let youtubeRegExpr = new RegExp(this.$store.state.limits.video.acceptedRegex);
        let match = this.project.video.match(youtubeRegExpr);
        if(match && match.length === 2) {
          return match[1];
        }
      }
    },
    hasImage() {
      if(this.project && this.project.files && this.project.files.length) {
        let images = this.project.files.filter((file) => {
          return file.kind === 'IMAGE';
        });
        return images.length > 0;
      }
    },
    voteButtonLabel() {
      return this.isVoted ? 'alreadyVoted' : (this.sendingVote ? 'waiting' : 'sendVote')
    },
    canVote() {
      return this.$store.state.user && this.$store.state.contest && this.$store.state.contest.state === 'VOTING';
    },
    isVoted() {
      return this.project.votes.filter(v => {
        return this.$store.state.user && v.userId === this.$store.state.user.uid;
      }).length > 0;
    },
    isOwnProject() {
      return this.$store.state.user && this.project && this.project.userId === this.$store.state.user.uid;
    }
  },
  methods: {
    vote() {
      this.sendingVote = true;
      this.$store.dispatch('voteProject', {projectId: this.project.id, contestId: this.$route.params.contestId}).then(() => {
        this.sendingVote = false;
      });
    },
    goToRepo() {
      location.href = this.project.repoURL;
    },
    goToEdit() {
      this.$router.push('/submit-entry?edit=true');
    },
    downloadDeliverable() {
      location.href = getProjectDeliverableUrl(this.project);
    }
  }
}
</script>
