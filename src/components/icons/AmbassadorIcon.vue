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
    v-tooltip:bottom="{ text: 'Ambassador of delegation', openOnClick: true }"
  ></v-icon>
</template>
