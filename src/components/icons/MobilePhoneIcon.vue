<script setup>
import { toast } from "vue3-toastify";
import "vue3-toastify/dist/index.css";

const props = defineProps({
  mobile: String,
});
</script>

<template>
  <v-icon
    v-if="props.mobile"
    v-tooltip:bottom-center="
      `${props.mobile}  (Click to copy mobile phone number to your clipboard)`
    "
    v-clipboard:copy="props.mobile"
    v-clipboard:success="
      () => {
        toast.success('Mobile phone number was copied successfully', {
          position: toast.POSITION.BOTTOM_CENTER,
          style: 'width: auto',
        });
      }
    "
    v-clipboard:error="
      (e) =>
        toast.error('Copying mobile phone number failed' + e.text, {
          position: toast.POSITION.BOTTOM_CENTER,
        })
    "
  >
    mdi-phone
  </v-icon>
</template>
