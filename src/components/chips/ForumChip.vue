<script setup>
const props = defineProps({
  forum: Object,
});
</script>

<template>
  <v-chip
    v-if="props?.forum?.id"
    v-tooltip:bottom="props?.forum?.name"
    :to="{
      name: 'forum-view',
      params: { forum_id: props?.forum?.id },
    }"
  >
    {{ props?.forum?.abbreviation }}
  </v-chip>
  <v-chip v-else>Forum not set</v-chip>
</template>
