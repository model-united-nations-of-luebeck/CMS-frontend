<script setup>
import { useDisplay } from "vuetify";
const { mobile } = useDisplay();

const props = defineProps({
  birthday: String,
});

const emit = defineEmits(["update:birthday"]);

const updateBirthday = (date) => {
  emit("update:birthday", date.toLocaleDateString("en-CA")); // format date as YYYY-MM-DD
};

const disableInvalidDates = (date) => {
  const now = new Date();
  // if the date is younger than 10 years or in the future, disable it
  if (date > now.setFullYear(now.getFullYear() - 10)) {
    console.debug("date is in the future", date, new Date().getFullYear() - 10);
    return false;
  }
  // if the date is older than 100 years, disable it
  if (date < now.setFullYear(now.getFullYear - 100)) {
    return false;
  }
  return true;
};

const rules = [(v) => !!v || "Please enter your date of birth in the format YYYY-MM-DD."];
</script>

<template>
  <v-locale-provider locale="en-CA">
    <v-date-input
      label="date of birth"
      clearable
      view-mode="month"
      hide-weekdays
      :year="new Date().getFullYear() - 18"
      :allowed-dates="disableInvalidDates"
      :density="mobile ? 'compact' : 'default'"
      :model-value="props.birthday ? new Date(props.birthday) : null"
      :rules="rules"
      @update:modelValue="updateBirthday"
    >
      <template v-slot:append>
        <v-icon
          icon="mdi-help-circle"
          v-tooltip="{
            text: 'We will only use your date of birth to check your age with respect to German law.',
            openOnClick: true,
          }"
        >
        </v-icon>
      </template>
    </v-date-input>
  </v-locale-provider>
</template>
