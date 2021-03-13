<template>
  <v-tooltip
    :left="position == 'left'"
    :right="position == 'right'"
    :bottom="position == 'bottom'"
    :top="position == 'top'"
    :max-width="tooltipWidth"
  >
    <template v-slot:activator="{ on }">
      <v-icon v-on="on" :color="color">{{ icon }}</v-icon>
    </template>
    <div :style="{ textAlign: textAlign }">{{ text }}</div>
  </v-tooltip>
</template>

<script>
export default {
  name: "tooltipped-icon",
  props: {
    icon: String,
    text: String,
    color: String,
    position: {
      type: String,
      default: "bottom",
    },
    tooltipWidth: String,
    textAlign: String,
  },
};
</script>
