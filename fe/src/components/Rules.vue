<template>
  <main class="rules">
    <section>
      <div class="contest">
        <h2>{{ $t('rules') }}</h2>
         <ol>
           <li v-for="(v, k) in rules" :key="k">{{ v }}</li>
         </ol>
      </div>
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
