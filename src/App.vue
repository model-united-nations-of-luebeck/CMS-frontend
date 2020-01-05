<template>
  <v-app>
    <v-app-bar app color="primary" dark>
      <div class="d-flex align-center">
        <v-btn icon @click="drawer = !drawer">
          <v-icon>mdi-menu</v-icon>
        </v-btn>
        <span>
          Conference Management System
        </span>
      </div>

      <v-spacer></v-spacer>

      <v-btn icon>
        <v-icon>mdi-dots-vertical</v-icon>
      </v-btn>
    </v-app-bar>

    <v-navigation-drawer
      expand-on-hover
      width="250px"
      v-model="drawer"
      style="margin-top:64px; z-index:1"
    >
      <v-list nav dense>
        <v-list-item-group v-model="selected" color="primary">
          <div v-for="item in items" :key="item.title">
            <v-list-item disabled>
              <v-list-item-action> </v-list-item-action>
              <v-list-item-content>
                <v-list-item-title>{{ item.title | upper }}</v-list-item-title>
              </v-list-item-content>
            </v-list-item>

            <v-list-item
              link
              v-for="subItem in item.items"
              :key="subItem.title"
              :to="subItem.action"
            >
              <v-list-item-action>
                <v-icon>{{ subItem.icon }}</v-icon>
              </v-list-item-action>
              <v-list-item-content>
                <v-list-item-title>{{ subItem.title }}</v-list-item-title>
              </v-list-item-content>
            </v-list-item>

            <v-divider></v-divider>
          </div>
        </v-list-item-group>
      </v-list>
    </v-navigation-drawer>

    <main
      style="height: calc(100vh - 64px); width: 100vw; margin-top:64px; position:absolute;"
    >
      <router-view></router-view>
    </main>
  </v-app>
</template>

<script>
export default {
  name: "App",

  components: {},
  methods: {},
  filters: {
    upper: function(value) {
      if (!value) return "";
      value = value.toString();
      return value.toUpperCase();
    }
  },
  data() {
    return {
      selected: "",
      drawer: null,
      isRegistration: true,
      mitem: 1,
      mitems: [
        { text: "Real-Time", icon: "mdi-clock" },
        { text: "Audience", icon: "mdi-account" },
        { text: "Conversions", icon: "mdi-flag" }
      ],
      items: [
        {
          title: "Registration",
          icon: "mdi-account-plus",
          action: "registration",
          items: [
            { title: "Schools", icon: "mdi-bank", action: "schools" },
            {
              title: "Delegates",
              icon: "mdi-account-tie",
              action: "delegates"
            },
            {
              title: "MUN-Directors",
              icon: "mdi-school",
              action: "mun-directors"
            },
            {
              title: "Executives",
              icon: "mdi-account-settings",
              action: "executives"
            },
            {
              title: "Student Officers",
              icon: "mdi-account-settings",
              action: "student-officers"
            },
            { title: "Staffs", icon: "mdi-account", action: "staffs" },
            { title: "Advisors", icon: "mdi-account-star", action: "advisors" }
          ]
        },
        {
          title: "Administration",
          icon: "mdi-folder-settings-variant",
          action: "administration",
          items: [
            { title: "Member Organizations", icon: "mdi-flag-variant" },
            { title: "Forums", icon: "mdi-forum" },
            { title: "Country Allocation", icon: "mdi-gesture-double-tap" },
            { title: "Locations", icon: "mdi-map-marker" },
            { title: "Events", icon: "mdi-calendar" },
            { title: "Conference Settings", icon: "mdi-web" }
          ]
        },
        { title: "Secretariat", icon: "mdi-printer" }
      ],
      text: "Jan"
    };
  }
};
</script>
