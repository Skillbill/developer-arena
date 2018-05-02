<template>
  <div id="app">
    <Header/>
    <main role="main" class="container">
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

<style scoped>
main {
  padding-top: 70px;
  height: 100vh;
}
</style>
