<script setup>
const props = defineProps({
  car: Boolean,
});
</script>

<template>
  <v-icon
    :class="{ hidden: !props.car }"
    color="success"
    icon="mdi-car"
    v-tooltip:bottom="{ text: 'Car available', openOnClick: true }"
  ></v-icon>
</template>
