<template>
  <main class="d-flex flex-column">
    <b-alert ref="toUseAlert" show variant="danger" class="m-2" v-if="providerToUse">
      <span>Please use <b>{{providerToUse}}</b> instead if you want to login with <b>{{email}}</b></span>
      <span>(You've tried to login with {{providerUsed}})</span>
    </b-alert>
    <div class="d-flex flex-fill justify-content-center align-items-center m-2">
      <div class="card">
        <div class="card-body">
          <h4 class="card-title">
            Sign in with an administrator account
          </h4>
          <div>
            <div v-for="provider in providers" :key="provider.id">
              <ProviderButton :provider="provider" @provider-clicked="signIn"/>
            </div>
          </div>
        </div>
      </div>
    </div>
  </main>
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

<style scoped>
.card {
  width: 18rem
}
main {
  min-height: 100vh;
}
</style>
