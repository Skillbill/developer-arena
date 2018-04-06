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
    <button>{{$t('sendVote')}}</button>
  </div>
</template>
<script>
import {getProjectImageUrl} from '@/utils'

export default {
  props: ['project'],
  computed: {
    imageUrl() {
      return getProjectImageUrl(this.project);
    }
  }
}
</script>
