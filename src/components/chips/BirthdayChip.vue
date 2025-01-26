<script setup>
import { getAge } from "../../stores/participants";

const props = defineProps({
  birthday: String,
});

function getAgeColor(birth_date) {
  const age = getAge(birth_date);
  if (age < 16) {
    return "red";
  } else if (age < 18) {
    return "orange";
  } else if (age >= 18) {
    return "green";
  } else {
    return "gray";
  }
}
</script>

<template>
  <v-chip
    v-if="props.birthday"
    variant="tonal"
    :color="getAgeColor(props.birthday)"
  >
    {{ getAge(props.birthday) }}
  </v-chip>
</template>
