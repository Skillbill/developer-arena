<template>
  <div>
    <button class="btn btn-block btn-social mb-2" :class="`btn-${provider.nameLower}`" @click="$emit('provider-clicked', provider)">
      <i :class="provider.icon"></i>
      Sign in with {{provider.name}}
    </button>
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
