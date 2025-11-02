<script>
export default {
  props: {
    image: {
      type: Object,
    },
    coordinates: {
      type: Object,
    },
    transitions: {
      type: Object,
    },
    stencilCoordinates: {
      type: Object,
    },
  },
  computed: {
    style() {
      const { height, width, left, top } = this.stencilCoordinates;
      const style = {
        width: `${width}px`,
        height: `${height}px`,
        transform: `translate(${left}px, ${top}px)`,
      };
      if (this.transitions && this.transitions.enabled) {
        style.transition = `${this.transitions.time}ms ${this.transitions.timingFunction}`;
      }
      return style;
    },
  },
};
</script>

<template>
  <div class="rectangle-stencil" :style="style"></div>
</template>

<style>
.rectangle-stencil {
  cursor: move;
  background-image: url("../assets/images/mask.png");
  background-size: cover;
  background-repeat: no-repeat;
}
.vue-advanced-cropper__foreground {
  opacity: 0.25 !important;
}
</style>
