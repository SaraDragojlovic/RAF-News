<template>
  <div id="app" :class="getPageClass">
    <AppNavbar v-if="showNavbar" />
    <router-view />
  </div>
</template>

<script>
import AppNavbar from './components/AppNavbar.vue';

export default {
  name: 'App',
  components: {
    AppNavbar,
  },
  computed: {
    showNavbar() {
      return this.$route.path !== '/login';
    },
    getPageClass() {
      return this.$route.path === '/login' ? 'login-page' : 'other-page';
    },
  },
};
</script>

<style>
#app {
  font-family: Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  margin: 0;
  padding: 0;
  height: 100vh;
  width: 100%;
}

body,
html {
  margin: 0;
  padding: 0;
}

.login-page {
  background: linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url('@/assets/home.jpeg') no-repeat center center fixed;
  background-size: cover;
  background-repeat: no-repeat;
  background-position: center;
}

.other-page {
  background: linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url('@/assets/pozadina.jpeg') no-repeat center center fixed;
  background-size: cover;
  background-repeat: no-repeat;
  background-position: center;
}
</style>
