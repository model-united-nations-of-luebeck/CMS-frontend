<script setup>
const props = defineProps({
  items: Array[Object],
  name: {
    type: String,
    default: "data.xls",
  },
});
</script>

<template>
  <download-excel
    :data="props.items"
    v-if="props.items && props.items?.length"
    :name="props.name"
  >
    <v-btn
      icon="mdi-microsoft-excel"
      variant="plain"
      color="primary"
      v-tooltip:top="`download items as Excel file (xls)`"
    ></v-btn
  ></download-excel>
</template>
