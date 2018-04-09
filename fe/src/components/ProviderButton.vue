<template>
  <button class="social-button" :class="this.providerConfig.name.toLowerCase()" v-on:click="onClickProvider">{{this.label || this.providerConfig.name}}</button>
</template>

<script>

const providers = {
  google: {
    name: 'Google',
    providerName: 'GoogleAuthProvider',
    scopes: ['https://www.googleapis.com/auth/userinfo.email']
  },
  github: {
    name: 'GitHub',
    providerName: 'GithubAuthProvider'
  },
  facebook: {
    name: 'Facebook',
    providerName: 'FacebookAuthProvider'
  },
  twitter: {
    name: 'Twitter',
    providerName: 'TwitterAuthProvider'
  }
}

const getProviderConfig = (name) => {
  if(providers[name]) {
    return providers[name];
  }
  for(let p in providers) {
    if(name.toLowerCase().indexOf(p) > -1) {
      return providers[p];
    }
    if(p.indexOf(name.toLowerCase()) > -1) {
      return providers[p];
    }
  }
  throw new Error('Please use a supported provider:', providers);
}

export default {
  props: ['provider', 'onProceed', 'label'],
  computed: {
    providerConfig() {
      return getProviderConfig(this.provider);
    }
  },
  methods: {
    onClickProvider() {
      if(this.onProceed) {
        this.onProceed(this.providerConfig.providerName, this.providerConfig.scopes);
      }
    }
  }
}
</script>
