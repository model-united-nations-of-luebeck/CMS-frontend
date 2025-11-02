<script setup>
const props = defineProps({
  picture: String,
});
</script>

<template>
  <div v-if="props.picture">
    <v-img :src="props.picture" height="250px">
      <template v-slot:placeholder>
        <div class="d-flex align-center justify-center fill-height">
          <v-progress-circular color="grey-lighten-4" indeterminate></v-progress-circular>
        </div>
      </template>
    </v-img>
  </div>
  <div v-else>No badge photo uploaded yet.</div>
</template>
