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
          <a href="#/">{{$t("home")}}</a>
        </li>
        <li>
          <a href="#/projects">{{$t("projects")}}</a>
        </li>
        <li>
          <a href="#/about">{{$t("about")}}</a>
        </li>
        <li>
          <a href="#/login">{{$t("login")}}</a>
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
