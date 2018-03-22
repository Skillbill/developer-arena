<template>
  <div class="container">
    <Header/>
    <Feedback/>
    <router-view :key="$i18n.locale"/>
    <Footer/>
  </div>
</template>

<script>
import Header from '@/components/Header.vue'
import Footer from '@/components/Footer.vue'
import Feedback from '@/components/Feedback.vue'

export default {
  name: 'App',
  components: {
    Header,
    Feedback,
    Footer
  }
}
</script>
