<template>
  <div id="app">
    <Header v-if="!hideHeader"/>
    <router-view></router-view>
  </div>
</template>

<script>
import Header from '@/components/Header.vue'

export default {
  name: 'App',
  components: {
    Header
  },
  computed: {
    hideHeader: function () {
      return this.$route.name ? this.$route.name.startsWith('signIn') : true
    }
  }
}
</script>
