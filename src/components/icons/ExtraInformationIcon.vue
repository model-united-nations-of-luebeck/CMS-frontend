<script setup>
const props = defineProps({
  extras: String,
});
</script>

<template>
  <v-icon
    :class="{ hidden: !props.extras }"
    color="primary"
    icon="mdi-information-variant"
    v-tooltip:bottom="{ text: `${props.extras}`, openOnClick: true }"
  ></v-icon>
</template>
