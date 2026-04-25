<script setup>
const props = defineProps({
  icon: String,
  title: String,
  emails: String,
});
</script>

<template>
  <v-row>
    <v-col cols="12" md="3" class="d-flex align-center">
      <v-icon start>{{ props.icon }}</v-icon>
      <b>{{ props.title }}</b>
    </v-col>
    <v-col cols="12" md="9">
      <v-text-field
        density="comfortable"
        variant="outlined"
        hide-details
        :model-value="props.emails"
      >
        <template v-slot:append>
          <v-tooltip text="Copy to clipboard" open-on-click>
            <template v-slot:activator="{ props }">
              <v-btn
                v-bind="props"
                variant="icon"
                color="primary"
                icon="mdi-content-copy"
                v-clipboard:copy="props.emails"
              ></v-btn>
            </template>
          </v-tooltip>
        </template>
      </v-text-field>
    </v-col>
  </v-row>
</template>
