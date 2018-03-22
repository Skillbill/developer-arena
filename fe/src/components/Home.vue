<template>
  <main class="home">
    <section>
      <h2 class="main-info" v-if="contest">
        {{$t("contest")}} <span class="highlight">#{{contest.id}}</span>
        {{$t("contestStarts")}}
        <span class="alt">{{new Date(this.contest.endPresentation).toLocaleDateString(this.$i18n.locale)}}</span>
      </h2>
      <div class="contest" v-if="contest">
        <h2>{{contest.title}}</h2>
        {{contest.description}}
        <template v-if="contest.state === 'APPLYING'">
          <form action="#" class="submit-project">
            <button type="submit">{{ $t('applyContest') }}</button>
          </form>
        </template>
        <template v-else>
          <p>
            {{ $t('applyContestSince', { date: new Date(this.contest.endPresentation).toLocaleDateString(this.$i18n.locale) }) }}
          </p>
        </template>
      </div>
    </section>
  </main>
</template>

<script>
export default {
  computed: {
    contest () {
      return this.$store.state.contest;
    }
  },
  created () {
    this.$store.dispatch('loadLastContest');
  }
}
</script>
