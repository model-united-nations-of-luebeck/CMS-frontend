<script setup>
import { useDisplay } from "vuetify";
const { mobile } = useDisplay();

const props = defineProps({
  email: String,
});

const emit = defineEmits(["update:email"]);

const updateEmail = (event) => {
  emit("update:email", event.target.value);
};

const rules = [
  (v) => !!v || "Please enter your e-mail address.",
  (v) =>
    /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(v) ||
    "Please enter a valid e-mail address.",
];
</script>

<template>
  <v-text-field
    label="E-mail address"
    type="email"
    prepend-icon="mdi-email"
    :density="mobile ? 'compact' : 'default'"
    :model-value="props.email"
    @input="updateEmail"
    :rules="rules"
  >
    <template v-slot:append>
      <v-icon
        icon="mdi-help-circle"
        v-tooltip="{
          text: 'We will only use your e-mail address to send you important information related to the conference, such as research reports, handbooks and your certificate.',
          openOnClick: true,
        }"
      >
      </v-icon>
    </template>
  </v-text-field>
</template>
