<template>
  <b-card class="mb-2">
    <b-row>
      <b-col sm="auto">
        <b-img width="100" rounded="circle" :src="imageURL">
        </b-img>
      </b-col>
      <b-col>
        <label for="name">Name</label>
        <b-form-input id="name" :state="!v.name.$error ? null : false" :value="name" @input="setName"></b-form-input>
        <b-form-invalid-feedback v-if="!v.name.required">This feild is required.</b-form-invalid-feedback>
        <b-form-invalid-feedback v-if="!v.name.minLength">Name must have at least {{ v.name.$params.minLength.min }} letters.</b-form-invalid-feedback>

        <label for="email" class="mt-2">Email</label>
        <b-form-input id="email" :state="!v.email.$error ? null : false" :value="email" @input="setEmail"></b-form-input>
        <b-form-invalid-feedback v-if="!v.email.required">This feild is required.</b-form-invalid-feedback>
        <b-form-invalid-feedback v-if="!v.email.email">Please enter a valid email.</b-form-invalid-feedback>

        <label for="image" class="mt-2">Image</label>
        <b-form-file id="image" :value="newImage" @change="setImage($event.target.files[0])"></b-form-file>
      </b-col>
    </b-row>
  </b-card>
</template>

<script>
import * as utils from '@/lib/utils'

export default {
  name: 'EditJurorCard',
  props: [
    'name',
    'email',
    'imageFile',
    'newImage',
    'v'
  ],
  computed: {
    imageURL () {
      if (this.newImage) {
        return this.newImageURL
      } else if (this.imageFile) {
        return utils.getFakeImageURL(Number.parseInt(this.imageFile.name.substring(0, this.imageFile.name.length - 4)))
      } else {
        return this.$config.statRes + '/blank-profile-picture.png'
      }
    }
  },
  methods: {
    setName ($event) {
      this.$emit('update:name', $event)
      this.v.name.$touch()
    },
    setEmail ($event) {
      this.$emit('update:email', $event)
      this.v.email.$touch()
    },
    setImage (file) {
      let reader = new FileReader()
      reader.onload = () => {
        this.newImageURL = reader.result
        this.$emit('update:newImage', file)
      }
      reader.readAsDataURL(file)
    }
  }
}
</script>
