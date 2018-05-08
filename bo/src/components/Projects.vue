<template>
  <main class="container mt-3">
    <div class="mb-3" v-if="contest">
      <h2>List of the projects of contest {{contest.i18n.en.title}}</h2>
    </div>
    <b-row class="m-2">
      <div class="col-auto my-2">Per page:</div>
      <div class="col-auto pl-0">
        <b-form-select :options="pageOptions" v-model="perPage" />
      </div>
      <div class="col-auto">
        <b-input-group class="my-2">
          <b-form-checkbox id="checkbox1" v-model="filterApproved">
            Filter already approved projects
          </b-form-checkbox>
        </b-input-group>
      </div>
    </b-row>
    <b-table striped show-empty
              id="projectTable"
              :fields="fields"
              :items="filteredProjects"
              :current-page="currentPage"
              :per-page="perPage"
    >
      <template slot="userId" slot-scope="data">
        <span v-if="userMap">{{getUserDisplay(userMap.get(data.value))}}</span>
      </template>
      <template slot="action" slot-scope="data">
        <div class="d-flex justify-content-between">
          <b-button v-if="!data.item.approved" variant="outline-success" size="sm" title="approve project" @click.stop="approve(data.item, true)">
            <i class="fas fa-check"></i> Approve
          </b-button>
          <b-button v-else variant="outline-danger" size="sm" title="disapprove project" @click.stop="approve(data.item, false)">
            <i class="fas fa-times"></i> Disapprove
          </b-button>
          <b-dropdown class="ml-2" variant="link" size="sm" no-caret right>
            <template slot="button-content">
              <i class="fas fa-ellipsis-v"></i>
            </template>
            <b-dd-item-btn title="download project" @click.stop="download(data.item.id)">
              <i class="fas fa-download"></i> Download
            </b-dd-item-btn>
            <b-dd-item-btn title="see project in the public front-end" @click.stop="redirectToFE(data.item.id)">
              <i class="fas fa-eye"></i> See
            </b-dd-item-btn>
            <b-dd-item-btn title="delete the project" @click.stop="askDeleteConfirmation(data.item)">
              <i class="fas fa-times"></i> Delete
            </b-dd-item-btn>
          </b-dropdown>
        </div>
      </template>
    </b-table>
    <b-pagination :total-rows="filteredProjects.length" :per-page="perPage" v-model="currentPage"/>
    <b-modal v-if="toDelete" v-model="showDeleteModal" ref="modalDelete" :title="`Delete project ${toDelete.title}?`" @ok="deleteProject(toDelete.id)"></b-modal>
  </main>
</template>

<script>
import api from '@/lib/api'
import feedback from '@/lib/feedback'
import * as utils from '@/lib/utils'

export default {
  name: 'Contests',
  props: {
    contestId: Number
  },
  data: function () {
    return {
      contest: null,
      projects: [],
      userMap: null,
      toDelete: null,
      showDeleteModal: false,
      filterApproved: false,
      fields: [
        {
          key: 'id',
          label: '#',
          isRowHeader: true,
          sortable: true,
          tdClass: 'min'
        },
        {
          key: 'title',
          tdClass: 'protect'
        },
        {
          key: 'userId',
          label: 'By',
          tdClass: 'min'
        },
        {
          key: 'submitted',
          formatter: this.formatDateTime,
          sortable: true,
          tdClass: 'min'
        },
        {
          key: 'updated',
          formatter: this.formatDateTime,
          sortable: true,
          tdClass: 'min'
        },
        {
          key: 'action',
          label: 'Action',
          tdClass: ['actions', 'min']
        }
      ],
      currentPage: 1,
      perPage: 10,
      pageOptions: [5, 10, 15]
    }
  },
  computed: {
    filteredProjects: function () {
      let result = this.projects
      if (this.filterApproved) {
        result = result.filter(project => !project.approved)
      }
      return result
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
    deleteProject (projectId) {
      api.deleteProject(this.contest.id, projectId).then(response => {
        if (response) {
          feedback.projectDeleted()
          this.projects = this.projects.filter(e => e.id !== projectId)
        }
      })
    },
    askDeleteConfirmation (toDelete) {
      this.toDelete = toDelete
      this.showDeleteModal = true
    },
    formatDateTime: function (date) {
      return (new Date(date)).toLocaleString(navigator.language)
    },
    getUserDisplay (user) {
      return utils.getUserDisplay(user)
    }
  },
  created: function () {
    api.getContestById(this.contestId).then(contest => {
      this.contest = contest
    })
    api.getProjectsByContest(this.contestId).then(projects => {
      this.projects = projects
      let userIds = projects.map(p => p.userId)
      api.getUsersById(userIds).then(users => {
        let userMap = new Map()
        for (let i = 0; i < userIds.length; i++) {
          userMap.set(userIds[i], users[i])
        }
        this.userMap = userMap
      })
    })
  }
}
</script>

<style>
@media (max-width: 767.98px) {
  .container {
    width: auto
  }
}

#projectTable {
  width: inherit !important;
}
#projectTable td, th {
  width: auto;
}
#projectTable td.min,th.min {
  width: 1px !important;
}
@media (min-width: 992px) {
  #projectTable td.min,th.min {
    white-space: nowrap !important;
  }
}
#projectTable th.protect,td.protect {
  min-width: 10rem
}
#projectTable td.actions {
   padding: 0.5rem;
}
.btn-link {
  color: black;
}
</style>
