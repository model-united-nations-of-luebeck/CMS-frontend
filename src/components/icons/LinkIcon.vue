<script setup>
import { toast } from "vue3-toastify";
import "vue3-toastify/dist/index.css";

const props = defineProps({
  link: String,
});
</script>

<template>
  <v-btn
    variant="plain"
    icon="mdi-link-variant"
    v-if="props.link"
    v-tooltip:bottom-center="{
      text: `(Click to copy registration link to your clipboard)`,
      openOnClick: true,
    }"
    v-clipboard:copy="props.link"
    v-clipboard:success="
      () => {
        toast.success('Registration link was copied successfully', {
          position: toast.POSITION.BOTTOM_CENTER,
          style: 'width: auto',
        });
      }
    "
    v-clipboard:error="
      (e) =>
        toast.error('Copying registration link failed' + e.text, {
          position: toast.POSITION.BOTTOM_CENTER,
        })
    "
  ></v-btn>
</template>
