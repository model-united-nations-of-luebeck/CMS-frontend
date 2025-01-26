<script setup>
const props = defineProps({
  ambassador: Boolean,
});
</script>

<template>
  <v-icon
    :class="{ hidden: !props.ambassador }"
    color="#ebbe4d"
    icon="mdi-shield-star-outline"
    v-tooltip:bottom="'Ambassador of delegation'"
  ></v-icon>
</template>
