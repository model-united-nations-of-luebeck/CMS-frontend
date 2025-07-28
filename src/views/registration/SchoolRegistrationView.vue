<script setup>
import { ref, inject, computed } from "vue";
import { useRouter } from "vue-router";
const conference_abbr = import.meta.env.VITE_CONFERENCE_ABBREVIATION;

const emit = defineEmits(["show-logout"]);

const username = ref("");
const password = ref("");
const token = ref("");
const error = ref("");
const http = inject("backend_instance");
const router = useRouter();

// have a computed variable to check if the user is logged in by checking if the token is set
const isAuthenticated = computed(() => {
  return token.value ? true : false;
});

const login = async function () {
  // Handle login logic here

  try {
    const { data } = await http.post(
      import.meta.env.VITE_BACKEND_URL.split("/").slice(0, -2).join("/") +
        "/api-token-auth/",
      {
        username: username.value,
        password: password.value,
      },
    );
    token.value = data.token;
    http.defaults.headers.common["Authorization"] = `Token ${token.value}`;
    error.value = null;
    username.value = null; // Reset username after successful login
    password.value = null; // Reset password after successful login

    emit("show-logout", true);

    // Redirect to registration start page via router push
    router.push({
      name: "registration-startpage",
      params: { school_id: data.school_id },
    });
  } catch (err) {
    error.value = err.response ? err.response.data : "Login failed";
    token.value = null;
    username.value = null; // Reset username after unsuccessful login
    password.value = null; // Reset password after unsuccessful login
    delete http.defaults.headers.common["Authorization"];
  }
};

const logout = () => {
  token.value = null;
  username.value = null;
  password.value = null;
  delete http.defaults.headers.common["Authorization"];
  emit("show-logout", false);
  router.push({
    name: "school-registration",
  });
};

defineExpose({
  logout,
});
</script>

<template>
  <div class="registration">
    <v-container v-if="isAuthenticated">
      <template v-slot:append>
        <v-btn v-if="isAuthenticated" icon @click="logout">
          <v-icon>mdi-logout</v-icon>
        </v-btn>
      </template>
      <RouterView v-slot="{ Component }">
        <v-slide-x-transition>
          <component :is="Component" />
        </v-slide-x-transition>
      </RouterView>
    </v-container>

    <v-container v-if="!isAuthenticated">
      <v-form
        class="mx-auto"
        style="max-width: 400px; margin-top: 100px"
        @submit.prevent="login"
      >
        <img
          src="@/assets/images/munollogo.png"
          :alt="`${conference_abbr} Logo`"
          id="logo"
          width="200"
          class="mx-auto mb-4 d-block"
          style="display: block; margin: 50px auto !important"
        />
        <v-text-field
          v-model="username"
          label="Username"
          type="username"
          required
          outlined
          prepend-inner-icon="mdi-account"
          class="mb-4"
          autofocus
        ></v-text-field>
        <v-text-field
          v-model="password"
          label="Password"
          type="password"
          required
          prepend-inner-icon="mdi-key"
          class="mb-4"
        ></v-text-field>
        <v-alert v-if="error" type="error">
          Username or password didn't match. Please try again.
        </v-alert>
        <v-btn color="primary" block class="mt-4" type="submit" @click="login">
          Login
        </v-btn>
      </v-form>

      <v-alert
        icon="mdi-information"
        style="
          position: absolute;
          bottom: 0;
          left: 50%;
          transform: translateX(-50%);

          text-align: center;
        "
      >
        If you would like to participate in {{ conference_abbr }} but don't have
        an account for the next annual session yet, please contact the
        Conference Managers:
        <a href="mailto:conference@munol.org">conferencemanager@munol.org</a>
      </v-alert>
    </v-container>
  </div>
</template>

<style scoped></style>
