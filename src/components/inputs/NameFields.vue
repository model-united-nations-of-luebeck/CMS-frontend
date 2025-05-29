<script setup>
import { useDisplay } from 'vuetify'
const { mobile } = useDisplay()

const props = defineProps({
  first_name: String,
  last_name: String
})

const emit = defineEmits(['update:first_name', 'update:last_name'])

const updateFirstName = (event) => {
  emit('update:first_name', event.target.value)
}
const updateLastName = (event) => {
  emit('update:last_name', event.target.value)
}

const rules = [
  (v) => !!v || 'Please enter your first name.',
  (v) => v.length <= 50 || 'The name is too long. Please shorten it.',
  (v) => /^[^0-9]*$/.test(v) || 'Please enter a valid name without numbers.' //no numbers, but any special characters
]
</script>

<template>
  <v-text-field
    label="First name"
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
    label="Last name"
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
        v-tooltip="
          'Please make sure that your name is written correctly. It will appear on the badges and certificates. Enter any middle names as additional first names or leave them out.'
        "
      >
      </v-icon>
    </template>
  </v-text-field>
</template>
