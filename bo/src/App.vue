<template>
  <div id="app">
    <Header/>
    <div class="container-flex mx-4">
      <Feedbacks/>
      <router-view></router-view>
    </div>
  </div>
</template>

<script>
import Header from '@/components/Header.vue'
import Feedbacks from '@/components/Feedbacks.vue'

export default {
  name: 'App',
  components: {
    Header,
    Feedbacks
  }
}
</script>
