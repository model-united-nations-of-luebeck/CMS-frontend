<script setup>
const props = defineProps({
  ambassador: Boolean,
});
</script>

<template>
  <v-icon
    :class="{ hidden: !props.ambassador }"
    color="#00ff00"
    icon="mdi-shield-star-outline"
    v-tooltip:bottom="'Ambassador of delegation'"
  ></v-icon>
</template>
