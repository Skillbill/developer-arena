<template>
  <div>
    <button class="btn btn-block btn-social mb-2" :class="`btn-${provider.style}`" @click="$emit('provider-clicked', provider)">
      <i class="fab" :class="`fa-${provider.style}`"></i>
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
