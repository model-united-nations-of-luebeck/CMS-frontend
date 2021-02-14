<template>
  <v-app-bar app color="primary" dark>
    <v-app-bar-nav-icon><v-icon>mdi-bank</v-icon></v-app-bar-nav-icon>
    <v-toolbar-title>{{ $route.matched[0].name }}</v-toolbar-title>
    <v-spacer />
    <v-btn v-if="!isAuthenticated" icon>
      <v-icon>mdi-dots-vertical</v-icon>
    </v-btn>
    <v-btn v-else icon @click="logout">
      <v-icon>mdi-logout</v-icon>
    </v-btn>
    <template
      v-if="!$route.matched[0].meta.hideTabs && isAuthenticated"
      v-slot:extension
    >
      <v-tabs grow>
        <v-tab
          v-for="(t, i) in tabs"
          :key="i"
          :to="$route.matched[0].path + '/' + t.path"
        >
          {{
            $route.matched[0].meta.enumerateTabs
              ? i + 1 + ". " + t.name
              : t.name
          }}
        </v-tab>
      </v-tabs>
    </template>
  </v-app-bar>
</template>

<script>
export default {
  name: "Nav",
  props: {
    isAuthenticated: { type: Boolean, required: true },
  },
  computed: {
    /** Returns the children of the current topmost route */
    tabs() {
      for (const route of this.$router.options.routes) {
        if (route.path == this.$route.matched[0].path) return route.children;
      }
      return [];
    },
  },
  methods: {
    logout() {
      sessionStorage.clear();
      window.location.reload(false);
    },
  },
};
</script>

<style scoped></style>
