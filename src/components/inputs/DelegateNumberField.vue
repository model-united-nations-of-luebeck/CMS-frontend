<script setup>
import { toast } from "vue3-toastify";
import { useDisplay } from "vuetify";
const { mobile } = useDisplay();

const props = defineProps({
  requested: Number,
});

const emit = defineEmits(["update:requested"]);

const updateRequested = (value) => {
  if (value == 49) {
    toast.warning("Maximum number of delegates per school is 49.", {
      position: toast.POSITION.BOTTOM_CENTER,
      style: "width: auto",
    });
  }
  emit("update:requested", value);
};

const rules = [
  (v) => !!v || "Number of Delegates is required",
  (v) => v > 0 || "Number of Delegates must be greater than 0",
  (v) => v <= 49 || "Number of Delegates must be less than 50",
  (v) => v % 1 === 0 || "Number of Delegates must be an integer",
];
</script>

<template>
  <v-number-input
    label="Number of Delegates"
    prepend-icon="mdi-account-group"
    controlVariant="split"
    color="primary"
    :density="mobile ? 'compact' : 'default'"
    min="1"
    max="49"
    :modelValue="props.requested"
    :rules="rules"
    @update:modelValue="updateRequested"
  >
  </v-number-input>
</template>
