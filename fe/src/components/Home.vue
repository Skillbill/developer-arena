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
var axios = require('axios')

export default {
  name: 'Home',
  data: function () {
    return {
      contest: null,
      errors: []
    }
  },
  created: function () {
    axios({
      method: 'get',
      url: configuration.serverAddress + '/' + configuration.apiVersion + '/contest/last',
      headers: {'Accept-Language': this.$i18n.locale}
    })
      .then(response => {
        this.contest = response.data.contest
      })
      .catch(e => {
        this.errors.push(e)
      })
  }
}
</script>
