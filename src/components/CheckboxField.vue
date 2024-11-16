<script setup>
import { useDisplay } from 'vuetify'
const { mobile } = useDisplay()

const props = defineProps({
  value: Boolean,
  label: String,
  hint: String,
  icon: String
})

const emit = defineEmits(['update:value'])

const updateValue = (value) => {
  emit('update:value', value)
}
</script>

<template>
  <v-checkbox
    :model-value="props.value"
    :label="props.label"
    :hint="props.hint"
    :prepend-icon="props.icon"
    color="primary"
    :density="mobile ? 'compact' : 'default'"
    @update:modelValue="updateValue"
  ></v-checkbox>
</template>
