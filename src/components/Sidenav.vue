<template>
  <v-navigation-drawer
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
            :to="'/manage/' + subItem.action"
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
</template>

<script>
export default {
  name: "Sidenav",
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
      issues: null,
      advisors: null,
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
          action: "administration",
          items: [
            {
              title: "Member Organizations",
              icon: "mdi-flag-variant",
              action: "member-organizations",
            },
            { title: "Forums", icon: "mdi-forum" },
            {
              title: "Issues",
              icon: "mdi-format-list-bulleted-type",
              action: "issues",
            },
            { title: "Country Allocation", icon: "mdi-gesture-double-tap" },
            { title: "Locations", icon: "mdi-map-marker", action: "locations" },
            { title: "Events", icon: "mdi-calendar" },
            { title: "Conference Settings", icon: "mdi-web", action: "/" },
          ],
        },
        { title: "Secretariat", icon: "mdi-printer" },
      ],
    };
  },
};
</script>

<style scoped>
.nav-headline > span {
  margin: 10px;
}
</style>
