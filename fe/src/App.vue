<template>
  <div id="app">
    <img v-on:click="changeLanguage('en')" src="./assets/en.png" class="lang-flag">
    <img v-on:click="changeLanguage('it')" src="./assets/it.png" class="lang-flag">
    <router-view :key="$i18n.locale"/>
  </div>
</template>

<script>
export default {
  name: 'App',
  methods: {
    changeLanguage: function (lang) {
      this.$i18n.locale = lang
    }
  }
}
</script>
