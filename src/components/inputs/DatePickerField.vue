<script setup>
import { ref } from 'vue'
// import { useDate } from 'vuetify' //required to parse dates correctly regardless on the user's timezone
// const dateAdapter = useDate()

const prop = defineProps({
  date: String,
  label: String,
  hint: String,
  prepend_inner_icon: String,
  rules: Array,
  type: String
})
const show_date_picker = ref(false)

const emit = defineEmits(['update:date'])
const updateDate = (date) => {
  console.log('updateDate', date.toISOString())

  const formattedDate = date.toUTCString()
  console.log('formattedDate', formattedDate)
  emit('update:date', formattedDate)
  show_date_picker.value = false
}
</script>

<template>
  <v-menu
    v-model="show_date_picker"
    :close-on-content-click="false"
    transition="scale-transition"
    offset-y
    min-width="auto"
  >
    <template v-slot:activator="{ props }">
      <v-text-field
        :value="prop.date"
        :label="prop.label"
        :hint="prop.hint"
        :prepend-inner-icon="prop.prepend_inner_icon"
        readonly
        v-bind="props"
        :rules="prop.rules"
        required
      ></v-text-field>
    </template>
    <v-date-picker
      color="primary"
      show-adjacent-months
      hide-header
      @update:modelValue="updateDate"
    ></v-date-picker>
  </v-menu>
</template>
