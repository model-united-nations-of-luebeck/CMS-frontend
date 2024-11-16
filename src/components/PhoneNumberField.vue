<script setup>
import { useDisplay } from 'vuetify'
const { mobile } = useDisplay()

const props = defineProps({
  phone: String
})

const emit = defineEmits(['update:phone'])

const updatePhone = (event) => {
  emit('update:phone', event.target.value)
}

const rules = [
  (v) =>
    /^\+[1-9]\d{1,14}$/.test(v) ||
    "This is not a valid international mobile phone number. Don't forget the country code, e.g. +49!"
]
</script>

<template>
  <v-text-field
    label="Mobile phone number"
    type="tel"
    prepend-icon="mdi-cellphone"
    :density="mobile ? 'compact' : 'default'"
    :model-value="props.phone"
    :rules="rules"
    @input="updatePhone"
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
  </v-text-field>
</template>
