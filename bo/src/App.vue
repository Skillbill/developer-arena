<template>
  <div id="app">
    <Header/>
    <main role="main" class="container" style="padding-top: 70px;">
      <router-view></router-view>
    </main>
  </div>
</template>

<script>
import Header from '@/components/Header.vue'

export default {
  name: 'App',
  components: {
    Header
  }
}
</script>
