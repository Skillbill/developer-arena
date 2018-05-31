<template>
  <div class="container">
    <Header/>
    <Feedback/>
    <router-view :key="`${$i18n.locale}:${$route.fullPath}`"/>
    <Footer/>
    <CookiePolicy/>
  </div>
</template>

<script>
import Header from '@/components/Header.vue'
import Footer from '@/components/Footer.vue'
import Feedback from '@/components/Feedback.vue'
import CookiePolicy from '@/components/CookiePolicy.vue'

export default {
  components: {
    Header,
    Feedback,
    Footer,
    CookiePolicy
  }
}
</script>
