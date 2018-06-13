<template>
  <main class="container mt-3">
    <h3 v-if="contest && contest.id" class="mb-3">Edit contest #{{contest.id}} ({{contest.i18n['en'].title}})</h3>
    <h3 v-if="contest && !contest.id" class="mb-3">Create new contest</h3>
    <form v-if="contest" class="needs-validation" autocomplete="off"
      v-bind:class="{'was-validated': wasValidated}" novalidate @submit.prevent="validateAndSend">
      <div class="btn-group btn-group-toggle mb-3">
        <label class="btn btn-secondary" v-for="lang in ['en', 'it']" :key="lang" :class="{active: lang === activeLang}">
          <input type="radio" name="options" id="lang" @click="activeLang = lang"> {{lang}}
        </label>
      </div>
      <div class="form-row">
        <div class="col-md-10 mb-3">
          <label for="title">Title*</label>
          <div class="input-group">
            <input type="text" class="form-control" id="title" v-model="contest.i18n[activeLang].title" required>
            <div class="invalid-feedback" style="width: 100%;">
              The title is required.
            </div>
          </div>
        </div>
        <div class="col-md-2 mb-3">
          <label for="state">State*</label>
          <select class="custom-select" id="state" v-model="contest.state">
            <option v-for="state in ['DRAFT','ACTIVE','PAST']" v-bind:key="state">{{state}}</option>
          </select>
        </div>
      </div>
      <div class="form-row">
        <EditDate label="End Presentation*" v-model="contest.endPresentation"/>
        <EditDate label="End Applying*" v-model="contest.endApplying"/>
        <EditDate label="End Voting*" v-model="contest.endVoting"/>
      </div>
      <div class="mb-3">
        <label for="description">Description*</label>
        <div class="input-group">
          <textarea rows=10 class="form-control" id="description" v-model="contest.i18n[activeLang].description" required></textarea>
          <div class="invalid-feedback" style="width: 100%;">
            The description is required.
          </div>
        </div>
      </div>
      <div class="mb-3">
        <label for="rules">Rules*</label>
        <div class="input-group">
          <textarea rows=10 class="form-control" id="rules" v-model="contest.i18n[activeLang].rules" required></textarea>
          <div class="invalid-feedback" style="width: 100%;">
            The rules are required.
          </div>
        </div>
      </div>
      <div class="mb-3">
        <label for="rules">Closed state page</label>
        <div class="input-group">
          <textarea rows=10 class="form-control" id="rules" v-model="contest.i18n[activeLang].descriptionClosed"></textarea>
        </div>
      </div>
      <div class="mb-3">
        <label for="rules">Past state page</label>
        <div class="input-group">
          <textarea rows=10 class="form-control" id="rules" v-model="contest.i18n[activeLang].descriptionPast"></textarea>
        </div>
      </div>
      <div class="row">
        <button id="btnSave" type="submit" class="btn btn-primary mb-3 mr-3">Save</button>
        <button class="btn btn-danger mb-3" @click.prevent="cancel">Cancel</button>
      </div>
    </form>
  </main>
</template>

<script>
import Vue from 'vue'
import {mapGetters} from 'vuex'
import EditDate from '@/components/EditDate'
import api from '@/lib/api'
import feedback from '@/lib/feedback'
import router from '@/lib/router'
import * as utils from '@/lib/utils'

export default {
  name: 'EditContest',
  components: {
    EditDate
  },
  props: {
    contestId: Number
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
    validateAndSend (event) {
      let form = event.target
      let oldLang = this.activeLang
      this.checkValidity(form, 'en').then(() => {
        return this.checkValidity(form, 'it')
      }).then(() => {
        this.activeLang = oldLang
        if (this.contest.id) {
          api.patchContest(this.contest).then(() => {
            feedback.contestUpdated()
            router.push('/contests')
          }).catch(e => {
            api.apiError(e)
          })
        } else {
          api.createContest(this.contest).then(() => {
            feedback.contestCreated()
            router.push('/contests')
          }).catch(e => {
            api.apiError(e)
          })
        }
      }).catch(() => {
        feedback.invalidFeilds()
      })
    },
    checkValidity (form, lang) {
      this.activeLang = lang
      return Vue.nextTick().then(() => {
        if (form.checkValidity()) {
          this.wasValidated = false
          return Promise.resolve()
        } else {
          this.wasValidated = true
          return Promise.reject(new Error('not valid'))
        }
      })
    },
    cancel () {
      router.go(-1)
    }
  },
  created () {
    if (this.contestId) {
      api.getContestById(this.contestId).then(contest => {
        if (contest) this.contest = contest
      }).catch(e => {
        api.apiError(e)
      })
    } else {
      this.contest = utils.getEmptyContest()
    }
  }
}
</script>
