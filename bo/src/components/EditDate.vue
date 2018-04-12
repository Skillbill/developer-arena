<template>
  <div class="form-group px-2">
    <label v-bind:for="label">{{label}}: </label>
    <input type="date" required="true" class="form-control date" v-bind:id="label"
      v-model="dateInput">
  </div>
</template>

<script>
export default {
  name: 'EditDate',
  props: [
    'value',
    'label'
  ],
  computed: {
    dateInput: {
      get: function () {
        return this.value.substring(0, 10)
      },
      set: function (newDate) {
        this.value = newDate + 'T00:00:00.000Z'
        this.$emit('input', this.value)
      }
    }
  }
}
</script>
