<script setup></script>

<template>
  <div class="registration">
    <RouterView v-slot="{ Component }">
      <v-slide-x-transition>
        <component :is="Component" />
      </v-slide-x-transition>
    </RouterView>
  </div>
</template>

<style scoped></style>
