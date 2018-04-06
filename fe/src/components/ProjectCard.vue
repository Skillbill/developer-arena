<template>
  <div class="card">
    <h3>
      <router-link :to="{name: 'Project', params: {projectId: project.id}}">{{project.title}}</router-link>
    </h3>
    <router-link :to="{name: 'Project', params: {projectId: project.id}}">
      <img :src="imageUrl" alt="Project thumbnail">
    </router-link>
    <div class="info">
      <strong>{{project.votes.length}} {{$t(project.votes.length === 1 ? "vote" : "votes")}}</strong>
    </div>
    <div class="description" v-if="showDescription" v-html="project.description.replace(/\n/gi, '<br />')"></div>
    <button>{{$t('sendVote')}}</button>
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
    }
  }
}
</script>
