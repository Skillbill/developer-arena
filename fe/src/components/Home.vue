<template>
  <main class="home">
    <section>
      <h2 class="main-info" v-if="contest">
        {{$t("contestBanner.contest")}} <strong>#{{contest.id}}</strong>
        <template v-if="contest.state === 'PRESENTATION'">
          {{$t("contestBanner.presentation")}}
          <Countdown :date="this.contest.endPresentation"></Countdown>
        </template>
        <template v-if="contest.state === 'APPLYING'">
          {{$t("contestBanner.applying")}}
        </template>
        <template v-if="contest.state === 'VOTING'">
          {{$t("contestBanner.voting")}}
        </template>
        <template v-if="contest.state === 'CLOSED'">
          {{$t("contestBanner.closed")}}
        </template>
        <template v-if="contest.state === 'PAST'">
          {{$t("contestBanner.past")}}
        </template>
      </h2>
      <div class="contest" v-if="contest">
        <h2>{{contest.title}}</h2>
        {{contest.description}}
        <template v-if="contest.state === 'APPLYING'">
          <form action="#" class="submit-project" v-on:submit.prevent="applyContest">
            <button type="submit">{{ $t('applyContest') }}</button>
          </form>
        </template>
      </div>
    </section>
  </main>
</template>

<script>
import Countdown from '@/components/Countdown'

export default {
  computed: {
    contest () {
      return this.$store.state.contest;
    }
  },
  created () {
    this.$store.dispatch('loadLastContest');
  },
  components: {
    Countdown
  },
  methods: {
    applyContest() {
      this.$router.push('submit-entry');
    }
  }
}
</script>
