<script setup>
import { useDisplay } from "vuetify";
const { mobile } = useDisplay();

const props = defineProps({
  zipcode: String,
});

const emit = defineEmits(["update:zipcode"]);

const updateZipCode = (event) => {
  emit("update:zipcode", event.target.value);
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
    :model-value="props.zipcode"
    :rules="rules"
    :density="mobile ? 'compact' : 'default'"
    @input="updateZipCode"
  >
  </v-text-field>
</template>
