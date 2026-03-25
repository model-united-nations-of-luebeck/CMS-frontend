<script setup>
import { ref, useTemplateRef, inject } from "vue";
const http = inject("backend_instance");
import axios from "axios";
const pdfs_http = axios.create({
  ...http.defaults,
  baseURL: http.defaults.baseURL.replace(/\/?api\/?$/, "/pdfs/"),
});
import { useDisplay } from "vuetify";
const { mobile } = useDisplay();
import { onClickOutside } from "@vueuse/core";
import BadgePhotoCropper from "../../components/BadgePhotoCropper.vue";

const valid = ref(true);
const name = ref("");
const school_or_affiliation_name = ref("");
const position = ref("");
const color = ref(null);
const picture = ref(null);
const media_consent = ref(false);
const page_size = ref("A4");

const swatches = [
  ["#FF0000"],
  ["#FFFF00"],
  ["#00FF00"],
  ["#0000FF"],
  ["#FF00FF"],
  ["#00FFFF"],
  ["#FFFFFF"],
  ["#000000"],
  ["#FFA500"],
  ["#800080"],
];

const show_color_picker = ref(false);
const color_field = useTemplateRef("color-field");
const color_picker = useTemplateRef("color-picker");
onClickOutside(
  color_field,
  () => {
    show_color_picker.value = false;
  },
  { ignore: [color_picker] },
);

const rules = {
  name: [
    (v) => !!v || "Please enter the name.",
    (v) => v.length <= 50 || "The name is too long. Please shorten it.",
    (v) => /^[^0-9]*$/.test(v) || "Please enter a valid name without numbers.",
  ],
  school_or_affiliation_name: [
    (v) => !!v || "Please enter the school or affiliation name.",
    (v) => v.length <= 50 || "The school or affiliation name is too long. Please shorten it.",
  ],
  position: [
    (v) => !!v || "Please enter the position.",
    (v) => v.length <= 50 || "The position is too long. Please shorten it.",
  ],
};

let backend_url = import.meta.env.VITE_BACKEND_URL.replace(/\/?api\/?$/, "/pdfs/");

async function printCustomBadge() {
  const form = new FormData();
  form.append("first_name", name.value.split(" ")[0] || "");
  form.append("last_name", name.value.split(" ")[1] || "");
  form.append("affiliation", school_or_affiliation_name.value);
  form.append("position", position.value);
  form.append("color", color.value);
  form.append("media_consent", media_consent.value);
  form.append("page_size", page_size.value);
  form.append("photo", picture.value);

  const response = await pdfs_http.post("custom_badge", form, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
    responseType: "blob",
  });

  const url = URL.createObjectURL(new Blob([response.data], { type: "application/pdf" }));
  window.open(url, "_blank");
}
</script>

