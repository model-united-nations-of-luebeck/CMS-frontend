<script setup>
import { useDisplay } from 'vuetify'
const { mobile } = useDisplay()

const props = defineProps({
  country: String
})

const emit = defineEmits(['update:country'])

const updateCountry = (event) => {
  emit('update:country', event.target.value)
}

const rules = [
  (v) => !!v || `Please enter your school's country name.`,
  (v) => v.length <= 50 || 'The name is too long.'
]
</script>

<template>
  <v-text-field
    label="Country"
    hint="Country name"
    color="primary"
    prepend-icon="mdi-white"
    :model-value="props.country"
    :rules="rules"
    :density="mobile ? 'compact' : 'default'"
    @input="updateCountry"
  >
    <template v-slot:append>
      <v-icon
        icon="mdi-help-circle"
        v-tooltip="
          'We will normally use emails to contact you, however, having an address is the backup option.'
        "
      >
      </v-icon>
    </template>
  </v-text-field>
</template>
