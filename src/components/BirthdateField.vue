<script setup>
import { useDisplay } from 'vuetify'
const { mobile } = useDisplay()

const props = defineProps({
  birthday: String
})

const emit = defineEmits(['update:birthday'])

const updateBirthday = (date) => {
  emit('update:birthday', date.toISOString().split('T')[0])
}

const disableInvalidDates = (date) => {
  const now = new Date()
  // if the date is younger than 10 years or in the future, disable it
  if (date > now.setFullYear(now.getFullYear() - 10)) {
    console.log('date is in the future', date, new Date().getFullYear() - 10)
    return false
  }
  // if the date is older than 100 years, disable it
  if (date < now.setFullYear(now.getFullYear - 100)) {
    return false
  }
  return true
}

const rules = [
  (v) => !!v || 'Please enter your date of birth.',
  (v) =>
    /^\d{2}\/\d{2}\/\d{4}$/.test(v) ||
    'Please enter a valid date of birth in the format MM/DD/YYYY.'
]
</script>

<template>
  <v-date-input
    label="date of birth"
    clearable
    view-mode="year"
    :year="new Date().getFullYear() - 18"
    :allowed-dates="disableInvalidDates"
    :density="mobile ? 'compact' : 'default'"
    :model-value="new Date(props.birthday)"
    :rules="rules"
    @update:modelValue="updateBirthday"
  >
    <template v-slot:append>
      <v-icon
        icon="mdi-help-circle"
        v-tooltip="
          'We will only use your date of birth to check your age with respect to German law.'
        "
      >
      </v-icon>
    </template>
  </v-date-input>

  <!-- <v-text-field
    label="date of birth"
    prepend-icon="mdi-calendar-today"
    placeholder="DD-MM-YYYY"
    :model-value="props.birthday"
    @input="updateBirthday"
  >
    <template v-slot:append>
      <v-icon
        icon="mdi-help-circle"
        v-tooltip="
          'We will only use your date of birth to check your age with respect to German law.'
        "
      >
      </v-icon>
    </template>
  </v-text-field> -->
</template>
