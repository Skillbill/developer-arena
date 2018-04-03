<template>
  <ul>
    <li v-for='contest in contestList' v-bind:key="contest.id">
      {{contest.id}}
    </li>
  </ul>
</template>

<script>
import axios from 'axios'
import * as utils from '../utils'

export default {
  name: 'Contests',
  data: function () {
    return {
      contestList: []
    }
  },
  created: function () {
    var headers = {}
    axios({
      method: 'get',
      url: utils.getApiUrl('/contest'),
      headers
    }).then(response => {
      this.contestList = response.data.contests
    }).catch(e => {
      console.error(e)
    })
  }
}
</script>
