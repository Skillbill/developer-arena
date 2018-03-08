<template>
  <div id="app">
    <img v-on:click="changeLanguage('en')" src="./assets/en.png" class="lang-flag">
    <img v-on:click="changeLanguage('it')" src="./assets/it.png" class="lang-flag">
    <router-view/>
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

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
.lang-flag {
  cursor: pointer;
}
</style>
