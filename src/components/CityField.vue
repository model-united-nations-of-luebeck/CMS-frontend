<script setup>
import { useDisplay } from 'vuetify'
const { mobile } = useDisplay()

const props = defineProps({
  city: String
})

const emit = defineEmits(['update:city'])

const updateCity = (event) => {
  emit('update:city', event.target.value)
}

const rules = [
  (v) => !!v || `Please enter your school's city name.`,
  (v) => v.length <= 50 || 'The name is too long.'
]
</script>

<template>
  <v-text-field
    label="City"
    hint="City name"
    prepend-icon="mdi-white"
    color="primary"
    :model-value="props.city"
    :rules="rules"
    :density="mobile ? 'compact' : 'default'"
    @input="updateCity"
  >
  </v-text-field>
</template>
