<script setup>
// import { inject } from "vue";
// const http = inject("backend_instance");
// import axios from "axios";
// const pdfs_http = axios.create({
//   ...http.defaults,
//   baseURL: http.defaults.baseURL.replace(/\/?api\/?$/, "/pdfs/"),
// });
let backend_url = import.meta.env.VITE_BACKEND_URL.replace(/\/?api\/?$/, "/pdfs/");
</script>

<template>
  <div id="container">
    <v-breadcrumbs :items="[{ title: 'Printing', to: { name: 'printing' } }, { title: 'Lists' }]">
      <template v-slot:prepend>
        <v-icon icon="mdi-table-check" start disabled></v-icon>
      </template>
    </v-breadcrumbs>

    <v-container style="width: 100vw; display: inline">
      <v-row>
        <v-col cols="12" md="6">
          <v-card title=" Lists" class="h-100">
            <v-card-text>
              <v-alert border="start" color="primary" variant="tonal">
                To check attendance of delegates in forum and plenary sessions, student officers can
                use these lists to tick off presence of delegates.
              </v-alert>

              <v-list lines="two">
                <v-list-item
                  title="Schools (including delegations names)"
                  prepend-icon="mdi-bank"
                  subtitle="Sorted by school name"
                >
                  <template v-slot:append>
                    <v-btn
                      :href="`${backend_url}schools_list`"
                      target="_blank"
                      color="primary"
                      title="Print Schools List"
                      prepend-icon="mdi-printer"
                      class="mr-10"
                    >
                      Print
                    </v-btn>
                  </template>
                </v-list-item>

                <v-list-item
                  title="Issues"
                  prepend-icon="mdi-format-list-bulleted-type"
                  subtitle="Sorted by forum"
                >
                  <template v-slot:append>
                    <v-btn
                      :href="`${backend_url}issues_list`"
                      target="_blank"
                      color="primary"
                      title="Print Issues List"
                      prepend-icon="mdi-printer"
                      class="mr-10"
                    >
                      Print
                    </v-btn>
                  </template>
                </v-list-item>

                <v-list-item
                  title="Roll Call List for Forum Sessions"
                  prepend-icon="mdi-forum"
                  subtitle="Per forum sorted by official member organization name"
                >
                  <template v-slot:append>
                    <v-btn
                      :href="`${backend_url}roll_call_list_forums`"
                      target="_blank"
                      color="primary"
                      title="Print Forum Roll Call List"
                      prepend-icon="mdi-printer"
                      class="mr-10"
                    >
                      Print
                    </v-btn>
                  </template>
                </v-list-item>

                <v-list-item
                  title="Roll Call List for Plenary Sessions"
                  prepend-icon="mdi-account-group"
                  subtitle="Per plenary sorted by official member organization name"
                >
                  <template v-slot:append>
                    <v-btn
                      :href="`${backend_url}roll_call_list_plenaries`"
                      target="_blank"
                      color="primary"
                      title="Print Plenary Roll Call List"
                      prepend-icon="mdi-printer"
                      class="mr-10"
                    >
                      Print
                    </v-btn>
                  </template>
                </v-list-item>
              </v-list>
            </v-card-text>
          </v-card>
        </v-col>

        <v-col cols="12" md="6">
          <v-card title="Internal Lists" class="h-100">
            <v-card-text>
              <v-alert border="start" color="warning" variant="tonal">
                Only share theses lists internally within the executive team. They contain sensitive
                information such as contact details.
              </v-alert>

              <v-list lines="two">
                <v-list-item
                  title="Registration List (Delegates and MUN-Directors)"
                  prepend-icon="mdi-account-group"
                  subtitle="Sorted by school, then grouped by position, then sorted by first name"
                >
                  <template v-slot:append>
                    <v-btn
                      :href="`${backend_url}registration_list`"
                      target="_blank"
                      color="primary"
                      title="Print Registration List"
                      prepend-icon="mdi-printer"
                      class="mr-10"
                    >
                      Print
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
                      :href="`${backend_url}executives_list`"
                      target="_blank"
                      color="primary"
                      title="Print Executives List"
                      prepend-icon="mdi-printer"
                      class="mr-10"
                    >
                      Print
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
                      :href="`${backend_url}student_officers_list`"
                      target="_blank"
                      color="primary"
                      title="Print Student Officers List"
                      prepend-icon="mdi-printer"
                      class="mr-10"
                    >
                      Print
                    </v-btn>
                  </template>
                </v-list-item>

                <v-list-item
                  title="MUN-Directors"
                  prepend-icon="mdi-school"
                  subtitle="Sorted by school"
                >
                  <template v-slot:append>
                    <v-btn
                      :href="`${backend_url}mun_directors_list`"
                      target="_blank"
                      color="primary"
                      title="Print MUN-Directors List"
                      prepend-icon="mdi-printer"
                      class="mr-10"
                    >
                      Print
                    </v-btn>
                  </template>
                </v-list-item>

                <v-list-item
                  title="Staffs"
                  prepend-icon="mdi-account"
                  subtitle="Grouped by position, sorted by first name"
                >
                  <template v-slot:append>
                    <v-btn
                      :href="`${backend_url}staffs_list`"
                      target="_blank"
                      color="primary"
                      title="Print Staffs List"
                      prepend-icon="mdi-printer"
                      class="mr-10"
                    >
                      Print
                    </v-btn>
                  </template>
                </v-list-item>

                <v-list-item
                  title="Advisors"
                  prepend-icon="mdi-account-star"
                  subtitle="Sorted by first name"
                >
                  <template v-slot:append>
                    <v-btn
                      :href="`${backend_url}advisors_list`"
                      target="_blank"
                      color="primary"
                      title="Print Advisors List"
                      prepend-icon="mdi-printer"
                      class="mr-10"
                    >
                      Print
                    </v-btn>
                  </template>
                </v-list-item>

                <v-list-item
                  title="Participants List"
                  prepend-icon="mdi-account-group"
                  subtitle="Sorted by first name, then last name"
                >
                  <template v-slot:append>
                    <v-btn
                      :href="`${backend_url}participants_list`"
                      target="_blank"
                      color="primary"
                      title="Print Participants List"
                      prepend-icon="mdi-printer"
                      class="mr-10"
                    >
                      Print
                    </v-btn>
                  </template>
                </v-list-item>

                <v-list-item
                  title="Allergies List"
                  prepend-icon="mdi-food"
                  subtitle="Contains provided information about allergies, sorted by participant's first name"
                >
                  <template v-slot:append>
                    <v-btn
                      :href="`${backend_url}allergy_list`"
                      target="_blank"
                      color="primary"
                      title="Print Allergies List"
                      prepend-icon="mdi-printer"
                      class="mr-10"
                    >
                      Print
                    </v-btn>
                  </template>
                </v-list-item>
              </v-list>
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
