<template>
  <div>
    <h2>Dates of the contest</h2>
    <form v-on:submit.prevent="saveNewDates">
      <div class="d-flex flex-column flex-md-row">
        <div class="form-group px-2">
          <label for="date1">End presentation: </label>
          <input type="date" required="true" class="form-control date" id="date1"
            :value="contestDate1" @input="updateDate(1, $event)">
        </div>
        <div class="form-group px-2">
          <label for="date0">End applying:</label>
          <input type="date" required="true" class="form-control date" id="date0"
            :value="contestDate0" @input="updateDate(0, $event)">
        </div>
        <div class="form-group px-2">
          <label for="date2">End voting: </label>
          <input type="date" required="true" class="form-control date" id="date2"
            :value="contestDate2" @input="updateDate(2, $event)">
        </div>
      </div>

      <button id="btnSave" type="submit" class="btn btn-primary">Save</button>
    </form>
  </div>
</template>

<script>
import {mapGetters} from 'vuex'
import axios from 'axios'
import * as utils from '../utils'

export default {
  name: 'EditDates',
  data: function () {
    return {
    }
  },
  computed: {
    ...mapGetters({
      user: 'getUser',
      contest: 'getContest',
      contestDate0: 'getContestDate0',
      contestDate1: 'getContestDate1',
      contestDate2: 'getContestDate2'
    })
  },
  methods: {
    updateDate (index, e) {
      if (e.target.value) {
        this.$store.commit('setContestDate'.concat(index), e.target.value)
      }
    },
    saveNewDates () {
      this.user.getIdToken().then(token => {
        let headers = {
          'Authorization': 'Bearer ' + token,
          'Content-Type': 'application/json',
          'Accept-Language': 'en'
        }
        return axios({
          method: 'patch',
          url: utils.getApiUrl('/contest/' + this.contest.id),
          data: {
            endPresentation: this.contest.endPresentation,
            endApplying: this.contest.endApplying,
            endVoting: this.contest.endVoting
          },
          headers
        })
      }).then(response => {
        this.$store.commit('addFeedback', {
          title: 'Saved',
          message: 'New dates have been saved successfully'
        })
        console.log(response.data)
      }).catch(e => {
        let error = e.response && e.response.data && e.response.data.error
        if (error) {
          this.$store.commit('addFeedback', {
            title: 'Error',
            message: `status code: ${error.code}, text: ${error.msg}`
          })
          console.error(e)
        }
      })
    }
  },
  created () {
    if (!this.$store.contest) {
      this.$store.dispatch('loadLastContest')
    }
  }
}
</script>
