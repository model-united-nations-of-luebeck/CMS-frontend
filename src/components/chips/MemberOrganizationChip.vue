<script setup>
const props = defineProps({
  org: Object,
});
</script>

<template>
  <v-chip
    v-tooltip:bottom="{ text: props?.org?.official_name, openOnClick: true }"
    :to="{
      name: 'member-organization-view',
      params: { member_organization_id: props?.org?.id },
    }"
  >
    <template v-slot:prepend>
      <v-avatar lazy start v-if="props?.org?.flag" :image="props?.org?.flag"></v-avatar>
    </template>
    {{ props?.org?.placard_name }}
  </v-chip>
</template>
