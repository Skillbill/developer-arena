<template>
  <div>
    <div class="mb-3" v-if="contest">
      <h2>List of the projects of contest {{contest.title}}</h2>
    </div>
    <div class="table-responsive mb-2">
      <table class="table">
        <thead>
          <tr>
            <th scope="col">#</th>
            <th scope="col">Title</th>
            <th scope="col">Submitted</th>
            <th scope="col">Updated</th>
            <th scope="col"></th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="project in currentProjects" v-bind:key="project.id" :class="{'table-danger': !project.approved}">
            <th scope="row">{{project.id}}</th>
            <td>{{project.title}}</td>
            <td>{{project.submitted | formatDateTime}}</td>
            <td>{{project.updated | formatDateTime}}</td>
            <td class="d-none d-xl-table-cell">
              <div class="d-flex flex-row justify-content-between">
                <button class="btn btn-outline-primary btn-sm" title="download project" @click="download(project.id)">
                  <span class="oi oi-data-transfer-download"></span> Download
                </button>
                <button class="btn btn-outline-primary btn-sm" title="see project in the public front-end" @click="redirectToFE(project.id)">
                  <span class="oi oi-eye"></span> See in front-end
                </button>
                <button v-if="!project.approved" class="btn btn-outline-secondary btn-sm" title="approve project" @click="approve(project, true)">
                  <span class="oi oi-check"></span> Approve
                </button>
                <button v-else class="btn btn-outline-secondary btn-sm" title="disapprove project" @click="approve(project, false)">
                  <span class="oi oi-x"></span> Disapprove
                </button>
              </div>
            </td>
            <td class="d-xl-none">
              <div class="dropdown">
                <button class="btn dropdown-toggle" id="opt-drop" data-toggle="dropdown"></button>
                <div class="dropdown-menu">
                  <button class="btn dropdown-item" title="download project" @click="download(project.id)">
                    <span class="oi oi-data-transfer-download"></span> Download
                  </button>
                  <button class="btn dropdown-item" title="see project in the public front-end" @click="redirectToFE(project.id)">
                    <span class="oi oi-eye"></span> See in front-end
                  </button>
                  <button v-if="!project.approved" class="btn dropdown-item" title="approve project" @click="approve(project, true)">
                    <span class="oi oi-check"></span> Approve
                  </button>
                  <button v-else class="btn dropdown-item" title="disapprove project" @click="approve(project, false)">
                    <span class="oi oi-x"></span> Disapprove
                  </button>
                </div>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    <Paginate
      :pageCount="pageNb"
      @pageChanged="showPage">
    </Paginate>
  </div>
</template>

<script>
import api from '@/lib/api'
import Paginate from '@/components/Paginate'

export default {
  name: 'Contests',
  components: {
    Paginate
  },
  props: {
    contestId: Number
  },
  data: function () {
    return {
      contest: null,
      projects: [],
      currentPage: 1
    }
  },
  computed: {
    pageNb: function () {
      return this.projects ? Math.floor(this.projects.length / 10) + 1 : 1
    },
    currentPageStart: function () {
      return (this.currentPage - 1) * 10
    },
    currentProjects: function () {
      return this.projects ? this.projects.slice(this.currentPageStart, this.currentPageStart + 10) : []
    }
  },
  methods: {
    showPage (page) {
      this.currentPage = page
    },
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
