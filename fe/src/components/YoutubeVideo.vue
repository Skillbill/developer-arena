<template>
  <div class="youtube-video-container">
    <iframe :src="src" frameborder="0" allow="autoplay; encrypted-media" allowfullscreen></iframe>
  </div>
</template>
<script>
export default {
  props: ['code'],
  computed: {
    src() {
      return `https://www.youtube.com/embed/${this.code}`;
    }
  }
}
</script>
