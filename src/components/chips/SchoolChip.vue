<script setup>
const props = defineProps({
  school: Object,
});
</script>

<template>
  <v-chip
    v-if="props?.school?.id"
    variant="text"
    :to="{
      name: 'school-detail',
      params: { school_id: props?.school?.id },
    }"
    v-tooltip:bottom="`${props?.school?.city}, ${props?.school?.country}`"
  >
    {{ props?.school?.name }}
  </v-chip>
  <v-chip v-else>School not set</v-chip>
</template>
