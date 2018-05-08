<template>
  <b-card class="mb-2"
          header=" "
          :border-variant="stateVariant"
          :header-border-variant="stateVariant"
          :header-bg-variant="stateVariant">
    <h4 class="card-title">
      <i :class="`fas fa-${stateIconName}`" :title="contest.state"></i> {{contest.title}}
    </h4>
    <h6 class="card-subtitle mb-2 text-muted">
      #{{contest.id}}
    </h6>
    <ul>
      <li>End presentation: {{contest.endPresentation | formatDate}}</li>
      <li>End applying: {{contest.endApplying | formatDate}}</li>
      <li>End voting: {{contest.endVoting | formatDate}}</li>
    </ul>
    <div class="row mx-2">
      <b-button variant="outline-primary" size="sm" title="edit contest" @click.stop="editContest(contest.id)">
        <i class="fas fa-edit"></i> Edit
      </b-button>
      <b-button v-if="contest.state === 'DRAFT'" class="ml-2" variant="outline-danger" size="sm" @click.stop="$emit('deleteContest',contest)">
        <i class="fas fa-times"></i> Delete
      </b-button>
      <b-button class="ml-auto"
                v-if="contest.state !== 'DRAFT' && contest.state !== 'PRESENTATION'"
                variant="outline-secondary" size="sm"
                @click.stop="approveProjects(contest.id)">
        <i class="fas fa-list-ul"></i> Manage projects
      </b-button>
    </div>
  </b-card>
</template>

<script>
import router from '@/lib/router'

export default {
  name: 'ContestCard',
  props: [
    'contest'
  ],
  computed: {
    stateVariant: function () {
      switch (this.contest.state) {
        case 'PAST':
          return 'dark'
        case 'CLOSED':
          return 'danger'
        case 'PRESENTATION':
        case 'APPLYING':
        case 'VOTING':
          return 'success'
        case 'DRAFT':
          return 'warning'
        default:
          return 'light'
      }
    },
    stateIconName: function () {
      switch (this.contest.state) {
        case 'PAST':
          return 'history'
        case 'CLOSED':
          return 'times-circle'
        case 'PRESENTATION':
          return 'newspaper'
        case 'APPLYING':
          return 'file-medical'
        case 'VOTING':
          return 'thumbs-up'
        case 'DRAFT':
          return 'edit'
        default:
          return 'light'
      }
    }
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
    }
  },
  filters: {
    formatDate: function (date) {
      return new Date(date).toLocaleDateString(navigator.language)
    }
  }
}
</script>
