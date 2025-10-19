<script setup>
import { ref, onMounted, inject, watch, onUnmounted } from "vue";
import { msalService } from "../../useAuth";
import { msalInstance, state } from "../../msalConfig";
const { login, logout, handleRedirect } = msalService();
const emit = defineEmits(["show-logout"]);
const http = inject("backend_instance");
import { useTheme } from "vuetify";
const theme = useTheme();
import { useDisplay } from "vuetify";
const { mobile } = useDisplay();

const drawer = ref(null);

const toggleDrawer = () => {
  drawer.value = !drawer.value;
};

defineExpose({ logout, toggleDrawer });

const conference_abbr = import.meta.env.VITE_CONFERENCE_ABBREVIATION;
const loginDialog = ref(true);
let refreshTimer;

const handleLogin = async () => {
  await login();
};

const initialize = async () => {
  try {
    await msalInstance.initialize();
  } catch (error) {
    console.error("Initialization error", error);
  }
};

onMounted(async () => {
  await initialize();
  await handleRedirect();
});

onUnmounted(() => {
  if (refreshTimer) {
    clearTimeout(refreshTimer);
  }
});

watch(
  () => state.isAuthenticated,
  async (isAuthenticated) => {
    loginDialog.value = !isAuthenticated;
    emit("show-logout", isAuthenticated);

    if (isAuthenticated && state.user.idToken) {
      // get token here and set it in the axios instance
      http.defaults.headers.common[
        "Authorization"
      ] = `Bearer ${state.user.idToken}`;
    }

    const now = new Date();
    const refreshIn =
      state.user.idTokenClaims.exp * 1000 - now.getTime() - 60000; // Refresh 1 minute before expiration

    if (refreshTimer) {
      clearTimeout(refreshTimer);
    }
    refreshTimer = setTimeout(
      async () => {
        try {
          const account = msalInstance.getAllAccounts()[0];
          const response = await msalInstance.acquireTokenSilent({
            scopes: ["User.Read"],
            account,
          });

          state.user.idToken = response.idToken;
          state.user.idTokenClaims = response.idTokenClaims;
          http.defaults.headers.common[
            "Authorization"
          ] = `Bearer ${response.idToken}`;
        } catch (error) {
          logout();
        }
      },
      Math.max(0, refreshIn),
    );
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
      { title: "Locations", icon: "mdi-map-marker" },
      { title: "Events", icon: "mdi-calendar" },
      { title: "Conference Settings", icon: "mdi-web", action: "conference" },
    ],
  },
  {
    title: "SECRETARIAT",
    icon: "mdi-printer",
    items: [
      {
        title: "Printing",
        icon: "mdi-printer",
      },
      {
        title: "Insights",
        icon: "mdi-lightbulb-on",
        action: "insights",
      },
      {
        title: "Participant Search",
        icon: "mdi-account-search",
        action: "participant-search",
      },
    ],
  },
]);
</script>

<template>
  <div v-if="state.isAuthenticated">
    <v-navigation-drawer
      :expand-on-hover="!mobile"
      :rail="!mobile"
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
            :to="subItem.action ? '/management/' + subItem.action : null"
            :disabled="!subItem.action"
            :prepend-icon="subItem.icon"
            :title="subItem.title"
          ></v-list-item>
          <v-divider></v-divider>
        </div>
      </v-list>

      <v-list density="compact" nav>
        <v-list-item disabled title="SETTINGS" prepend-icon="mdi-white">
        </v-list-item>
        <v-list-item
          v-if="state.isAuthenticated"
          :title="state.user?.username"
          subtitle="Current user"
          prepend-icon="mdi-account"
        >
        </v-list-item>
        <v-list-item
          prepend-icon="mdi-theme-light-dark"
          :title="`${theme.name.value} mode`"
        >
          <template v-slot:append>
            <v-switch @click="theme.toggle()" hide-details></v-switch>
          </template>
        </v-list-item>
        <v-list-item
          :title="conference_abbr"
          prepend-icon="mdi-copyright"
        ></v-list-item>
      </v-list>
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

:deep(.v-navigation-drawer__content::-webkit-scrollbar) {
  display: none !important; /* Safari and Chrome */
}

:deep(.v-navigation-drawer__content) {
  -ms-overflow-style: none; /* Internet Explorer 10+ */
  scrollbar-width: none; /* Firefox, Safari 18.2+, Chromium 121+ */
}
</style>
