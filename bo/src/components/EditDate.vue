<template>
  <div class="form-group px-2">
    <label v-bind:for="label">{{label}}: </label>
    <input type="date" required class="form-control date" v-bind:id="label"
      :value="dateInput" @input="dateInput=$event.target.value">
    <div class="invalid-feedback">
      Valid date is required
    </div>
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
        return this.value ? this.value.substring(0, 10) : null
      },
      set: function (newDate) {
        this.$emit('input', newDate ? (newDate + 'T00:00:00.000Z') : null)
      }
    }
  }
}
</script>
