<script setup>
const props = defineProps({
  media_consent_time: String,
});
</script>

<template>
  <v-icon
    v-if="props.media_consent_time"
    icon="mdi-camera"
    color="success"
    v-tooltip:bottom="{ text: 'Media consent given', openOnClick: true }"
  ></v-icon>
  <v-icon
    v-else
    icon="mdi-camera-off"
    color="error"
    v-tooltip:bottom="{ text: 'Media consent not given', openOnClick: true }"
  ></v-icon>
</template>
