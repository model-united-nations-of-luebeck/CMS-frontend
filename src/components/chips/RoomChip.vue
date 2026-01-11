<script setup>
const props = defineProps({
  room: Object,
});
</script>

<template>
  <v-chip
    v-if="props?.room?.id"
    v-tooltip:bottom="{ text: props?.room?.floor + ' floor', openOnClick: true }"
    :to="{
      name: 'room-detail',
      params: { room_id: props?.room?.id },
    }"
  >
    {{ props?.room?.room_number }}
  </v-chip>
  <v-chip v-else>Room not set</v-chip>
</template>
