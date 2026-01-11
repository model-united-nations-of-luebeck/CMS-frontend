<script setup>
const props = defineProps({
  pronouns: String,
  gender: String,
  first_name: String,
  last_name: String,
});
</script>

<template>
  <b
    v-if="props.pronouns"
    v-tooltip:bottom="{ text: `${props.gender} (${props.pronouns})`, openOnClick: true }"
    >{{ props.first_name }} {{ props.last_name }}</b
  >
  <b v-else v-tooltip:bottom="{ text: `${props.gender}`, openOnClick: true }"
    >{{ props.first_name }} {{ props.last_name }}</b
  >
</template>
