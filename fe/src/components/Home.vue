<template>
  <div class="contest">
    <h1>{{ $t("contest") }}</h1>
    <ul>
      <li>id {{ contest.id }}</li>
      <li>title {{ contest.title }}</li>
      <li>description {{ contest.description }}</li>
      <li>endPresentation {{ contest.endPresentation }}</li>
      <li>endApplying {{ contest.endApplying }}</li>
      <li>endVoting {{ contest.endVoting }}</li>
      <li>state {{ contest.state }}</li>
    </ul>
  </div>
</template>

<script>
var axios = require('axios')

export default {
  name: 'Home',
  data: function () {
    return {
      'contest': {},
      errors: []
    }
  },
  created: function () {
    axios({
      method: 'get',
      url: configuration.serverHost + configuration.apiVersion + '/contest/last',
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

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h1 {
  font-weight: normal;
}
ul {
  list-style-type: none;
  padding: 0;
}
a {
  color: #42b983;
}
</style>
