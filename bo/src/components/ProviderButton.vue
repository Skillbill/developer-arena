<template>
  <div>
    <button type="submit" @click="$emit('provider-clicked', provider)">{{provider.name}}</button>
  </div>
</template>

<script>
export default {
  name: 'ProviderButton',
  props: [
    'provider'
  ]
}
</script>
