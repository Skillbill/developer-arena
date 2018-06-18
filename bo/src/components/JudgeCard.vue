<template>
  <b-card class="mb-3"
          :title="judge.name"
          :sub-title="judge.email"
          :img-src="imageURL"
          img-top
          img-fluid
          style="min-width: 13rem; max-width: 25rem">
    <div class="d-flex" slot="footer">
      <b-form-checkbox class="mr-auto" :checked="judge.selected" @input="setSelected"></b-form-checkbox>
      <b-button class="mr-2" variant="outline-primary" size="sm" title="edit the judge" @click.stop="editJudge()">
        <i class="fas fa-edit"></i> Edit
      </b-button>
      <b-button variant="danger" size="sm"  title="delete the judge" @click.stop="deleteJudge()">
        <i class="fas fa-times"></i> Delete
      </b-button>
    </div>
  </b-card>
</template>

<script>
import router from '@/lib/router'

export default {
  props: [
    'judge'
  ],
  computed: {
    imageURL () {
      return this.judge.image
    }
  },
  methods: {
    setSelected (value) {
      this.$emit('select', value)
    },
    editJudge () {
      router.push({
        name: 'editJudge',
        params: {
          judgeId: this.judge.id
        }
      })
    },
    deleteJudge () {
      this.$emit('remove')
    }
  }
}
</script>
