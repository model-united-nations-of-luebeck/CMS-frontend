<template>
  <div>
    <sidenav />
    <router-view />
  </div>
</template>

<script>
import Sidenav from "./Sidenav.vue";

export default {
  name: "Management",
  components: { Sidenav },
};
</script>

<style></style>
