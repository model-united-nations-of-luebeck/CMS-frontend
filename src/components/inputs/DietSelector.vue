<script setup>
import { useDisplay } from "vuetify";
const { mobile } = useDisplay();

const props = defineProps({
  diet: String,
});

const emit = defineEmits(["update:diet"]);

const updateDiet = (value) => {
  emit("update:diet", value);
};
</script>

<template>
  <v-input prepend-icon="mdi-food" direction="horizontal">
    <v-label>Which diet do you prefer?</v-label>
  </v-input>
  <div id="toggle-wrapper">
    <v-btn-toggle
      class="px-10"
      divided
      variant="outlined"
      color="primary"
      :density="mobile ? 'compact' : 'default'"
      :model-value="props.diet"
      @update:modelValue="updateDiet"
    >
      <v-btn value="vegan">
        <span class="hidden-sm-and-down">vegan</span>

        <v-icon :end="!mobile"> mdi-sprout </v-icon>
      </v-btn>

      <v-btn value="vegetarian">
        <span class="hidden-sm-and-down">vegetarian</span>

        <v-icon :end="!mobile">mdi-egg</v-icon>
      </v-btn>

      <v-btn value="meat">
        <span class="hidden-sm-and-down">meat</span>

        <v-icon :end="!mobile"> mdi-food-steak</v-icon>
      </v-btn>
    </v-btn-toggle>
  </div>

  <div id="selection-wrapper" v-if="mobile">
    <span class="text-button">{{ props.diet }}</span>
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
