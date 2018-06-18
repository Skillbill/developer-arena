<template>
  <main class="container mt-3" v-if="judge">
    <h3 v-if="judge.id" class="mb-3">Edit judge #{{judge.id}} ({{judge.name}})</h3>
    <h3 v-else class="mb-3">Create new judge</h3>
    <b-row class="mb-2">
      <b-col md="3">
        <b-img fluid :src="imageURL"></b-img>
      </b-col>
      <b-col md="9">
        <label for="name">Name*</label>
        <b-form-input id="name" :state="!$v.judge.name.$error ? null : false" v-model="$v.judge.name.$model"></b-form-input>
        <b-form-invalid-feedback v-if="!$v.judge.name.required">This feild is required.</b-form-invalid-feedback>
        <b-form-invalid-feedback v-if="!$v.judge.name.minLength">Name must have at least {{ $v.judge.name.$params.minLength.min }} letters.</b-form-invalid-feedback>

        <label for="email" class="mt-2">Email*</label>
        <b-form-input id="email" :state="!$v.judge.email.$error ? null : false" v-model="$v.judge.email.$model"></b-form-input>
        <b-form-invalid-feedback v-if="!$v.judge.email.required">This feild is required.</b-form-invalid-feedback>
        <b-form-invalid-feedback v-if="!$v.judge.email.email">Please enter a valid email.</b-form-invalid-feedback>
        <b-form-invalid-feedback v-if="!$v.judge.email.maxLength">Name must have less than {{ $v.judge.email.$params.maxLength.max }} letters.</b-form-invalid-feedback>

        <label for="twitter" class="mt-2">Twitter</label>
        <b-form-input id="twitter" v-model="judge.twitter"></b-form-input>

        <label for="site" class="mt-2">Web site</label>
        <b-form-input id="site" v-model="judge.site"></b-form-input>

        <label for="image" class="mt-2">Image</label>
        <b-form-file id="image" :value="newImage" @change="setImage($event.target.files[0])"></b-form-file>

        <b-form-group label="Description" class="mt-2">
          <b-form-radio-group id="langRadio" buttons v-model="lang" :options="['en', 'it']" name="langRadio">
          </b-form-radio-group>
          <b-form-textarea id="description" class="mt-2" :rows="3" v-model="judge.bio[lang]"></b-form-textarea>
        </b-form-group>

      </b-col>
    </b-row>
    <b-button variant="primary mb-3 mr-3" @click="validateAndSend">Save</b-button>
    <b-button variant="danger mb-3" @click="cancel">Cancel</b-button>
  </main>
</template>

<script>
import api from '@/lib/api'
import router from '@/lib/router'
import feedback from '@/lib/feedback'
import * as utils from '@/lib/utils'
import { validationMixin } from 'vuelidate'
import { required, minLength, maxLength, email } from 'vuelidate/lib/validators'

export default {
  name: 'EditJudge',
  mixins: [validationMixin],
  props: {
    judgeId: Number
  },
  data: function () {
    return {
      judge: null,
      newImage: null,
      newImageURL: null,
      lang: 'en'
    }
  },
  validations: {
    judge: {
      name: {
        required,
        minLength: minLength(2)
      },
      email: {
        required,
        maxLength: maxLength(50),
        email
      }
    }
  },
  computed: {
    imageURL () {
      return this.newImageURL ||
            this.judge.image ||
            utils.getBlankProfilePicUrl()
    }
  },
  methods: {
    setImage (file) {
      if (!file) return
      let reader = new FileReader()
      reader.onload = () => {
        this.newImage = file
        this.newImageURL = reader.result
      }
      reader.readAsDataURL(file)
    },
    validateAndSend () {
      this.$v.$touch()
      if (this.$v.$invalid) {
        feedback.invalidFeilds()
      } else {
        if (this.judge.id) {
          api.patchJudge(this.judge).then(() => {
            return this.newImage ? api.putJudgeImage(this.judge.id, this.newImage) : Promise.resolve()
          }).then(() => {
            feedback.judgeUpdated()
            router.go(-1)
          }).catch(e => {
            api.apiError(e)
          })
        } else {
          api.createJudge(this.judge).then(judge => {
            return this.newImage ? api.putJudgeImage(judge.id, this.newImage) : Promise.resolve()
          }).then(() => {
            feedback.judgeCreated()
            router.go(-1)
          }).catch(e => {
            api.apiError(e)
          })
        }
      }
    },
    cancel () {
      router.go(-1)
    }
  },
  created () {
    if (this.judgeId) {
      api.getJudgeById(this.judgeId).then(judge => {
        judge.image = api.getJudgeImageUrl(judge)
        this.judge = judge
      }).catch(e => {
        api.apiError(e)
      })
    } else {
      this.judge = utils.getEmptyJudge()
    }
  }
}
</script>
