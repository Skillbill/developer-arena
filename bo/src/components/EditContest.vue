<template>
  <div>
    <h2>Dates of the contest</h2>
    <form class="needs-validation"
      v-bind:class="{'was-validated': wasValidated}" novalidate @submit.prevent="saveNewDates">
      <div class="d-flex flex-column flex-md-row">
        <EditDate v-if="contest" label="End Presentation" v-model="contest.endPresentation"/>
        <EditDate v-if="contest" label="End Applying" v-model="contest.endApplying"/>
        <EditDate v-if="contest" label="End Voting" v-model="contest.endVoting"/>
      </div>
      <button id="btnSave" type="submit" class="btn btn-primary">Save</button>
    </form>
  </div>
</template>

<script>
import {mapGetters} from 'vuex'
import EditDate from '@/components/EditDate'
import axios from 'axios'
import api from '@/lib/api'
import feedback from '@/lib/feedback'
import * as utils from '@/lib/utils'

export default {
  name: 'EditContest',
  components: {
    EditDate
  },
  data: function () {
    return {
      contest: null,
      wasValidated: false
    }
  },
  computed: {
    ...mapGetters({
      user: 'getUser'
    })
  },
  methods: {
    saveNewDates (event) {
      if (event.target.checkValidity() === false) {
        this.wasValidated = true
        return
      } else {
        this.wasValidated = false
      }

      api.patchContest(this.contest.id, {
        endPresentation: this.contest.endPresentation,
        endApplying: this.contest.endApplying,
        endVoting: this.contest.endVoting
      }).then(() => {
        feedback.contestUpdated()
      }).catch(() => {
        feedback.apiError()
      })
    }
  },
  created () {
    let headers = {
      'Authorization': 'admin',
      'Content-Type': 'application/json',
      'Accept-Language': 'en'
    }
    axios({
      method: 'get',
      url: utils.getApiUrl('/contest/last'),
      headers
    }).then(response => {
      this.contest = response.data.contest
    }).catch(e => {
      let error = e.response && e.response.data && e.response.data.error
      if (error) {
        this.$store.commit('addFeedback', {
          title: 'Error',
          message: `status code: ${error.code}, text: ${error.msg}`
        })
        this.$log.error(e)
      } else {
        this.$log.error(e)
      }
    })
  }
}
</script>
