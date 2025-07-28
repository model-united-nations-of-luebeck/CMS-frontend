<script setup>
const props = defineProps({
  org: Object,
});
</script>

<template>
  <v-chip
    v-tooltip:bottom="props?.org?.official_name"
    :to="{
      name: 'member-organization-detail',
      params: { member_organization_id: props?.org?.id },
    }"
  >
    <template v-slot:prepend>
      <v-avatar
        start
        v-if="props?.org?.flag"
        :image="props?.org?.flag"
      ></v-avatar>
    </template>
    {{ props?.org?.placard_name }}
  </v-chip>
</template>
