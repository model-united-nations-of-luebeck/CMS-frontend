<script setup>
const props = defineProps({
  room: Object,
});
</script>

<template>
  <v-chip
    v-if="props?.room?.id"
    v-tooltip:bottom="props?.room?.floor + 'floor'"
    :to="{
      name: 'room-detail',
      params: { room_id: props?.room?.id },
    }"
  >
    {{ props?.room?.room_number }}
  </v-chip>
  <v-chip v-else>Room not set</v-chip>
</template>
