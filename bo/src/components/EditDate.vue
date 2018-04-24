<template>
  <div class="col-md-4 mb-3">
    <label v-bind:for="label">{{label}}</label>
    <input type="date" required class="form-control" v-bind:id="label"
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
        if (!this.value) return null
        let date = new Date(this.value)
        date.setMinutes(date.getMinutes() - date.getTimezoneOffset()) // to local timezone
        return date.toISOString().split('T')[0] // YYYY-MM-DD
      },
      set: function (newDate) {
        if (!newDate) return null
        let outDate = new Date(newDate)
        outDate.setMinutes(outDate.getMinutes() + outDate.getTimezoneOffset()) // to UTC
        this.$emit('input', outDate)
      }
    }
  }
}
</script>
