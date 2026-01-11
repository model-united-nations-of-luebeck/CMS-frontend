<script setup>
import { useDisplay } from "vuetify";
const { mobile } = useDisplay();

const props = defineProps({
  first_name: String,
  last_name: String,
});

const emit = defineEmits(["update:first_name", "update:last_name"]);

const updateFirstName = (event) => {
  emit("update:first_name", event.target.value);
};
const updateLastName = (event) => {
  emit("update:last_name", event.target.value);
};

const rules = [
  (v) => !!v || "Please enter a name.",
  (v) => v.length <= 50 || "The name is too long. Please shorten it.",
  (v) => /^[^0-9]*$/.test(v) || "Please enter a valid name without numbers.", //no numbers, but any special characters
];
</script>

<template>
  <v-text-field
    label="Given name"
    hint="Given name"
    prepend-icon="mdi-account"
    append-icon="mdi-space"
    :model-value="props.first_name"
    :rules="rules"
    :density="mobile ? 'compact' : 'default'"
    @input="updateFirstName"
  >
  </v-text-field>

  <v-text-field
    label="Family name"
    hint="Family name"
    prepend-icon="mdi-space"
    :model-value="props.last_name"
    :rules="rules"
    :density="mobile ? 'compact' : 'default'"
    @input="updateLastName"
  >
    <template v-slot:append>
      <v-icon
        icon="mdi-help-circle"
        v-tooltip="{
          text: 'These names will appear on your badge and certificate. Enter any middle names as additional given names or leave them out.',
          openOnClick: true,
        }"
      >
      </v-icon>
    </template>
  </v-text-field>
</template>
