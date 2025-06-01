<script setup>
import { ref } from "vue";

const items = ref([
  {
    title: "REGISTRATION",
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
    title: "ADMINISTRATION",
    icon: "mdi-folder-settings-variant",
    action: "administration",
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
      { title: "Events", icon: "mdi-calendar" },
      { title: "Conference Settings", icon: "mdi-web", action: "conference" },
    ],
  },
  { title: "SECRETARIAT", icon: "mdi-printer" },
]);

const drawer = ref(null);
const rail = ref(true);

const collapse = () => {
  console.log("collapse");
  // rail.value = true
};
</script>

<template>
  <v-navigation-drawer
    expand-on-hover
    :rail="rail"
    v-model="drawer"
    elevation="2"
    @update:rail="(v) => console.log(v)"
  >
    <v-list density="compact" nav>
      <div v-for="item in items" :key="item.title">
        <v-list-item disabled :title="item.title" prepend-icon="mdi-white">
        </v-list-item>
        <v-list-item
          v-for="subItem in item.items"
          :key="subItem.title"
          link
          :to="'/management/' + subItem.action"
          :prepend-icon="subItem.icon"
          :title="subItem.title"
          @click.stop="collapse"
        ></v-list-item>
        <v-divider></v-divider>
      </div>
    </v-list>

    <template v-slot:append>
      <v-list>
        <v-list-item title="(c) MUNOL" prepend-icon="mdi-white"></v-list-item>
      </v-list>
    </template>
  </v-navigation-drawer>

  <RouterView v-slot="{ Component }">
    <v-slide-x-transition>
      <keep-alive>
        <component :is="Component" id="component" />
      </keep-alive>
    </v-slide-x-transition>
  </RouterView>
</template>

<style scoped>
#component {
  padding: 16px;
}
</style>
