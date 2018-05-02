<template>
  <div>
    <div class="d-flex row mb-3">
        <div class="mr-auto">
          <h2>List of the contests</h2>
        </div>
        <div>
          <b-button variant="primary" @click="createContest">Create a new contest</b-button>
        </div>
    </div>
    <b-table :fields="fields" :items="contestList">
      <template slot="action" slot-scope="data">
        <b-button variant="outline-primary" size="sm" title="edit contest" @click.stop="editContest(data.item.id)">
          <i class="fas fa-edit"></i> Edit
        </b-button>
        <b-button variant="outline-secondary" size="sm" @click.stop="approveProjects(data.item.id)">
          <i class="fas fa-list-ul"></i> Projects approval
        </b-button>
        <b-button variant="outline-danger" size="sm" @click.stop="toDelete = data.item" v-b-modal.modalDelete>
          <i class="fas fa-times"></i> Delete
        </b-button>
      </template>
    </b-table>
    <b-modal id="modalDelete" :title="toDelete ? `Delete contest ${toDelete.title}?` : ''" @ok="deleteContest"></b-modal>
  </div>
</template>

<script>
import api from '@/lib/api'
import router from '@/lib/router'
import feedback from '@/lib/feedback'

export default {
  name: 'Contests',
  data: function () {
    return {
      contestList: [],
      toDelete: null,
      fields: [
        {
          key: 'id',
          label: '#',
          isRowHeader: true
        },
        {
          key: 'endPresentation',
          label: 'Start date',
          formatter: this.formatDate
        },
        'title',
        'state',
        {
          key: 'action',
          label: ''
        }
      ]
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
    },
    deleteContest () {
      api.deleteContest(this.toDelete.id).then(response => {
        if (response) {
          feedback.contestDeleted()
          this.contestList = this.contestList.filter(e => e.id !== this.toDelete.id)
        }
      })
    },
    formatDate: function (date) {
      return new Date(date).toLocaleDateString(navigator.language)
    }
  }
}
</script>
