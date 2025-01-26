<script setup>
import { useDisplay } from 'vuetify'
const { mobile } = useDisplay()

const props = defineProps({
  gender: String
})

const emit = defineEmits(['update:gender'])

const updateGender = (value) => {
  emit('update:gender', value)
}

const genderTranslations = {
  f: 'Female',
  m: 'Male',
  o: 'Diverse'
}
</script>

<template>
  <v-input prepend-icon="mdi-human-greeting-variant" direction="horizontal">
    <v-label>What describes your gender most accurately?</v-label>
  </v-input>
  <div id="toggle-wrapper">
    <v-btn-toggle
      class="px-10"
      divided
      color="primary"
      variant="outlined"
      :density="mobile ? 'compact' : 'default'"
      :model-value="props.gender"
      @update:modelValue="updateGender"
      mandatory
    >
      <v-btn value="f">
        <span class="hidden-sm-and-down">Female</span>

        <v-icon :end="!mobile"> mdi-human-female </v-icon>
      </v-btn>

      <v-btn value="m">
        <span class="hidden-sm-and-down">Male</span>

        <v-icon :end="!mobile">mdi-human-male</v-icon>
      </v-btn>

      <v-btn value="o">
        <span class="hidden-sm-and-down">diverse</span>

        <v-icon :end="!mobile"> mdi-human-non-binary</v-icon>
      </v-btn>
    </v-btn-toggle>
  </div>
  <div id="selection-wrapper" v-if="mobile">
    <span class="text-button">{{ genderTranslations[props.gender] }}</span>
  </div>
</template>

<style scoped>
.v-label {
  white-space: normal;
}

#toggle-wrapper {
  width: 100%;
  display: flex;
  justify-content: center;
}

.v-btn-toggle {
  margin-bottom: 10px;
  margin-top: -10px !important;
}

#selection-wrapper {
  display: flex;
  justify-content: center;
  width: 100%;
}

#selection-wrapper > span {
  margin-top: -10px !important;
}
</style>
