<template>
  <main class="rules">
    <section>
      <h2>{{ $t('rules') }}</h2>
      <ol>
        <li v-for="(v, k) in rules" :key="k" v-md="v"></li>
      </ol>
    </section>
  </main>
</template>
<script>
export default {
  data() {
    return {
      rules: this.$i18n.t('siteRules')
    }
  },
  created() {
  },
  methods: {
  }
}
</script>
