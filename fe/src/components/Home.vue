<template>
  <div class="contest" v-if="contest">
    <h1>{{ $t("contest") }}</h1>
    <ul>
      <li>id {{ contest.id }}</li>
      <li>title {{ contest.title }}</li>
      <li>description {{ contest.description }}</li>
      <li>end-presentation {{ contest.endPresentation }}</li>
      <li>endApplying {{ contest.endApplying }}</li>
      <li>endVoting {{ contest.endVoting }}</li>
      <li>state {{ contest.state }}</li>
    </ul>
    <template v-if="contest.state === 'APPLYING'">
      <router-link to="/submit-entry">{{ $t('applyContest') }}</router-link>
    </template>
    <template v-else>
      {{ $t('applyContestSince', { date: new Date(this.contest.endPresentation).toLocaleDateString(this.$i18n.locale) }) }}
    </template>
  </div>
</template>

<script>
var axios = require('axios')

export default {
  name: 'Home',
  data: function () {
    return {
      contest: {},
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
