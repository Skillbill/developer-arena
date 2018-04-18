<template>
  <footer role="contentinfo">
    <div class="footer-links">
      <h4>{{$t('footer.languages')}}</h4>
      <ul>
        <li>
          <a href="#" v-on:click.prevent="changeLanguage('it')">{{$t('footer.it')}}</a>
        </li>
        <li>
          <a href="#" v-on:click.prevent="changeLanguage('en')">{{$t('footer.en')}}</a>
        </li>
      </ul>
    </div>
    <div class="footer-links">
      <h4>{{$t('contacts')}}</h4>
      <ul>
        <li>
          <a href="mailto:sdacontest@skillbill.it?subject=[SDA Contest]">sdacontest@skillbill.it</a>
        </li>
      </ul>
    </div>
    <div class="footer-info">
      <p>{{$t("siteFullName")}} <br> &copy; <a href="http://www.skillbill.it/">Skillbill</a> {{new Date().getFullYear()}}</p>
      <img class="logo" src="/static/graphics/assets/logo-skillbill.png" alt="Logo Skillbill">
    </div>
  </footer>
</template>

<script>
export default {
  methods: {
    changeLanguage: function (lang, e) {
      this.$store.dispatch('chooseLanguage', lang);
    }
  }
}
</script>
