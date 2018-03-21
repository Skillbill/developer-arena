<template>
  <header class="main-header">
    <h1>
      <a href="#/">
        <img src="static/graphics/assets/logo.svg" alt="Logo">
        <span>{{$t("siteName")}}</span>
      </a>
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
        <li>
          <router-link to="/login">{{$t("menu.login")}}</router-link>
        </li>
      </ul>
    </nav>
    <a href="https://github.com/Skillbill/sda-contest" class="github-link" :title="$t('viewGitHub')">{{$t("viewGitHub")}}</a>
  </header>
</template>

<script>
export default {

}
</script>
