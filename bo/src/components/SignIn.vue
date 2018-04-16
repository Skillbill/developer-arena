<template>
  <div>
    <div v-for="provider in providers" :key="provider.name">
      <ProviderButton :provider="provider" @provider-clicked="signIn"/>
    </div>
  </div>
</template>

<script>
import {mapGetters} from 'vuex'
import auth from '../auth'
import ProviderButton from '@/components/ProviderButton'

export default {
  name: 'SignIn',
  data () {
    return {
      providers: auth.providers
    }
  },
  components: {
    ProviderButton
  },
  computed: {
    ...mapGetters({
      user: 'getUser'
    })
  },
  methods: {
    signIn (provider) {
      auth.signIn(provider)
    },
    onError (e) {
      this.$log.error('onError: ', e)
    }
  }
}
</script>
