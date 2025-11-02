<script setup>
const props = defineProps({
  model: Number,
  title: String,
  text: String,
});
const emits = defineEmits(["ok-clicked", "cancel-clicked"]);
</script>

<template>
  <v-dialog max-width="500" :model-value="props.model">
    <v-card :title="props.title">
      <v-card-text> {{ props.text }}</v-card-text>

      <v-card-actions>
        <v-spacer></v-spacer>

        <v-btn text="Cancel" @click="emits('cancel-clicked')"></v-btn>
        <v-btn text="OK" @click="emits('ok-clicked')"></v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<style scoped></style>
