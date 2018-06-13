<template>
  <div>
     <div class="card judge">
      <div class="judge-photo">
         <img :src="imageUrl" :alt="judge.name" />
      </div>
      <div class="judge judge-summary">
         <h3>{{judge.name}}</h3>
         <div v-if="judge.bio" v-md="judge.bio">
      </div>
         <div class="judge-attr" v-if="judge.email">
           {{emailMasked}}
         </div>
         <div class="judge-attr" v-if="judge.twitter">
           <a :href="twitterUrl" target="_blank">{{twitterHandle}}</a>
         </div>
         <div class="judge-attr" v-if="judge.site">
           <a :href="judge.site" target="_blank">{{site}}</a>
         </div>
      </div>
     </div>
  </div>
</template>
<script>

import {getJudgeImageUrl} from '@/utils'

export default {
  props: {
    judge: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      defaultImage: '/static/graphics/assets/user.svg',
      imageWidth: 200,
      imageHeight: 200
    }
  },
  computed: {
    imageUrl() {
      if(this.hasImage) {
        return getJudgeImageUrl(this.judge, { width: this.imageWidth, height: this.imageHeight });
      } else {
        return this.defaultImage;
      }
    },
    emailMasked() {
      return this.judge.email ? this.judge.email.replace('@', ' [at] ') : undefined
    },
    twitterUrl() {
      return `https://twitter.com/${this.judge.twitter}`;
    },
    twitterHandle() {
      if (this.judge.twitter) {
        return (this.judge.twitter[0] === '@' ? '' : '@') + this.judge.twitter
      }
    },
    site() {
      if (this.judge.site) {
        return this.judge.site.replace(/^https?:\/\//, '')
      }
    },
    hasImage() {
      return !!this.judge.image;
    }
  },
  methods: {
  }
}
</script>
