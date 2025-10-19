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
  http.defaults.headers.common["Authorization"] = `Token ${
    import.meta.env.VITE_BACKEND_TOKEN
  }`;
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
        <v-app-bar-nav-icon icon="mdi-bank" color="white"></v-app-bar-nav-icon>
      </RouterLink>
      <v-app-bar-title>{{ $route.meta.title }} </v-app-bar-title>

      <template v-slot:append>
        <v-btn v-if="showLogout" @click="logout()">
          <v-icon>mdi-logout</v-icon>
          Logout
        </v-btn>
        <v-btn v-else icon="mdi-dots-vertical"></v-btn>
      </template>
    </v-app-bar>

    <v-main>
      <RouterView v-slot="{ Component }">
        <component
          :is="Component"
          @show-logout="(v) => (showLogout = v)"
          ref="routedComponent"
        />
      </RouterView>
    </v-main>
  </v-app>
</template>
