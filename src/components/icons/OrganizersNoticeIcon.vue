<script setup>
const props = defineProps({
  organizers_notice_time: String,
});
</script>

<template>
  <v-icon
    v-if="props.organizers_notice_time"
    icon="mdi-gavel"
    color="success"
    v-tooltip:bottom="{ text: 'Organizers notice confirmed', openOnClick: true }"
  ></v-icon>
  <v-icon
    v-else
    icon="mdi-gavel"
    color="error"
    v-tooltip:bottom="{ text: 'Organizers notice not confirmed', openOnClick: true }"
  ></v-icon>
</template>
