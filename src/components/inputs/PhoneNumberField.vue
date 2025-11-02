<script setup>
import { useDisplay } from "vuetify";
const { mobile } = useDisplay();

const props = defineProps({
  phone: String,
});

const emit = defineEmits(["update:phone"]);

const updatePhone = (event) => {
  emit("update:phone", event.target.value);
};
</script>

<template>
  <v-phone-input
    label="Mobile phone number"
    type="tel"
    prepend-icon="mdi-cellphone"
    :density="mobile ? 'compact' : 'default'"
    :model-value="props.phone"
    countryIconMode="svg"
    @input="updatePhone"
    guessCountry="CountryGuesser"
    displayFormat="e164"
    :invalidMessage="
      ({ label, example }) => `This is not a valid mobile phone number (example: ${example}).`
    "
  >
    <template v-slot:append>
      <v-icon
        icon="mdi-help-circle"
        v-tooltip="
          'We will only use your mobile phone number in urgent cases if contacting you via mail is not possible. This will most likely only be during the conference.'
        "
      >
      </v-icon>
    </template>
  </v-phone-input>
</template>
