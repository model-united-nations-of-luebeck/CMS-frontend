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
    v-tooltip:bottom="'Car available'"
  ></v-icon>
</template>
