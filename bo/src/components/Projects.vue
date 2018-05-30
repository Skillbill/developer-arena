<template>
  <main class="container mt-3">
    <div class="mb-3" v-if="contest">
      <h2>List of the projects of contest {{contest.i18n.en.title}}</h2>
    </div>
    <div class="m-3">
      <b-form inline>
        <label class="mr-sm-2" for="perPageSelect">Per page:</label>
        <b-form-select class="mb-2 mr-sm-3 mb-sm-0"
                      :options="pageOptions"
                      v-model="perPage"
                      id="perPageSelect">
        </b-form-select>
        <b-form-checkbox class="mb-2 mr-sm-2 mb-sm-0" v-model="filterApproved">
          Filter already approved projects
        </b-form-checkbox>
      </b-form>
    </div>
    <b-table striped show-empty
              id="projectTable"
              :fields="fields"
              :items="filteredProjects"
              :current-page="currentPage"
              :per-page="perPage"
    >
      <template slot="userId" slot-scope="data">
        <b-link v-if="userMap && userMap.get(data.value)" :to="`/user/${data.value}`">{{getUserDisplay(userMap.get(data.value))}}</b-link>
      </template>
      <template slot="title" slot-scope="data">
        <a :href="getLinkToFE(data.item.id)" target="_blank">{{data.value}}</a>
      </template>
      <template slot="approved" slot-scope="data">
        <div class="d-flex justify-content-center">
          <i v-if="data.value" class="fas fa-check"></i>
          <i v-else class="fas fa-ban"></i>
        </div>
      </template>
      <template slot="hasPreview" slot-scope="data">
        <a v-if="data.value" :href="getLinkToPreview(data.item.id)" target="_blank">Running</a>
        <span v-else>Off</span>
      </template>
      <template slot="action" slot-scope="data">
        <div class="d-flex justify-content-between">
          <b-dropdown class="ml-2" variant="link" size="sm" no-caret right>
            <template slot="button-content">
              <i class="fas fa-ellipsis-v"></i>
            </template>
            <b-dd-item-btn title="download project" @click.stop="download(data.item)">
              <i class="fas fa-download"></i> Download
            </b-dd-item-btn>
            <b-dd-item-btn v-if="data.item.approved" title="disapprove the project" @click.stop="disapprove(data.item)">
              <i class="fas fa-ban"></i> Disapprove
            </b-dd-item-btn>
            <b-dd-item-btn v-else title="approve the project" @click.stop="approve(data.item)">
              <i class="fas fa-check"></i> Approve
            </b-dd-item-btn>
            <b-dd-item-btn v-if="data.item.hasPreview" title="kill the preview" @click.stop="deletePreview(data.item)">
              <i class="fas fa-skull"></i> Kill preview
            </b-dd-item-btn>
            <b-dd-item-btn v-else title="launch the preview" @click.stop="createPreview(data.item)">
              <i class="fas fa-bolt"></i> Launch preview
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
          key: 'votes',
          formatter: (value) => value.length,
          sortable: true,
          tdClass: 'min'
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
          key: 'approved',
          label: 'Approval',
          tdClass: 'min'
        },
        {
          key: 'hasPreview',
          label: 'Preview',
          tdClass: 'min'
        },
        {
          key: 'action',
          label: '',
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
    download (project) {
      let deliverableInfo = project.files.find(elem => elem.kind === 'DELIVERABLE')
      let ts = new Date(deliverableInfo.mtime).getTime()
      location.href = `${this.$config.serverAddress}/${this.$config.apiVersion}` +
        `/contest/${this.contest.id}/project/${project.id}/deliverable?ts=${ts}`
      // api.getProjectDeliverable(this.contest.id, projectId)
    },
    getLinkToFE (projectId) {
      return `${this.$config.frontEndAddress}/#/contest/${this.contest.id}/project/${projectId}`
    },
    getLinkToPreview (projectId) {
      return `${this.$config.serverAddress}/${this.$config.apiVersion}/preview/${this.contest.id}/${projectId}`
    },
    approve (project) {
      api.setProjectApproved(this.contest.id, project.id, true).then(response => {
        if (response) {
          project.approved = true
        }
      })
    },
    disapprove (project) {
      api.setProjectApproved(this.contest.id, project.id, false).then(response => {
        if (response) {
          project.approved = false
        }
      })
    },
    createPreview (project) {
      api.createProjectPreview(this.contest.id, project.id).then(response => {
        if (!response) {
          return null
        }
        project.hasPreview = true
        feedback.projectPreviewCreated()
      })
    },
    deletePreview (project) {
      api.deleteProjectPreview(this.contest.id, project.id).then(response => {
        if (!response) {
          return null
        }
        project.hasPreview = false
        feedback.projectPreviewDeleted()
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
