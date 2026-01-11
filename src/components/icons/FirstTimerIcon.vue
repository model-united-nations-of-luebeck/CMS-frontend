<script setup>
const props = defineProps({
  first_timer: Boolean,
});
</script>

<template>
  <v-icon
    :class="{ hidden: !props.first_timer }"
    color="primary"
    icon="mdi-account-question"
    v-tooltip:bottom="{ text: 'First timer', openOnClick: true }"
  ></v-icon>
</template>
