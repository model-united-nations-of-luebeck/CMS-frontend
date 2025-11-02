<script setup>
import { useDisplay } from "vuetify";
const { mobile } = useDisplay();

const props = defineProps({
  street: String,
});

const emit = defineEmits(["update:street"]);

const updateStreet = (event) => {
  emit("update:street", event.target.value);
};

const rules = [
  (v) => !!v || `Please enter your school's street name and house number.`,
  (v) => v.length <= 50 || "The name is too long. Please shorten it.",
];
</script>

<template>
  <v-text-field
    label="Street name & house number"
    hint="Street name & house number"
    prepend-icon="mdi-map-marker"
    color="primary"
    :model-value="props.street"
    :rules="rules"
    :density="mobile ? 'compact' : 'default'"
    @input="updateStreet"
  >
  </v-text-field>
</template>
