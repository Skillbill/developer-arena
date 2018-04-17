<template>
  <div>
    <h4 class="mb-3">Dates of the contest</h4>
    <form v-if="contest" class="needs-validation"
      v-bind:class="{'was-validated': wasValidated}" novalidate @submit.prevent="saveNewDates">
      <div class="row">
        <EditDate label="End Presentation" v-model="contest.endPresentation"/>
        <EditDate label="End Applying" v-model="contest.endApplying"/>
        <EditDate label="End Voting" v-model="contest.endVoting"/>
      </div>
      <div class="mb-3">
        <label for="state">State</label>
        <div class="input-group">
          <input type="text" class="form-control" id="state" v-model="contest.state">
        </div>
      </div>
      <div class="mb-3">
        <label for="title">Title</label>
        <div class="input-group">
          <input type="text" class="form-control" id="title" v-model="contest.i18n[0].text" required>
          <div class="invalid-feedback" style="width: 100%;">
            The title is required.
          </div>
        </div>
      </div>
      <div class="mb-3">
        <label for="description">Description</label>
        <div class="input-group">
          <input type="text" class="form-control" id="description" v-model="contest.i18n[1].text" required>
          <div class="invalid-feedback" style="width: 100%;">
            The title is required.
          </div>
        </div>
      </div>
      <button id="btnSave" type="submit" class="btn btn-primary">Save</button>
    </form>
  </div>
</template>

<script>
import {mapGetters} from 'vuex'
import EditDate from '@/components/EditDate'
import api from '@/lib/api'
import feedback from '@/lib/feedback'

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
      }).then(response => {
        if (response) feedback.contestUpdated()
      })
    }
  },
  created () {
    api.getContestById(1).then(contest => {
      if (contest) this.contest = contest
    })
  }
}
</script>
