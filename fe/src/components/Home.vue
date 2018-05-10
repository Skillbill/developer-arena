<template>
  <main class="home">
    <section>
      <div v-if="loading" class="progress" key="progress"></div>
      <template v-else>
        <h2 class="main-info" v-if="contest">
          {{$t("contestBanner.contest")}} <strong>#{{contest.id}}</strong>
          <template v-if="contest.state === 'PRESENTATION'">
            {{$t("contestBanner.presentation")}}
            <Countdown :date="this.contest.endPresentation" :onEnd="onEndCountdown"></Countdown>
          </template>
          <template v-if="contest.state === 'APPLYING'">
            {{$t("contestBanner.applying")}}
            <Countdown :date="this.contest.endApplying" :onEnd="onEndCountdown"></Countdown>
            {{$t("contestBanner.applyingRemaining")}}
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
          <h2 v-md:strip.p="contest.title"></h2>
          <div v-if="contest.state === 'PAST' && contest.descriptionPast" v-md="contest.descriptionPast" class="highlight"></div>
          <div v-if="contest.state === 'CLOSED' && contest.descriptionClosed" v-md="contest.descriptionClosed" class="highlight"></div>
          <div v-md="contest.description"></div>
          <hr>
          <div v-md="contest.rules"></div>
          <template v-if="contest.state === 'APPLYING'">
            <form action="#" class="submit-project sticky-bottom" v-on:submit.prevent="applyContest">
              <button type="submit">{{ $t('applyContest') }}</button>
            </form>
          </template>
        </div>
      </template>
    </section>
  </main>
</template>

<script>
import Countdown from '@/components/Countdown'

export default {
  data() {
    return {
      loading: false
    }
  },
  computed: {
    contest () {
      return this.$store.state.contest;
    }
  },
  created () {
    this.loadContest();
  },
  components: {
    Countdown
  },
  methods: {
    applyContest() {
      this.$router.push('/submit-entry');
    },
    onEndCountdown() {
      this.loadContest();
    },
    loadContest() {
      this.loading = true;
      this.$store.dispatch('loadLastContest').then(() => {
        this.loading = false;
      });
    }
  }
}
</script>
