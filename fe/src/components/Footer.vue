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
          <a href="mailto:developer-arena@skillbill.it?subject=[Developer Arena]">CIAO developer-arena@skillbill.it</a>
        </li>
      </ul>
    </div>
    <div class="footer-links">
      <h4>{{$t('footer.info')}}</h4>
      <ul>
        <li>
          <router-link to="/legal-notice">{{$t('footer.legalNotice')}}</router-link>
        </li>
        <li>
          <router-link to="/cookie-policy">{{$t('footer.cookiePolicy')}}</router-link>
        </li>
      </ul>
    </div>
    <div class="footer-info">
      <p>{{$t("siteName")}} <br> &copy; <a href="http://www.skillbill.it/">Skillbill</a> {{new Date().getFullYear()}}</p>
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
