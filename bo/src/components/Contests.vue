<template>
  <main class="container mt-3">
    <div class="row mb-2">
        <div class="mr-auto">
          <h2>List of the contests</h2>
        </div>
        <div>
          <b-button variant="primary" @click="createContest">Create a new contest</b-button>
        </div>
    </div>
    <ContestCard v-for="contest in contestList" :key="contest.id"
                  :contest="contest"
                  @deleteContest="askDeleteConfirmation"/>
    <b-modal v-if="toDelete" v-model="showDeleteModal" ref="modalDelete" :title="`Delete contest ${toDelete.title}?`" @ok="deleteContest(toDelete.id)"></b-modal>
  </main>
</template>

<script>
import api from '@/lib/api'
import feedback from '@/lib/feedback'
import router from '@/lib/router'
import ContestCard from '@/components/ContestCard'

export default {
  name: 'Contests',
  components: {
    ContestCard
  },
  data: function () {
    return {
      contestList: [],
      toDelete: null,
      showDeleteModal: false
    }
  },
  methods: {
    createContest () {
      router.push({
        name: 'newContest'
      })
    },
    deleteContest (id) {
      api.deleteContest(id).then(() => {
        feedback.contestDeleted()
        this.contestList = this.contestList.filter(e => e.id !== id)
      }).catch(e => {
        api.apiError(e)
      })
    },
    askDeleteConfirmation (toDelete) {
      this.toDelete = toDelete
      this.showDeleteModal = true
    }
  },
  created: function () {
    api.getContests().then(contestList => {
      this.contestList = contestList
    }).catch(e => {
      api.apiError(e)
    })
  }
}
</script>
