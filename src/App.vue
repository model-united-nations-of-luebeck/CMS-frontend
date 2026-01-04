<script setup>
import { inject, ref, onMounted } from "vue";
import { useRoute } from "vue-router";
import { useDisplay } from "vuetify";
const { mobile } = useDisplay();

const route = useRoute();

const showLogout = ref(false);
const routedComponent = ref(null);

const login = async function () {
  // get global axios instance for backend requests and save token in there
  const http = inject("backend_instance");
  http.defaults.headers.common["Authorization"] = `Token ${import.meta.env.VITE_BACKEND_TOKEN}`;
};

onMounted(() => {
  login();
});

const logout = function () {
  // call logout function of RegistrationView.vue

  console.log("Logging out", routedComponent.value);
  routedComponent.value?.logout();
};

const toggleDrawer = function () {
  routedComponent.value?.toggleDrawer();
};
</script>

<template>
  <v-app>
    <v-app-bar density="compact" color="primary">
      <v-app-bar-nav-icon
        v-if="mobile && route.matched[0]?.path === '/management/'"
        icon="mdi-menu"
        color="white"
        @click="toggleDrawer()"
      ></v-app-bar-nav-icon>
      <RouterLink v-else :to="route.matched[0]?.path || '/'">
        <v-app-bar-nav-icon
          v-if="route.matched[0]?.path === '/school-registration/'"
          icon="mdi-bank"
          color="white"
          @click="logout()"
        ></v-app-bar-nav-icon>
        <v-app-bar-nav-icon v-else icon="mdi-bank" color="white"></v-app-bar-nav-icon>
      </RouterLink>
      <v-app-bar-title>{{ $route.meta.title }} </v-app-bar-title>

      <template v-slot:append>
        <v-btn v-if="showLogout" @click="logout()">
          <v-icon>mdi-logout</v-icon>
          Logout
        </v-btn>
        <v-menu v-else open-on-hover>
          <template v-slot:activator="{ props }">
            <v-btn icon="mdi-dots-vertical" v-bind="props" variant="text"></v-btn>
          </template>

          <v-list dense>
            <v-list-item
              prepend-icon="mdi-information"
              href="https://munol.org/legal-notice/"
              target="_blank"
            >
              <v-list-item-title>Imprint</v-list-item-title>
            </v-list-item>
            <v-list-item prepend-icon="mdi-shield-check" :to="{ name: 'privacy-policy' }">
              <v-list-item-title>Privacy Policy</v-list-item-title>
            </v-list-item>
            <v-list-item
              prepend-icon="mdi-bug"
              href="mailto:cms@munol.org?subject=Bug Report CMS&body=Please describe the issue you encountered:"
            >
              <v-list-item-title>Report a Bug</v-list-item-title>
            </v-list-item>
          </v-list>
        </v-menu>
      </template>
    </v-app-bar>

    <v-main>
      <RouterView v-slot="{ Component }">
        <component :is="Component" @show-logout="(v) => (showLogout = v)" ref="routedComponent" />
      </RouterView>
    </v-main>
  </v-app>
</template>
