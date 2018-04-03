<template>
  <div>
      <h2>Edit dates</h2>
      <form action="#">
          <input type="text" v-model="contestTitle" />
      </form>
  </div>
</template>

<script>
export default {
  name: 'EditDates',
  data: function () {
    return {
      contestTitle: 'test'
    }
  }
}
</script>
