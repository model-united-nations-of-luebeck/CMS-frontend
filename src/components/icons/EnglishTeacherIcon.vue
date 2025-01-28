<script setup>
const props = defineProps({
  english_teacher: Boolean,
});
</script>

<template>
  <v-icon
    :class="{ hidden: !props.english_teacher }"
    color="success"
    icon="mdi-school"
    v-tooltip:bottom="'English teacher'"
  ></v-icon>
</template>
