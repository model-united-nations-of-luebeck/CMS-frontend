<script setup>
import { useDisplay } from "vuetify";
const { mobile } = useDisplay();

const props = defineProps({
  zip_code: String,
});

const emit = defineEmits(["update:zip_code"]);

const updateZipCode = (event) => {
  emit("update:zip_code", event.target.value);
};

const rules = [
  (v) => !!v || `Please enter your school's ZIP code.`,
  (v) => v.length <= 10 || "The code is too long. ",
];
</script>

<template>
  <v-text-field
    label="ZIP Code"
    hint="ZIP Code"
    prepend-icon="mdi-white"
    color="primary"
    :model-value="props.zip_code"
    :rules="rules"
    :density="mobile ? 'compact' : 'default'"
    @input="updateZipCode"
  >
  </v-text-field>
</template>
