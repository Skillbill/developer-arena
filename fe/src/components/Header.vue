<template>
  <header class="main-header">
    <h1>
      <router-link to="/">
        <img src="/static/graphics/assets/logo.svg" alt="Logo">
        <span>{{$t("siteName")}}AA</span>
      </router-link>
    </h1>
    <nav class="main-nav">
      <ul>
        <li>
          <router-link to="/">{{$t("menu.home")}}</router-link>
        </li>
        <li v-if="contest">
          <router-link :to="{name: 'Projects', params: {contestId: contest.id}, query: {sort: contestStorting[0]}}">{{$t("menu.projects")}}</router-link>
        </li>
        <li v-if="contest && contest.jury.length">
          <router-link :to="{name: 'Jury', params: {contestId: contest.id}}">{{$t("menu.jury")}}</router-link>
        </li>
        <li>
          <router-link to="/rules">{{$t("menu.rules")}}</router-link>
        </li>
        <li v-if="user">
          <a href="#" class="user-photo" v-on:click.prevent="signOut" v-bind:style="{backgroundImage: `url('${photoURL}')`}">{{$t("menu.signOut")}}</a>
        </li>
        <li v-else>
          <router-link to="/sign-in">{{$t("menu.signIn")}}</router-link>
        </li>
      </ul>
    </nav>
    <a href="https://github.com/Skillbill/developer-arena" class="github-link" :title="$t('viewGitHub')">{{$t("viewGitHub")}}</a>
  </header>
</template>

<script>
import auth from '../auth'

export default {
  computed: {
    user() {
      return this.$store.state.user;
    },
    contest() {
      return this.$store.state.contest;
    },
    contestStorting() {
      return this.$store.getters.contestStorting;
    },
    photoURL() {
      if(this.user && this.user.photoURL) {
        return this.user.photoURL;
      } else {
        return '/static/graphics/assets/user.svg';
      }
    }
  },
  methods: {
    signOut() {
      auth.signOut();
    }
  }
}
</script>
