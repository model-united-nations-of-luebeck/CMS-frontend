<script setup>
import { ref, watch } from "vue";
import { useDisplay } from "vuetify";
const { mobile } = useDisplay();

const props = defineProps({ pronouns: String });
const defaultPronouns = ref([
  { title: "don't specify", value: "don't specify", selected: true },
  { title: "they/them", value: "they/them" },
  { title: "she/her", value: "she/her" },
  { title: "he/him", value: "he/him" },
  { title: "custom", value: "custom" },
]);

const emit = defineEmits(["update:pronouns"]);
const updatePronouns = (pronouns) => {
  emit("update:pronouns", pronouns);
};
const updateCustomPronouns = (event) => {
  emit("update:pronouns", event.target.value);
};

const internalSelectedPronouns = ref(defaultPronouns.value[0].value);

watch(
  () => props.pronouns,
  (pronouns) => {
    if (pronouns === "") {
      // if no pronouns are set, set default to "don't specify"
      internalSelectedPronouns.value = defaultPronouns.value[0].value;
    } else {
      if (
        defaultPronouns.value.findIndex((item) => item.value === pronouns) == -1
      ) {
        // if pronouns are not in the default list, set to custom
        internalSelectedPronouns.value = defaultPronouns.value[4].value;
      } else {
        internalSelectedPronouns.value = pronouns;
      }
    }
  },
);

const rules = ref([
  // must have a / in between
  (v) =>
    v.split("/").length === 2 ||
    "Please enter your subject and possessive pronouns separated by /",
]);
</script>

<template>
  <v-select
    :model-value="internalSelectedPronouns"
    label="Select your pronouns"
    prepend-icon="mdi-hand-wave"
    :items="defaultPronouns"
    item-title="title"
    item-value="value"
    :density="mobile ? 'compact' : 'default'"
    @update:modelValue="updatePronouns"
  >
    <template v-slot:append>
      <v-icon
        icon="mdi-help-circle"
        v-tooltip="
          'By specifying your pronouns we can make sure to address you in the way you would like to. Also, we try to use include this information on the badges so that all participant can use your pronouns.'
        "
      >
      </v-icon>
    </template>
  </v-select>

  <!-- only show custom pronouns field if custom is selected (index > 3) or entered value is not in the default list (-1) -->
  <v-text-field
    v-if="internalSelectedPronouns == defaultPronouns[4].value"
    label="Custom pronouns"
    hint="Please enter your custom subject and possessive pronouns pronouns, separated by /"
    prepend-icon="mdi-pencil"
    append-icon="mdi-space"
    @input="updateCustomPronouns"
    :density="mobile ? 'compact' : 'default'"
    :rules="rules"
  ></v-text-field>
</template>

<style scoped></style>
