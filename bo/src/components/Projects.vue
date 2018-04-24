<template>
  <div>
    <div class="mb-3" v-if="contest">
      <h2>List of the projects of contest {{contest.title}}</h2>
    </div>
    <b-table :fields="fields" :items="projects" :current-page="currentPage" :per-page="perPage">
      <template slot="action" slot-scope="data">
        <b-button variant="outline-primary" size="sm" title="download project" @click.stop="download(data.item.id)">
          <span class="oi oi-data-transfer-download"></span> Download
        </b-button>
        <b-button variant="outline-primary" size="sm" title="see project in the public front-end" @click.stop="redirectToFE(data.item.id)">
          <span class="oi oi-eye"></span> See
        </b-button>
        <b-button v-if="!data.item.approved" variant="outline-secondary" size="sm" title="approve project" @click.stop="approve(data.item, true)">
          <span class="oi oi-check"></span> Approve
        </b-button>
        <b-button v-else variant="outline-secondary" size="sm" title="disapprove project" @click.stop="approve(data.item, false)">
          <span class="oi oi-x"></span> Disapprove
        </b-button>
      </template>
    </b-table>
    <b-pagination :total-rows="projects.length" :per-page="perPage" v-model="currentPage"/>
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
      projects: [],
      fields: [
        {
          key: 'id',
          label: '#',
          isRowHeader: true,
          sortable: true
        },
        'title',
        {
          key: 'submitted',
          formatter: this.formatDateTime,
          sortable: true
        },
        {
          key: 'updated',
          formatter: this.formatDateTime,
          sortable: true
        },
        {
          key: 'action',
          label: ''
        }
      ],
      currentPage: 1,
      perPage: 5
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
    },
    formatDateTime: function (date) {
      return (new Date(date)).toLocaleString(navigator.language)
    }
  },
  created: function () {
    api.getContestById(this.contestId).then(contest => {
      this.contest = contest
    })
    api.getProjectsByContest(this.contestId).then(projects => {
      this.projects = projects
    })
  }
}
</script>
