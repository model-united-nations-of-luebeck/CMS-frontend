<script setup>
import { useDisplay } from 'vuetify'
const { mobile } = useDisplay()

const props = defineProps({
  accommodation: String,
  label: String
})

const emit = defineEmits(['update:accommodation'])

const updateAccommodation = (value) => {
  emit('update:accommodation', value)
}
</script>

<template>
  <v-input prepend-icon="mdi-home" direction="horizontal">
    <v-label>{{ props.label }}</v-label>
  </v-input>
  <div id="toggle-wrapper">
    <v-btn-toggle
      class="px-10"
      divided
      variant="outlined"
      color="primary"
      :density="mobile ? 'compact' : 'default'"
      :model-value="props.accommodation"
      @update:modelValue="updateAccommodation"
    >
      <v-btn value="guest-family">
        <span class="hidden-sm-and-down">Guest family</span>

        <v-icon :end="!mobile"> mdi-home-heart </v-icon>
      </v-btn>

      <v-btn value="hostel">
        <span class="hidden-sm-and-down">Youth Hostel</span>

        <v-icon :end="!mobile">mdi-bed</v-icon>
      </v-btn>

      <v-btn value="other">
        <span class="hidden-sm-and-down">Self-organized</span>

        <v-icon :end="!mobile"> mdi-home </v-icon>
      </v-btn>
    </v-btn-toggle>
  </div>

  <div id="selection-wrapper" v-if="mobile">
    <span class="text-button">{{ props.accommodation }}</span>
  </div>
</template>

<style scoped>
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
