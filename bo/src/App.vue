<template>
  <div id="app">
    <Header/>
    <div class="container">
      <main role="main" class="container" style="padding-top: 70px;">
        <router-view></router-view>
      </main>
    </div>
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
