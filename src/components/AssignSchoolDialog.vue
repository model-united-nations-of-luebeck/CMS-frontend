<script setup>
import { useSchoolsStore } from '../stores/schools'
import { useDelegatesStore } from '../stores/delegates'
import { ref } from 'vue'

const schoolsStore = useSchoolsStore()
schoolsStore.getSchools()
const delegatesStore = useDelegatesStore()
delegatesStore.getDelegates()

const props = defineProps({
  model: Boolean,
  title: String,
  text: String
})
const emits = defineEmits(['ok-clicked', 'cancel-clicked'])

const itemProps = function (item) {
  return {
    title: item.name,
    subtitle: item.requested
      ? `Requested delegates ${item.requested} / assigned delegates ${
          delegatesStore.delegates.filter((delegate) => delegate.school == item.id).length
        }`
      : ''
  }
}

const school = ref(null)
</script>

<template>
  <v-dialog max-width="500" :model-value="props.model">
    <v-card :title="props.title">
      <v-card-text>
        {{ props.text }}

        <v-select
          v-model="school"
          :item-props="itemProps"
          :items="[{ name: 'unassign school', id: null }, ...schoolsStore.schools]"
          label="School"
        >
        </v-select>
      </v-card-text>

      <v-card-actions>
        <v-spacer></v-spacer>

        <v-btn text="Cancel" @click="emits('cancel-clicked')"></v-btn>
        <v-btn text="Select" @click="emits('ok-clicked', $event, school.id)"></v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<style scoped></style>
