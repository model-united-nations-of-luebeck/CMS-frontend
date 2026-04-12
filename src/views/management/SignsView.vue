<script setup>
import { ref, inject } from "vue";
const http = inject("backend_instance");
import axios from "axios";
const pdfs_http = axios.create({
  ...http.defaults,
  baseURL: http.defaults.baseURL.replace(/\/?api\/?$/, "/pdfs/"),
});
const valid = ref(true);
const label = ref("");
const page_size = ref("A4");

const rules = {
  label: [
    (v) => !!v || "Please enter the label.",
    (v) => v.length <= 100 || "The label is too long. Please shorten it.",
  ],
};

async function printSign() {
  const params = new URLSearchParams({
    label: label.value,
    pagesize: page_size.value,
  });

  const response = await pdfs_http.get(`sign?${params}`, {
    responseType: "blob",
  });

  const url = URL.createObjectURL(new Blob([response.data], { type: "application/pdf" }));
  window.open(url, "_blank");
}
</script>

<template>
  <div id="container">
    <v-breadcrumbs :items="[{ title: 'Printing', to: { name: 'printing' } }, { title: 'Signs' }]">
      <template v-slot:prepend>
        <v-icon icon="mdi-sign-direction" start disabled></v-icon>
      </template>
    </v-breadcrumbs>

    <v-alert border="start" color="primary" variant="tonal">
      This site allows you to print signs for the conference, for example for the registration desk,
      secretariat, lunch room, rest rooms, etc. to guide attendees the direction through the venue.
      You can enter a label for the sign and select a page size.
    </v-alert>

    <v-container style="width: 100vw; display: inline">
      <v-row>
        <v-col cols="12" md="6">
          <v-card title="Sign Generator" class="h-100">
            <v-card-text>
              Press <v-kbd elevation="0">enter</v-kbd> in the label box to create multi-line labels
              <v-form v-model="valid" validate-on="blur" @submit.prevent="printSign">
                <v-container fluid>
                  <v-col md="6">
                    <v-row no-gutters="">
                      <v-textarea
                        label="Label"
                        hint="enter custom label"
                        prepend-icon="mdi-sign-direction"
                        color="primary"
                        rows="3"
                        clearable
                        no-resize
                        v-model="label"
                        :rules="rules.label"
                      >
                      </v-textarea>
                    </v-row>
                    <v-row no-gutters>
                      <v-input
                        prepend-icon="mdi-book-open-page-variant"
                        hint="Select a sign size"
                        label="Sign size"
                      >
                        <v-btn-toggle
                          v-model="page_size"
                          color="primary"
                          variant="outlined"
                          divided
                        >
                          <v-btn value="A4">
                            <v-icon start>mdi-view-grid-outline</v-icon>
                            DIN A4
                          </v-btn>

                          <v-btn value="A3">
                            <v-icon start>mdi-tag</v-icon>
                            DIN A3
                          </v-btn>
                        </v-btn-toggle>
                      </v-input>
                    </v-row>

                    <v-row no-gutters class="justify-center">
                      <v-btn
                        id="submit-btn"
                        color="primary"
                        prepend-icon="mdi-printer"
                        :disabled="!valid"
                        @click="printSign"
                        >Print sign</v-btn
                      >
                    </v-row>
                  </v-col>
                </v-container>
              </v-form>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
    </v-container>

    <p></p>
  </div>
</template>

<style>
.v-badge {
  margin: 0px 20px;
}
</style>
