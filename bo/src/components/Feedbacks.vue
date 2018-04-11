<template>
  <div>
    <div v-for="fb in feedBacks"
      v-bind:key="fb.id"
      class="alert alert-warning alert-dismissible fade show"
      role="alert"
    >
      <strong>{{fb.title}}</strong>: {{fb.message}}
      <button type="button" class="close" v-on:click="fb.remove">
        <span>&times;</span>
      </button>
    </div>
  </div>
</template>

<script>
import {mapGetters} from 'vuex'

export default {
  name: 'Feedbacks',
  data: function () {
    return {
    }
  },
  computed: {
    ...mapGetters({
      feedBacks: 'getFeedbacks'
    })
  },
  methodes: {

  }
}
</script>
