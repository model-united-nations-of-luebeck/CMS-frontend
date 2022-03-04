<template>
  <v-app>
    <v-app-bar app color="primary" dark>
      <div class="nav-headline d-flex align-center">
        <v-icon>mdi-bank</v-icon>
        <span> Conference Management System </span>
      </div>

      <v-spacer />

      <v-btn v-if="!isAuthenticated" icon>
        <v-icon>mdi-dots-vertical</v-icon>
      </v-btn>
      <v-btn v-if="isAuthenticated" icon @click="logout">
        <v-icon>mdi-logout</v-icon>
      </v-btn>
    </v-app-bar>

    <v-navigation-drawer
      v-if="isAuthenticated"
      expand-on-hover
      fixed
      width="250px"
      style="padding-top: 64px; z-index: 5;"
      class="elevation-4"
    >
      <v-list nav dense>
        <v-list-item-group v-model="selected" color="primary">
          <div v-for="item in items" :key="item.title">
            <v-list-item disabled>
              <v-list-item-action />
              <v-list-item-content>
                <v-list-item-title>{{ item.title | upper }}</v-list-item-title>
              </v-list-item-content>
            </v-list-item>

            <v-list-item
              v-for="subItem in item.items"
              :key="subItem.title"
              link
              :to="subItem.action"
            >
              <v-list-item-action>
                <v-icon>{{ subItem.icon }}</v-icon>
              </v-list-item-action>
              <v-list-item-content>
                <v-list-item-title>{{ subItem.title }}</v-list-item-title>
              </v-list-item-content>
            </v-list-item>

            <v-divider />
          </div>
        </v-list-item-group>
      </v-list>
    </v-navigation-drawer>

    <main style="width: 100vw; padding-top: 64px;">
      <v-container v-if="!isAuthenticated" class="fill-height" fluid>
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
                <v-alert v-if="loggedout" dismissible type="success">
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

      <transition name="slide-fade">
        <router-view v-if="isAuthenticated" />
      </transition>
    </main>
  </v-app>
</template>

<script>
import axios from "axios";
import Vue from "vue";

export default {
  name: "App",
  components: {},
  filters: {
    upper(value) {
      if (!value) return "";
      value = value.toString();
      return value.toUpperCase();
    },
  },
  data() {
    return {
      selected: "",
      drawer: null,
      token: null,
      username: null,
      password: null,
      error: null,
      loggedout: null,
      issues: null,
      advisors: null,
      items: [
        {
          title: "Registration",
          icon: "mdi-account-plus",
          items: [
            { title: "Schools", icon: "mdi-bank", action: "schools" },
            {
              title: "Delegates",
              icon: "mdi-account-tie",
              action: "delegates",
            },
            {
              title: "MUN-Directors",
              icon: "mdi-school",
              action: "mun-directors",
            },
            {
              title: "Executives",
              icon: "mdi-account-settings",
              action: "executives",
            },
            {
              title: "Student Officers",
              icon: "mdi-account-settings",
              action: "student-officers",
            },
            { title: "Staffs", icon: "mdi-account", action: "staffs" },
            { title: "Advisors", icon: "mdi-account-star", action: "advisors" },
          ],
        },
        {
          title: "Administration",
          icon: "mdi-folder-settings-variant",
          items: [
            {
              title: "Member Organizations",
              icon: "mdi-flag-variant",
              action: "member-organizations",
            },
            { title: "Forums", icon: "mdi-forum", action: "forums" },
            {
              title: "Issues",
              icon: "mdi-format-list-bulleted-type",
              action: "issues",
            },
            {
              title: "Country Allocation",
              icon: "mdi-gesture-double-tap",
              action: "country-allocation",
            },
            { title: "Locations", icon: "mdi-map-marker", action: "locations" },
            { title: "Events", icon: "mdi-calendar", action: "events" },
            {
              title: "Conference Settings",
              icon: "mdi-web",
              action: "conference",
            },
          ],
        },
        {
          title: "Secretariat",
          icon: "mdi-printer",
          items: [
            {
              title: "Printing",
              icon: "mdi-printer",
              action: "printing",
            },
            {
              title: "Insights",
              icon: "mdi-lightbulb-on",
              action: "insights",
            },
          ],
        },
      ],
    };
  },
  computed: {
    isAuthenticated() {
      return this.token ? true : false;
    },
  },
  methods: {
    /**
     * API Request to obtain auth token
     * TODO: API base domain
     */
    async login() {
      const instance = axios.create({
        baseURL: "https://munoltom.pythonanywhere.com",
      });
      Vue.prototype.$http = instance;

      try {
        const { data } = await this.$http.post("/api-token-auth/", {
          username: "Tom", //this.username,
          password: "I'mlovingMUNOLinstead", //this.password
        });

        this.token = data.token;
        this.$http.defaults.headers.common[
          "Authorization"
        ] = `Token ${this.token}`;
        this.loggedout = false;
        this.error = null;
      } catch (error) {
        this.error = error; //show error message
        this.token = null;
        delete this.$http.defaults.headers.common["Authorization"];
        this.password = null;
      }

      this.password = null; //resets password
    },
    logout() {
      this.token = null;
      this.username = null;
      this.loggedout = true;
    },
  },
};
</script>

<style>
.v-application--wrap > header {
  z-index: 6 !important;
}

.nav-headline > span {
  margin: 10px;
}

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
