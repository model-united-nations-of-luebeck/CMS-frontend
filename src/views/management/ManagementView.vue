<script setup>
import { ref, onMounted, inject } from "vue";
import { msalService } from "../../useAuth";
import { msalInstance, state } from "../../msalConfig";
const { login, logout, handleRedirect } = msalService();
const emit = defineEmits(["show-logout"]);
const http = inject("backend_instance");

defineExpose({
  logout,
});

const conference_abbr = import.meta.env.VITE_CONFERENCE_ABBREVIATION;
const loginDialog = ref(true);

const handleLogin = async () => {
  await login();
};

const initialize = async () => {
  try {
    await msalInstance.initialize();
  } catch (error) {
    console.log("Initialization error", error);
  }
};

onMounted(async () => {
  await initialize();
  await handleRedirect();
});

import { watch } from "vue";

watch(
  () => state.isAuthenticated,
  (isAuthenticated) => {
    loginDialog.value = !isAuthenticated;
    emit("show-logout", isAuthenticated);
    if (isAuthenticated && state.user.idToken) {
      // get token here and set it in the axios instance
      http.defaults.headers.common[
        "Authorization"
      ] = `Bearer ${state.user.idToken}`;
    }
  },
);

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
</script>

<template>
  <div v-if="state.isAuthenticated">
    <v-navigation-drawer
      expand-on-hover
      :rail="true"
      v-model="drawer"
      elevation="2"
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
          ></v-list-item>
          <v-divider></v-divider>
        </div>
      </v-list>

      <template v-slot:append>
        <v-list>
          <v-divider></v-divider>
          <v-list-item
            v-if="state.isAuthenticated"
            :title="state.user?.username"
            subtitle="Current user"
            prepend-icon="mdi-account"
          >
          </v-list-item>
          <v-list-item
            :title="conference_abbr"
            prepend-icon="mdi-copyright"
          ></v-list-item>
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
  </div>

  <v-dialog v-model="loginDialog" max-width="550" persistent>
    <v-card>
      <v-card-title class="headline">Login</v-card-title>
      <v-card-text>
        <p>Please log in to access the conference management system.</p>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn text @click="handleLogin" color="primary"
          >Single Sign On via {{ conference_abbr }} SharePoint</v-btn
        >
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<style scoped>
#component {
  padding: 16px;
}
</style>
