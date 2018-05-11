<template>
  <main class="container mt-3">
    <b-card v-if="user">
      <h6 slot="header" class="mb-0">
        <i v-if="provider" :class="provider.icon"></i> User details
      </h6>
      <b-row>
        <b-col sm="auto">
          <b-img width="100" rounded="circle" :src="user.photoURL || this.$config.statRes + 'blank-profile-picture.png'">
          </b-img>
        </b-col>
        <b-col sm="auto">
          <table class="details-table">
            <tbody>
              <tr>
                <td>Uid:</td>
                <td>{{user.uid}}</td>
              </tr>
              <tr>
                <td>Email:</td>
                <td>
                  {{email}}
                  <span v-if="provider.id === 'password'">
                    <i v-if="user.emailVerified" class="fas fa-check" style="color: green;" title="verified"></i>
                    <i v-else class="fas fa-times" style="color: red;" title="not verified"></i>
                  </span>
                </td>
              </tr>
              <tr>
                <td>Display name:</td>
                <td>{{user.displayName}}</td>
              </tr>
              <tr>
                <td>Provider:</td>
                <td>{{provider.name}}</td>
              </tr>
            </tbody>
          </table>
        </b-col>
      </b-row>
    </b-card>
  </main>
</template>

<script>
import api from '@/lib/api'
import * as utils from '@/lib/utils'

export default {
  name: 'User',
  props: [
    'userId'
  ],
  data: function () {
    return {
      user: null
    }
  },
  computed: {
    provider: function () {
      return utils.getProviderInfo(this.user.providerData[0].providerId)
    },
    email: function () {
      return (this.user.customClaims && this.user.customClaims.email) || this.user.email
    }
  },
  created: function () {
    api.getUserById(this.userId).then(user => {
      this.user = user
    })
  }
}
</script>

<style>
.details-table td {
  padding-right: 15px;
  padding-bottom: 2px;
}

.details-table > tbody > tr {
  border-top: 1px solid rgb(221, 221, 221);
}

.details-table > tbody > tr:first-child {
  border-top: 0;
}
</style>