<template>
  <div id="container">
    <v-breadcrumbs :items="[{ title: 'Printing', to: { name: 'printing' } }, { title: 'Badges' }]">
      <template v-slot:prepend>
        <v-icon icon="mdi-card-account-details" start disabled></v-icon>
      </template>
    </v-breadcrumbs>

    <v-alert border="start" color="primary" variant="tonal">
      Every participant receives a badge upon registration. As badges are used for identification of
      conference participants they should be treated with upmost care.
    </v-alert>

    <v-container style="width: 100vw; display: inline">
      <v-row>
        <v-col cols="12" md="6">
          <v-card title="Badges from data" class="h-100">
            <v-card-text>
              Generate Badges per role. DIN A4 sized sheets with 8 badges each (default) or each
              badge on an single page of size 85 mm * 55 mm (legacy).

              <v-list lines="two">
                <v-list-item
                  title="Delegates"
                  prepend-icon="mdi-account-tie"
                  subtitle="Sorted by school"
                >
                  <template v-slot:append>
                    <v-btn
                      :href="`${backend_url}delegate_badges?page_size=A7`"
                      target="_blank"
                      variant="tonal"
                      color="primary"
                      title="Print Delegate Badges"
                      prepend-icon="mdi-printer"
                      class="mr-10"
                    >
                      single
                    </v-btn>

                    <v-btn
                      :href="`${backend_url}delegate_badges`"
                      target="_blank"
                      variant="flat"
                      color="primary"
                      title="Print Delegate Badges"
                      prepend-icon="mdi-printer"
                    >
                      DIN A4
                    </v-btn>
                  </template>
                </v-list-item>
                <v-list-item
                  title="MUN Directors"
                  prepend-icon="mdi-school"
                  subtitle="Sorted by school"
                >
                  <template v-slot:append>
                    <v-btn
                      :href="`${backend_url}mun_director_badges?page_size=A7`"
                      target="_blank"
                      variant="tonal"
                      color="primary"
                      title="Print MUN Directors Badges"
                      prepend-icon="mdi-printer"
                      class="mr-10"
                    >
                      single
                    </v-btn>

                    <v-btn
                      :href="`${backend_url}mun_director_badges`"
                      target="_blank"
                      variant="flat"
                      color="primary"
                      title="Print MUN-Directors Badges"
                      prepend-icon="mdi-printer"
                    >
                      DIN A4
                    </v-btn>
                  </template>
                </v-list-item>
                <v-list-item
                  title="Executives"
                  prepend-icon="mdi-account-settings"
                  subtitle="Sorted by position"
                >
                  <template v-slot:append>
                    <v-btn
                      :href="`${backend_url}executive_badges?page_size=A7`"
                      target="_blank"
                      variant="tonal"
                      color="primary"
                      title="Print Executive Badges"
                      prepend-icon="mdi-printer"
                      class="mr-10"
                    >
                      single
                    </v-btn>

                    <v-btn
                      :href="`${backend_url}executive_badges`"
                      target="_blank"
                      variant="flat"
                      color="primary"
                      title="Print Executive Badges"
                      prepend-icon="mdi-printer"
                    >
                      DIN A4
                    </v-btn>
                  </template>
                </v-list-item>
                <v-list-item
                  title="Student Officers"
                  prepend-icon="mdi-account-settings"
                  subtitle="Sorted by forum"
                >
                  <template v-slot:append>
                    <v-btn
                      :href="`${backend_url}student_officer_badges?page_size=A7`"
                      target="_blank"
                      variant="tonal"
                      color="primary"
                      title="Print Student Officer Badges"
                      prepend-icon="mdi-printer"
                      class="mr-10"
                    >
                      single
                    </v-btn>

                    <v-btn
                      :href="`${backend_url}student_officer_badges`"
                      target="_blank"
                      variant="flat"
                      color="primary"
                      title="Print Student Officer Badges"
                      prepend-icon="mdi-printer"
                    >
                      DIN A4
                    </v-btn>
                  </template>
                </v-list-item>
                <v-list-item title="Staff" prepend-icon="mdi-account" subtitle="Sorted by position">
                  <template v-slot:append>
                    <v-btn
                      :href="`${backend_url}staff_badges?page_size=A7`"
                      target="_blank"
                      variant="tonal"
                      color="primary"
                      title="Print Staff Badges"
                      prepend-icon="mdi-printer"
                      class="mr-10"
                    >
                      single
                    </v-btn>

                    <v-btn
                      :href="`${backend_url}staff_badges`"
                      target="_blank"
                      variant="flat"
                      color="primary"
                      title="Print Staff Badges"
                      prepend-icon="mdi-printer"
                    >
                      DIN A4
                    </v-btn>
                  </template>
                </v-list-item>
                <v-list-item
                  title="Advisors"
                  prepend-icon="mdi-account-star"
                  subtitle="Sorted by name"
                >
                  <template v-slot:append>
                    <v-btn
                      :href="`${backend_url}advisor_badges?page_size=A7`"
                      target="_blank"
                      variant="tonal"
                      color="primary"
                      title="Print Advisor Badges"
                      prepend-icon="mdi-printer"
                      class="mr-10"
                    >
                      single
                    </v-btn>

                    <v-btn
                      :href="`${backend_url}advisor_badges`"
                      target="_blank"
                      variant="flat"
                      color="primary"
                      title="Print Advisor Badges"
                      prepend-icon="mdi-printer"
                    >
                      DIN A4
                    </v-btn>
                  </template>
                </v-list-item>
              </v-list>
            </v-card-text>
          </v-card>
        </v-col>
        <v-col cols="12" md="6">
          <v-card title="Custom Badges" class="h-100" style="overflow-y: scroll">
            <v-card-text>
              On special occasions, custom badges can be generated, for example for guests, sponsors
              etc. But don't simply generate a custom badge for participants, as this data won't be
              saved, e.g. for printing a certificate later.

              <v-form v-model="valid" validate-on="blur" @submit.prevent="printCustomBadge">
                <v-container fluid>
                  <v-row no-gutters="">
                    <v-col cols="12" sm="12" md="4">
                      <v-text-field
                        class="mt-14"
                        label="Name"
                        hint="Given and family name"
                        prepend-icon="mdi-account"
                        color="primary"
                        v-model="name"
                        :rules="rules.name"
                        :density="mobile ? 'compact' : 'default'"
                      >
                      </v-text-field>
                      <v-text-field
                        label="School (or Affiliation)"
                        hint="Name of school or affiliation"
                        prepend-icon="mdi-school"
                        color="primary"
                        v-model="school_or_affiliation_name"
                        :rules="rules.school_or_affiliation_name"
                        :density="mobile ? 'compact' : 'default'"
                      >
                      </v-text-field>
                      <v-text-field
                        label="Position"
                        hint="Position or guest"
                        prepend-icon="mdi-account-tie"
                        color="primary"
                        v-model="position"
                        :rules="rules.position"
                        :density="mobile ? 'compact' : 'default'"
                      >
                      </v-text-field>

                      <v-text-field
                        ref="color-field"
                        label="Color"
                        hint="Pick a color for the badge"
                        v-model="color"
                        @click="show_color_picker = true"
                        @focus="show_color_picker = true"
                      >
                        <template v-slot:prepend>
                          <v-icon
                            icon="mdi-palette"
                            :style="{
                              color: color,
                            }"
                          >
                          </v-icon>
                        </template>
                      </v-text-field>

                      <v-input prepend-icon="mdi-blank" v-if="show_color_picker">
                        <v-color-picker
                          ref="color-picker"
                          v-model="color"
                          mode="hex"
                          :modes="['hex', 'rgb']"
                          hide-canvas
                          :dot-size="5"
                          show-swatches
                          :swatches="swatches"
                        >
                        </v-color-picker>
                      </v-input>

                      <v-checkbox
                        label="Media Consent given"
                        v-model="media_consent"
                        prepend-icon="mdi-camera"
                        color="primary"
                      ></v-checkbox>

                      <v-input
                        prepend-icon="mdi-book-open-page-variant"
                        hint="Select a page size"
                        label="Page size"
                      >
                        <v-btn-toggle
                          v-model="page_size"
                          color="primary"
                          variant="outlined"
                          divided
                        >
                          <v-btn value="single">
                            <v-icon start>mdi-badge-account-horizontal</v-icon>
                            single
                          </v-btn>

                          <v-btn value="A4">
                            <v-icon start>mdi-view-grid-outline</v-icon>
                            DIN A4
                          </v-btn>
                        </v-btn-toggle>
                      </v-input>
                    </v-col>

                    <v-col
                      cols="12"
                      sm="12"
                      md="4"
                      :offset="mobile ? 0 : 1"
                      :class="mobile ? '' : 'badge-photo'"
                    >
                      <BadgePhotoCropper v-model:image="picture"></BadgePhotoCropper>
                    </v-col>
                  </v-row>

                  <v-row no-gutters class="justify-center">
                    <div>
                      <span
                        v-if="!picture"
                        id="missing-badge-photo"
                        class="text-error"
                        style="display: block; text-align: center"
                        >Please upload a badge photo.</span
                      >

                      <v-btn
                        id="submit-btn"
                        color="primary"
                        prepend-icon="mdi-printer"
                        :disabled="!valid"
                        @click="printCustomBadge"
                        >Print custom badge</v-btn
                      >
                    </div>
                  </v-row>
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

<style></style>
