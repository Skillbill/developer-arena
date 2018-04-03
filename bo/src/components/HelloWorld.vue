<template>
  <div class="hello">
    <h1>Last contest: {{ lastContestTitle }}</h1>
  </div>
</template>

<script>
import axios from 'axios'
import * as utils from '../utils'

export default {
  name: 'HelloWorld',
  data () {
    return {
      lastContestTitle: 'loading...'
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
      console.error(e)
    })
  }
}
</script>
