<script setup>
import { ref } from 'vue'
import { useDisplay } from 'vuetify'
import { predefined_help_keywords } from '../stores/advisors'

const { mobile } = useDisplay()

const props = defineProps({
  help: Array[String]
})

const search = ref('')

const emit = defineEmits(['update:help'])

const updateHelp = (value) => {
  emit('update:help', value)
}

const rules = [
  (v) =>
    v.length > 0 || 'You want to be a conference advisor, please enter at least one support area.'
]
</script>

<template>
  <v-combobox
    clearable
    chips
    multiple
    :density="mobile ? 'compact' : 'default'"
    prepend-icon="mdi-handshake"
    label="Support"
    hint="In which areas would you like to support the team?"
    hide-selected
    :hide-no-data="false"
    :delimiters="[',', ';']"
    :items="predefined_help_keywords"
    :model-value="props.help"
    @update:modelValue="updateHelp"
    v-model:search="search"
    :rules="rules"
  >
    <template v-slot:no-data>
      <v-list-item :density="mobile ? 'compact' : 'default'" lines="2">
        <v-list-item-title :density="mobile ? 'compact' : 'default'">
          No results matching "<strong>{{ search }}</strong
          >". Press <kbd>enter</kbd> to create a new one.
        </v-list-item-title>
      </v-list-item>
    </template>
  </v-combobox>
</template>
