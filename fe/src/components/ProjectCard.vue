<template>
  <div class="card">
    <h3>
      <strong v-if="rankPosition">#{{rankPosition}}</strong>
      <router-link :to="{name: 'Project', params: {projectId: project.id}}">{{project.title}}</router-link>
    </h3>
    <router-link :to="{name: 'Project', params: {projectId: project.id}}" v-if="showImage" tabindex="-1">
      <img :src="imageUrl" :alt="$t('project.thumb')">
      <strong v-if="showVotes && project.votes.length" class="votes">{{project.votes.length}} {{$t(project.votes.length === 1 ? "vote" : "votes")}}</strong>
    </router-link>
    <div v-else-if="showVotes && project.votes.length">
      <p class="text-align-right">
        <strong>{{project.votes.length}} {{$t(project.votes.length === 1 ? "vote" : "votes")}}</strong>
      </p>
    </div>
    <button :class="{success: isVoted, wait: sendingVote}" v-if="canVote" v-on:click="isVoted ? vote('delete') : vote('put')" :disabled="sendingVote">{{$t(voteButtonLabel)}}</button>
    <template v-if="isApproved">
      <a class="button success" v-if="showPreview && hasPreview" :href="previewUrl" target="_blank">{{$t('project.preview')}}</a>
      <a class="button" v-if="showDeliverable" download :href="deliverableUrl">{{$t('project.download')}}</a>
    </template>
    <button v-else-if="showPreview || showDeliverable" disabled>{{$t('project.needsApprove')}}</button>
    <a class="button" v-if="showRepo && project.repoURL" :href="project.repoURL" target="_blank">{{$t('viewRepo')}}</a>
    <router-link class="button" v-if="canEdit" to="/submit-entry?edit=true">{{$t('project.edit')}}</router-link>
    <div class="video" v-if="showVideo && youtubeVideoCode">
      <YoutubeVideo :code="youtubeVideoCode"/>
    </div>
    <div class="description" v-if="showDescription" v-md="project.description"></div>
  </div>
</template>
<script>
import {getProjectImageUrl, getProjectDeliverableUrl, getProjectFile, getProjectPreviewUrl} from '@/utils'
import YoutubeVideo from '@/components/YoutubeVideo';

export default {
  props: {
    project: {
      type: Object,
      required: true
    },
    imageScale: {
      type: Number,
      default: 1
    },
    rankPosition: Number,
    showVideo: Boolean,
    showDescription: Boolean,
    showRepo: Boolean,
    showEdit: Boolean,
    showDeliverable: Boolean,
    showDefaultImage: Boolean,
    showPreview: Boolean,
    showVotes: Boolean
  },
  data() {
    return {
      sendingVote: false,
      defaultImage: '/static/graphics/assets/default-thumbnail.svg'
    }
  },
  components: {
    YoutubeVideo
  },
  computed: {
    imageUrl() {
      if(this.hasImage) {
        return getProjectImageUrl(this.project, {width: 480 * this.imageScale, height: 270 * this.imageScale});
      } else if(this.showDefaultImage) {
        return this.defaultImage;
      }
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
      return !!getProjectFile(this.project, 'IMAGE');
    },
    showImage() {
      return this.hasImage || this.showDefaultImage;
    },
    voteButtonLabel() {
      return this.isVoted ? 'alreadyVoted' : (this.sendingVote ? 'waiting' : 'sendVote')
    },
    canVote() {
      return this.$store.state.contest && this.$store.state.contest.state === 'VOTING';
    },
    canEdit() {
      return this.showEdit && this.isOwn && this.$store.state.contest && this.$store.state.contest.state === 'APPLYING';
    },
    isOwn() {
      return this.$store.state.user && this.project && this.project.userId === this.$store.state.user.uid;
    },
    isVoted() {
      return this.project.votes.filter(v => {
        return this.$store.state.user && v.userId === this.$store.state.user.uid;
      }).length > 0;
    },
    isApproved() {
      return this.project && this.project.approved;
    },
    hasPreview() {
      return this.project && this.project.hasPreview;
    },
    deliverableUrl() {
      return getProjectDeliverableUrl(this.project);
    },
    previewUrl() {
      return getProjectPreviewUrl(this.project);
    }
  },
  methods: {
    vote(method) {
      if(!this.$store.state.user) {
        this.$router.push({
          path: '/sign-in',
          query: {
            redirect: this.$router.currentRoute.fullPath
          }
        });
        return;
      }
      this.sendingVote = true;
      this.$store.dispatch('voteProject', {method, projectId: this.project.id, contestId: this.$route.params.contestId}).then(() => {
        this.sendingVote = false;
      });
    }
  }
}
</script>
