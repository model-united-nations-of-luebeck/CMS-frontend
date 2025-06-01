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
    label="Additional information, e.g. dietary restrictions, allergies, etc."
    hint="everything that we, kitchen or your host family needs to know"
    :density="mobile ? 'compact' : 'default'"
    :model-value="props.extras"
    @input="updateExtras"
    :rules="rules"
  >
    <template v-slot:append>
      <v-icon
        icon="mdi-help-circle"
        v-tooltip="
          'If you have a deviating name in your passport, please enter it here.'
        "
      >
      </v-icon>
    </template>
  </v-textarea>
</template>
