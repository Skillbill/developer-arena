<template>
  <div class="card">
    <h3>
      <router-link :to="{name: 'Project', params: {projectId: project.id}}">{{project.title}}</router-link>
    </h3>
    <router-link :to="{name: 'Project', params: {projectId: project.id}}" v-if="hasImage">
      <img :src="imageUrl" alt="Project thumbnail">
    </router-link>
    <div class="info">
      <strong>{{project.votes.length}} {{$t(project.votes.length === 1 ? "vote" : "votes")}}</strong>
    </div>
    <div class="description" v-if="showDescription" v-html="project.description.replace(/\n/gi, '<br />')"></div>
    <button :class="{success: this.isVoted}" v-if="canVote" v-on:click="vote" :disabled="this.sendingVote || this.isVoted">{{$t(this.label)}}</button>
    <div class="video" v-if="showVideo && youtubeVideoCode">
      <YoutubeVideo :code="youtubeVideoCode"/>
    </div>
  </div>
</template>
<script>
import {getProjectImageUrl} from '@/utils'
import YoutubeVideo from '@/components/YoutubeVideo';

export default {
  props: ['project', 'show-video', 'show-description'],
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
      return getProjectImageUrl(this.project);
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
    label() {
      return this.isVoted ? 'alreadyVoted' : (this.sendingVote ? 'waiting' : 'sendVote')
    },
    canVote() {
      return this.$store.state.user && this.$store.state.contest && this.$store.state.contest.state === 'VOTING';
    },
    isVoted() {
      return this.project.votes.filter(v => {
        return this.$store.state.user && v.userId === this.$store.state.user.uid;
      }).length > 0;
    }
  },
  methods: {
    vote() {
      this.sendingVote = true;
      this.$store.dispatch('voteProject', {projectId: this.project.id, contestId: this.$route.params.contestId}).then(() => {
        this.sendingVote = false;
      });
    }
  }
}
</script>
