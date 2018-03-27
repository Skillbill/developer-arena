<template>
  <div class="progressbar">
    <span>{{label}} {{progress}}%</span>
    <span :style="{width: progress + '%' }" class="bar"></span>
  </div>
</template>

<script>
export default {
  props: ['label', 'progress']
}
</script>
