<template>
  <v-app>
    <Nav :isAuthenticated="isAuthenticated" />
    <login v-if="!isAuthenticated" @success="checkLogin" />
    <v-main v-else>
      <transition name="slide-fade">
        <router-view />
      </transition>
    </v-main>
  </v-app>
</template>

<script>
import axios from "axios";
import Vue from "vue";
import Login from "./components/Login.vue";
import Nav from "./components/Nav.vue";

export default {
  components: { Login, Nav },
  name: "App",
  data() {
    return {
      isAuthenticated: false,
    };
  },
  mounted() {
    const instance = axios.create({
      baseURL: "https://munoltom.pythonanywhere.com",
    });
    Vue.prototype.$http = instance;

    this.checkLogin();
  },
  methods: {
    checkLogin() {
      const token = sessionStorage.getItem("token");
      this.isAuthenticated = token != null;
      if (this.isAuthenticated)
        Vue.prototype.$http.defaults.headers.common[
          "Authorization"
        ] = `Token ${token}`;
    },
  },
};
</script>

<style>
.slide-fade-enter-active,
.slide-fade-leave-active {
  transition: all 0.3s ease;
}

.slide-fade-enter,
.slide-fade-leave-to {
  transform: translateX(10px);
  opacity: 0;
}
</style>
