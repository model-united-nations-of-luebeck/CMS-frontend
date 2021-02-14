<template>
  <v-container class="fill-height" fluid>
    <v-row align="center" justify="center">
      <v-col cols="12" sm="8" md="4">
        <v-card class="elevation-12">
          <v-toolbar color="primary" dark flat>
            <v-toolbar-title>Login</v-toolbar-title>
            <v-spacer />
          </v-toolbar>
          <v-card-text>
            <v-alert v-if="error" type="error">
              Username or password didn't match. Please try again.
            </v-alert>
            <v-alert v-if="loggedOut" dismissible type="success">
              You've been logged out successfully.
            </v-alert>
            <v-form>
              <v-text-field
                v-model="username"
                label="Login"
                name="login"
                prepend-icon="mdi-account"
                type="text"
              />

              <v-text-field
                id="password"
                v-model="password"
                label="Password"
                name="password"
                prepend-icon="mdi-lock"
                type="password"
                @keyup.enter="login"
              />
            </v-form>
          </v-card-text>
          <v-card-actions>
            <v-spacer />
            <v-btn color="primary" @click="login">
              Login
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import Vue from "vue";

export default {
  name: "Login",
  data() {
    return {
      username: null,
      password: null,
      error: null,
    };
  },
  props: {
    loggedOut: {
      type: Boolean,
      default: false,
    },
  },
  methods: {
    /**
     * API Request to obtain auth token
     * TODO: API base domain
     */
    async login() {
      try {
        const { data } = await this.$http.post("/api-token-auth/", {
          username: "Tom", //this.username,
          password: "I'mlovingMUNOLinstead", //this.password
        });

        Vue.prototype.$http.defaults.headers.common[
          "Authorization"
        ] = `Token ${data.token}`;
        this.loggedout = false;
        this.error = null;
        sessionStorage.setItem("token", data.token);
        this.$emit("success");
      } catch (error) {
        this.error = error; //show error message
        this.token = null;
        delete this.$http.defaults.headers.common["Authorization"];
        this.password = null;
      }

      this.password = null; //resets password
    },
  },
};
</script>

<style>
header {
  z-index: 6 !important;
}
</style>
