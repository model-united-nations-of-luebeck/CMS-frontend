<script setup>
import { toast } from "vue3-toastify";
import "vue3-toastify/dist/index.css";

const props = defineProps({
  email: String,
});
</script>

<template>
  <v-icon
    v-if="props.email"
    v-tooltip:bottom-center="
      `${props.email}  (Click to copy e-mail to your clipboard)`
    "
    v-clipboard:copy="props.email"
    v-clipboard:success="
      () => {
        toast.success('E-mail was copied successfully', {
          position: toast.POSITION.BOTTOM_CENTER,
          style: 'width: auto',
        });
      }
    "
    v-clipboard:error="
      (e) =>
        toast.error('Copying E-mail failed' + e.text, {
          position: toast.POSITION.BOTTOM_CENTER,
        })
    "
    color="primary"
    >mdi-email</v-icon
  >
</template>
