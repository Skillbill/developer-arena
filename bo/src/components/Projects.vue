<template>
  <div>
    <div class="mb-3" v-if="contest">
      <h2>List of the projects of contest {{contest.title}}</h2>
    </div>
    <table class="table table-hover">
      <thead>
        <tr>
          <th scope="col">#</th>
          <th scope="col">Title</th>
          <th scope="col">Submitted</th>
          <th scope="col">Updated</th>
          <th scope="col"></th>
          <th scope="col"></th>
          <th scope="col"></th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="project in projects" v-bind:key="project.id">
          <th scope="row">{{project.id}}</th>
          <td>{{project.title}}</td>
          <td>{{project.submitted | formatDateTime}}</td>
          <td>{{project.updated | formatDateTime}}</td>
          <td>
            <button class="btn btn-outline-primary btn-sm" title="download project" @click="download(project.id)">
              <span class="oi oi-data-transfer-download"></span> Download
            </button>
          </td>
          <td>
            <button class="btn btn-outline-primary btn-sm" title="see project in the public front-end" @click="redirectToFE(project.id)">
              <span class="oi oi-eye"></span> See in front-end
            </button>
          </td>
          <td>
            <button v-if="!project.approved" class="btn btn-outline-secondary btn-sm" title="approve project" @click="approve(project, true)">
              <span class="oi oi-check"></span> Approve
            </button>
            <button v-else class="btn btn-outline-secondary btn-sm" title="disapprove project" @click="approve(project, false)">
              <span class="oi oi-x"></span> Disapprove
            </button>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
import api from '@/lib/api'

export default {
  name: 'Contests',
  props: {
    contestId: Number
  },
  data: function () {
    return {
      contest: null,
      projects: []
    }
  },
  methods: {
    download (projectId) {
      location.href = `${this.$config.serverAddress}/${this.$config.apiVersion}` +
        `/contest/${this.contest.id}/project/${projectId}/deliverable`
      // api.getProjectDeliverable(this.contest.id, projectId)
    },
    redirectToFE (projectId) {
      window.open(`${this.$config.frontEndAddress}/#/contest/${this.contest.id}/project/${projectId}`, '_blank')
    },
    approve (project, bool) {
      api.setProjectApproved(this.contest.id, project.id, bool).then(response => {
        if (response) {
          project.approved = bool
        }
      })
    }
  },
  created: function () {
    api.getContestById(this.contestId).then(contest => {
      this.contest = contest
    })
    api.getProjectsByContest(this.contestId).then(projects => {
      this.projects = projects
    })
  },
  filters: {
    formatDateTime: function (date) {
      return (new Date(date)).toLocaleString(navigator.language)
    }
  }
}
</script>
