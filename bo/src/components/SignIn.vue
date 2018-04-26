<template>
  <div class="d-flex  justify-content-center align-items-center">
    <div class="d-flex flex-column align-items-center">
      <h2>Sign in with an administrator account</h2>
      <div v-if="providerToUse">
        <span>Please use <b>{{providerToUse}}</b> instead if you want to login with <b>{{email}}</b></span>
        <span>(You've tried to login with {{providerUsed}})</span>
      </div>
      <div style="width: 230px;">
        <div v-for="provider in providers" :key="provider.name">
          <ProviderButton :provider="provider" @provider-clicked="signIn"/>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import {mapGetters} from 'vuex'
import auth from '@/lib/auth'
import ProviderButton from '@/components/ProviderButton'

export default {
  name: 'SignIn',
  data () {
    return {
      providers: auth.providers
    }
  },
  props: {
    email: {
      type: String
    },
    providerUsed: {
      type: String
    },
    providerToUse: {
      type: String
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
    }
  }
}
</script>
