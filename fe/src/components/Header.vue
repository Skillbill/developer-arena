<template>
  <header class="main-header">
    <h1>
      <router-link to="/">
        <img src="static/graphics/assets/logo.svg" alt="Logo">
        <span>{{$t("siteName")}}</span>
      </router-link>
    </h1>
    <nav class="main-nav">
      <ul>
        <li>
          <router-link to="/">{{$t("menu.home")}}</router-link>
        </li>
        <li>
          <router-link to="/projects">{{$t("menu.projects")}}</router-link>
        </li>
        <li>
          <router-link to="/about">{{$t("menu.about")}}</router-link>
        </li>
        <li v-if="user">
          <a href="#" v-bind:class="{'user-photo': user && user.photoURL}" v-on:click.prevent="signOut" v-bind:style="{backgroundImage: `url('${user.photoURL}')`}">{{$t("menu.signOut")}}</a>
        </li>
        <li v-else>
          <router-link to="/sign-in">{{$t("menu.signIn")}}</router-link>
        </li>
      </ul>
    </nav>
    <a href="https://github.com/Skillbill/sda-contest" class="github-link" :title="$t('viewGitHub')">{{$t("viewGitHub")}}</a>
  </header>
</template>

<script>
import firebase from 'firebase'

export default {
  computed: {
    user() {
      return this.$store.state.user;
    }
  },
  methods: {
    signOut() {
      firebase.auth().signOut();
    }
  }
}
</script>
