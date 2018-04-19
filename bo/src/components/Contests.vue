<template>
  <div>
    <h2>List of the contests</h2>
    <table class="table table-hover">
      <thead>
        <tr>
          <th scope="col">#</th>
          <th scope="col">Start date</th>
          <th scope="col">English title</th>
          <th scope="col">State</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="contest in contestList" v-bind:key="contest.id" @click="editContest(contest.id)">
          <th scope="row">{{contest.id}}</th>
          <td>{{contest.endPresentation | formatDate}}</td>
          <td>TODO: add title</td>
          <td>{{contest.state}}</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
import api from '@/lib/api'
import router from '@/lib/router'

export default {
  name: 'Contests',
  data: function () {
    return {
      contestList: []
    }
  },
  created: function () {
    api.getContests().then(contestList => {
      this.contestList = contestList
    }).catch(e => {
      this.$log.error(e)
    })
  },
  methods: {
    editContest (id) {
      router.push({
        name: 'editContest',
        params: {
          contestId: id
        }
      })
    }
  },
  filters: {
    formatDate: function (date) {
      return date.substring(0, 10)
    }
  }
}
</script>
