<script setup>
import { inject, ref, onMounted } from "vue";

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
</script>

<template>
  <v-app>
    <v-app-bar density="compact" color="primary">
      <RouterLink to="/">
        <v-app-bar-nav-icon icon="mdi-bank" color="white"></v-app-bar-nav-icon>
      </RouterLink>
      <v-app-bar-title>{{ this.$route.meta.title }} </v-app-bar-title>

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
