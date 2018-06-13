<template>
  <main class="container mt-3">
    <div class="row mb-2">
      <h2>Jury</h2>
    </div>
    <EditJudgeCard v-for="(v, index) in $v.jury.$each.$iter" :key="index"
                  v-bind.sync="jury[index]" :v="v"/>
    <div class="row">
      <b-button variant="primary mb-3 mr-3" @click="save">Save</b-button>
      <b-button variant="danger mb-3" @click="cancel">Cancel</b-button>
    </div>
  </main>
</template>

<script>
import { validationMixin } from 'vuelidate'
import { required, minLength, email } from 'vuelidate/lib/validators'
import api from '@/lib/api'
import router from '@/lib/router'
import feedback from '@/lib/feedback'
import EditJudgeCard from '@/components/EditJudgeCard'

export default {
  name: 'EditJury',
  mixins: [validationMixin],
  components: {
    EditJudgeCard
  },
  props: [
    'contestId'
  ],
  data: function () {
    return {
      jury: []
    }
  },
  validations: {
    jury: {
      $each: {
        name: {
          required,
          minLength: minLength(2)
        },
        email: {
          required,
          email
        }
      }
    }
  },
  methods: {
    save () {
      if (this.$v.$invalid) {
        feedback.invalidFeilds()
      } else {
        feedback.juryUpdated()
        router.push('/contests')
      }
    },
    cancel () {
      router.go(-1)
    }
  },
  created: function () {
    api.getJuryById(this.contestId).then(jury => {
      jury = jury.map(judge => {
        judge.newImage = null
        return judge
      })
      this.jury = jury
    }).catch(e => {
      api.apiError(e)
    })
  }
}
</script>
