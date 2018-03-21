<template>
  <div class="container">
    <Header/>
    <img v-on:click="changeLanguage('en')" src="./assets/en.png" class="lang-flag">
    <img v-on:click="changeLanguage('it')" src="./assets/it.png" class="lang-flag">
    <router-view :key="$i18n.locale"/>
    <Footer/>
  </div>
</template>

<script>
import Header from '@/components/Header.vue'
import Footer from '@/components/Footer.vue'

export default {
  name: 'App',
  methods: {
    changeLanguage: function (lang) {
      this.$i18n.locale = lang
    }
  },
  components: {
    Header,
    Footer
  }
}
</script>
