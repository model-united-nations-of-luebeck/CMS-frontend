<script setup>
import { useDisplay } from "vuetify";
const { mobile } = useDisplay();

const props = defineProps({
  extras: String,
});

const emit = defineEmits(["update:extras"]);

const updateExtras = (event) => {
  emit("update:extras", event.target.value);
};

const rules = [
  (v) => !v || v.length <= 50000 || "The text is too long. Please shorten it.",
];
</script>

<template>
  <v-textarea
    prepend-icon="mdi-pen-plus"
    label="Additional information"
    hint="e.g. dietary restrictions, allergies, etc. that the kitchen needs to know or that your host family needs to know"
    :density="mobile ? 'compact' : 'default'"
    :model-value="props.extras"
    @input="updateExtras"
    :rules="rules"
  ></v-textarea>
</template>
