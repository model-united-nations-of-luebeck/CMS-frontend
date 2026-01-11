<script setup>
const props = defineProps({
  items: Array[Object],
  name: {
    type: String,
    default: "data.json",
  },
});

const downloadJSON = function () {
  const json_encoded = JSON.stringify(props.items, null, 4);
  const blob = new Blob([json_encoded], { type: "application/json" });
  return URL.createObjectURL(blob);
};
</script>

<template>
  <v-btn
    v-if="props.items && props.items?.length"
    icon="mdi-download"
    :download="props.name"
    :href="downloadJSON()"
    variant="plain"
    color="primary"
    v-tooltip:top="{ text: 'download selected items as JSON', openOnClick: true }"
  ></v-btn>
</template>
