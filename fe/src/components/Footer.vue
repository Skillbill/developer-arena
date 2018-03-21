<template>
  <footer role="contentinfo">
    <div class="footer-links">
      <h4>Languages</h4>
      <ul>
        <li>
          <a href="#" v-on:click="changeLanguage('it')">Italiano</a>
        </li>
        <li>
          <a href="#" v-on:click="changeLanguage('en')">English</a>
        </li>
      </ul>
    </div>
    <div class="footer-info">
      <p>Skillbill Developer Arena Contest <br> &copy; <a href="http://www.skillbill.it/">Skillbill</a> 2018</p>
      <img class="logo" src="assets/logo-skillbill.png" alt="Logo Skillbill">
    </div>
  </footer>
</template>

<script>
export default {
  methods: {
    changeLanguage: function (lang) {
      this.$i18n.locale = lang
    }
  }
}
</script>
