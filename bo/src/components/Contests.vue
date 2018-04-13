<template>
  <div>
    <h2>Last contest: {{ lastContestTitle }}</h2>
    <h2>List of other contest</h2>
    <ul>
      <li v-for='contest in contestList' v-bind:key="contest.id">
        {{contest.id}}
      </li>
    </ul>
  </div>
</template>

<script>
import axios from 'axios'
import * as utils from '../utils'

export default {
  name: 'Contests',
  data: function () {
    return {
      lastContestTitle: '',
      contestList: []
    }
  },
  created: function () {
    var headers = {}
    axios({
      method: 'get',
      url: utils.getApiUrl('/contest/last'),
      headers
    }).then(response => {
      this.lastContestTitle = response.data.contest.title
    }).catch(e => {
      this.$log.error(e)
    })
    axios({
      method: 'get',
      url: utils.getApiUrl('/contest'),
      headers
    }).then(response => {
      this.contestList = response.data.contests
    }).catch(e => {
      this.$log.error(e)
    })
  }
}
</script>
