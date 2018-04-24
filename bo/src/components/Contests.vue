<template>
  <div>
    <div class="row mb-3">
        <div class="col">
          <h2>List of the contests</h2>
        </div>
        <div class="float-right">
          <button class="btn btn-primary" @click="createContest">Create a new contest</button>
        </div>
    </div>
    <div class="table-responsive">
      <table class="table table-hover">
        <thead>
          <tr>
            <th scope="col">#</th>
            <th scope="col">Start date</th>
            <th scope="col">Title</th>
            <th scope="col">State</th>
            <th scope="col"></th>
            <th scope="col"></th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="contest in contestList" v-bind:key="contest.id">
            <th scope="row">{{contest.id}}</th>
            <td>{{contest.endPresentation | formatDate}}</td>
            <td>{{contest.title}}</td>
            <td>{{contest.state}}</td>
            <td>
              <button class="btn btn-outline-primary btn-sm" title="edit contest" @click.prevent="editContest(contest.id)">
                <span class="oi oi-pencil"></span> Edit
              </button>
            </td>
            <td>
              <button class="btn btn-outline-secondary btn-sm" @click="approveProjects(contest.id)">
                <span class="oi oi-list"></span> Projects approval
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
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
    },
    approveProjects (id) {
      router.push({
        name: 'projects',
        params: {
          contestId: id
        }
      })
    },
    createContest () {
      router.push({
        name: 'newContest'
      })
    }
  },
  filters: {
    formatDate: function (date) {
      return new Date(date).toLocaleDateString(navigator.language)
    }
  }
}
</script>
