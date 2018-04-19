<template>
  <div>
    <h3 v-if="contest" class="mb-3">Edit contest {{contest.id}}</h3>
    <form v-if="contest" class="needs-validation" autocomplete="off"
      v-bind:class="{'was-validated': wasValidated}" novalidate @submit.prevent="validateAndPatch">
      <div class="btn-group btn-group-toggle mb-3">
        <label class="btn btn-secondary" v-for="lang in ['en', 'it']" :key="lang" :class="{active: lang === activeLang}">
          <input type="radio" name="options" id="lang" @click="activeLang = lang"> {{lang}}
        </label>
      </div>
      <div class="form-row">
        <div class="col-md-10 mb-3">
          <label for="title">Title</label>
          <div class="input-group">
            <input type="text" class="form-control" id="title" v-model="contest.i18n[activeLang].title" required>
            <div class="invalid-feedback" style="width: 100%;">
              The title is required.
            </div>
          </div>
        </div>
        <div class="col-md-2 mb-3">
          <label for="state">State:</label>
          <select class="custom-select" id="state" v-model="contest.state">
            <option v-for="state in ['DRAFT','ACTIVE','PAST']" v-bind:key="state">{{state}}</option>
          </select>
        </div>
      </div>
      <div class="form-row">
        <EditDate label="End Presentation" v-model="contest.endPresentation"/>
        <EditDate label="End Applying" v-model="contest.endApplying"/>
        <EditDate label="End Voting" v-model="contest.endVoting"/>
      </div>
      <div class="mb-3">
        <label for="description">Description</label>
        <div class="input-group">
          <textarea rows=10 class="form-control" id="description" v-model="contest.i18n[activeLang].description" required></textarea>
          <div class="invalid-feedback" style="width: 100%;">
            The description is required.
          </div>
        </div>
      </div>
      <div class="mb-3">
        <label for="rules">Rules</label>
        <div class="input-group">
          <textarea rows=10 class="form-control" id="rules" v-model="contest.i18n[activeLang].rules" required></textarea>
          <div class="invalid-feedback" style="width: 100%;">
            The rules are required.
          </div>
        </div>
      </div>
      <button id="btnSave" type="submit" class="btn btn-primary mb-3">Save</button>
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
      activeLang: 'en',
      wasValidated: false
    }
  },
  computed: {
    ...mapGetters({
      user: 'getUser'
    })
  },
  methods: {
    validateAndPatch (event) {
      if (event.target.checkValidity() === false) {
        this.wasValidated = true
        return
      } else {
        this.wasValidated = false
      }

      api.patchContest(this.contest).then(response => {
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
