<script setup>
import { useDisplay } from 'vuetify'
const { mobile } = useDisplay()

const props = defineProps({
  name: String
})

const emit = defineEmits(['update:name'])

const updateName = (event) => {
  emit('update:name', event.target.value)
}

const rules = [
  (v) => !!v || `Please enter your school's name.`,
  (v) => v.length <= 50 || 'The name is too long. Please shorten it.',
  (v) => /^[^0-9]*$/.test(v) || 'Please enter a valid name without numbers.' //no numbers, but any special characters
]
</script>

<template>
  <v-text-field
    label="School name"
    hint="Name of your school"
    prepend-icon="mdi-school"
    color="primary"
    :model-value="props.name"
    :rules="rules"
    :density="mobile ? 'compact' : 'default'"
    @input="updateName"
  >
    <template v-slot:append>
      <v-icon
        icon="mdi-help-circle"
        v-tooltip="
          'Please make sure that the school name is written correctly. It will appear on the badges and certificates.'
        "
      >
      </v-icon>
    </template>
  </v-text-field>
</template>
