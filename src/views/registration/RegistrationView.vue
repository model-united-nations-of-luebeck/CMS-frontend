<script setup>
const conference_abbr = import.meta.env.VITE_CONFERENCE_ABBREVIATION;
</script>

<template>
  <div class="registration">
    <v-container> Participant Registration </v-container>
    <router-view></router-view>
  </div>
</template>

<style scoped></style>
