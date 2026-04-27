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
import { VueSignaturePad } from "@selemondev/vue3-signature-pad";

const valid = ref(true);
const names = ref("");
const positions = ref("");
const signature = useTemplateRef("signature");
const penColor = ref("#0000FF");

const rules = {
  names: [
    (v) => !!v || "Please enter the signatories name(s).",
    (v) => v.length <= 50 || "The names are too long. Please shorten them.",
    (v) => /^[^0-9]*$/.test(v) || "Please enter a valid name without numbers.",
  ],
  positions: [
    (v) => !!v || "Please enter the positions.",
    (v) => v.length <= 100 || "The position is too long. Please shorten it.",
  ],
};

let backend_url = import.meta.env.VITE_BACKEND_URL.replace(/\/?api\/?$/, "/pdfs/");

async function printCertificates(certificates_url) {
  const form = new FormData();
  form.append("names", names.value);
  form.append("positions", positions.value);
  form.append("signatures", signature.value.toDataURL("image/png"));

  const response = await pdfs_http.post(certificates_url, form, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
    responseType: "blob",
  });

  const url = URL.createObjectURL(new Blob([response.data], { type: "application/pdf" }));
  window.open(url, "_blank");
}

function handleClear() {
  return signature.value?.clearCanvas();
}
function handleUndo() {
  return signature.value?.undo();
}
</script>

<template>
  <div id="container">
    <v-breadcrumbs
      :items="[{ title: 'Printing', to: { name: 'printing' } }, { title: 'Certificates' }]"
    >
      <template v-slot:prepend>
        <v-icon icon="mdi-certificate" start disabled></v-icon>
      </template>
    </v-breadcrumbs>

    <v-alert border="start" color="primary" variant="tonal">
      Every participant receives a certificate of participation after the conference. This site
      allows you to print these certificates, either unsigned (for later manual signing) or signed
      digitally. Certificates are usually printed on thicker paper and in color.
    </v-alert>

    <v-container style="display: inline">
      <v-row>
        <v-col cols="12" md="6">
          <v-card title="Certificates per role" class="h-100">
            <v-card-text>
              <v-list lines="two">
                <h3>Signed by Secretaries-General</h3>
                <v-list-item
                  title="Delegates"
                  prepend-icon="mdi-account-tie"
                  subtitle="Sorted by school"
                >
                  <template v-slot:append>
                    <v-btn
                      @click="printCertificates(`${backend_url}delegate_certificates`)"
                      target="_blank"
                      variant="flat"
                      color="primary"
                      title="Print Delegate Certificates"
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
                      @click="printCertificates(`${backend_url}student_officer_certificates`)"
                      target="_blank"
                      variant="flat"
                      color="primary"
                      title="Print Student Officer Certificates"
                      prepend-icon="mdi-printer"
                    >
                      DIN A4
                    </v-btn>
                  </template>
                </v-list-item>

                <h3>Signed by Conference Managers</h3>
                <v-list-item
                  title="MUN Directors"
                  prepend-icon="mdi-school"
                  subtitle="Sorted by school"
                >
                  <template v-slot:append>
                    <v-btn
                      @click="printCertificates(`${backend_url}mun_director_certificates`)"
                      target="_blank"
                      variant="flat"
                      color="primary"
                      title="Print MUN-Directors Certificates"
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
                      @click="printCertificates(`${backend_url}executive_certificates`)"
                      target="_blank"
                      variant="flat"
                      color="primary"
                      title="Print Executive Certificates"
                      prepend-icon="mdi-printer"
                    >
                      DIN A4
                    </v-btn>
                  </template>
                </v-list-item>

                <v-list-item title="Staff" prepend-icon="mdi-account" subtitle="Sorted by position">
                  <template v-slot:append>
                    <v-btn
                      @click="printCertificates(`${backend_url}staff_certificates`)"
                      variant="flat"
                      color="primary"
                      title="Print Staff Certificates"
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
          <v-card title="Signatures" class="h-100" style="overflow-y: scroll">
            <v-card-text>
              For adding a digital signature to the certificates, you can use the signature pad
              below. Please also enter the names and positions to be displayed below the signature
              on the certificates.

              <v-form v-model="valid" validate-on="blur" @submit.prevent="printCertificates('')">
                <v-container fluid>
                  <v-row no-gutters="">
                    <v-col cols="12" sm="12" md="12">
                      <v-text-field
                        label="Names"
                        hint="Names of the signatories to be displayed below the signature"
                        placeholder="John Smith & Jane Doe"
                        prepend-icon="mdi-account-multiple"
                        color="primary"
                        v-model="names"
                        :rules="rules.names"
                        :density="mobile ? 'compact' : 'default'"
                      >
                      </v-text-field>
                      <v-text-field
                        label="Positions"
                        hint="Positions of the signatories to be displayed below the signature"
                        placeholder="Secretaries-General or Conference Managers MUNOL 20XX"
                        prepend-icon="mdi-account-tie"
                        color="primary"
                        v-model="positions"
                        :rules="rules.positions"
                        :density="mobile ? 'compact' : 'default'"
                      >
                      </v-text-field>

                      <v-input
                        prepend-icon="mdi-signature-freehand"
                        hint="Please sign here"
                        label="Signatures"
                        messages="Please sign in this box"
                        indent-details
                      >
                        <v-card elevation="2" variant="elevated" style="width: 100%">
                          <div class="signature-preview">
                            <VueSignaturePad
                              ref="signature"
                              class="signature-pad"
                              :options="{
                                penColor: penColor,
                                backgroundColor: 'transparent',
                              }"
                              :max-width="2"
                              :min-width="1"
                              :throttle="1"
                            />

                            <div class="signature-line"></div>

                            <div class="signature-meta">
                              <div class="signature-names">{{ names || "Names" }}</div>
                              <div class="signature-positions">
                                {{ positions || "(Positions)" }}
                              </div>
                            </div>
                          </div>

                          <div class="signature-buttons">
                            <div class="color-input-wrapper">
                              <input type="color" v-model="penColor" />
                            </div>
                            <v-btn
                              color="primary"
                              icon="mdi-undo"
                              variant="icon"
                              @click="handleUndo"
                              v-tooltip:bottom="{
                                text: 'Undo',
                                openOnClick: true,
                              }"
                            ></v-btn>
                            <v-btn
                              color="primary"
                              icon="mdi-close"
                              variant="icon"
                              @click="handleClear"
                              v-tooltip:bottom="{
                                text: 'Clear canvas',
                                openOnClick: true,
                              }"
                            ></v-btn>
                          </div>
                        </v-card>
                      </v-input>
                    </v-col>
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

<style scoped>
.signature-wrapper {
  width: 100%;
  padding: 16px;
}

.signature-preview {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  height: 100%;
}

.signature-pad {
  width: 100%;
  min-height: 180px;
  z-index: 10;
}

.signature-line {
  position: absolute;
  width: 80%;
  border-bottom: 3px solid rgba(0, 0, 0, 1);
  bottom: 65px;
}

.signature-meta {
  text-align: center;
  width: 100%;
  position: absolute;
  bottom: 0px;
  z-index: 1;
}

.signature-names {
  font-weight: 600;
  font-size: 1.6rem;
  font-family: "Times New Roman", serif;
}

.signature-positions {
  font-weight: 600;
  font-size: 1rem;

  font-family: "Times New Roman", serif;
}

.signature-buttons {
  position: absolute;
  top: 0px;
  right: 0px;
  z-index: 20;
}

.color-input-wrapper {
  height: 24px;
  width: 24px;
  overflow: hidden;
  border-radius: 50%;
  display: inline-flex;
  align-items: center;
  position: absolute;
  right: 108px;
  top: 12px;
}
.color-input-wrapper input[type="color"] {
  position: absolute;
  height: 48px;
  width: 48px;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  overflow: hidden;
  border: none;
  margin: 0;
  padding: 0;
}
</style>
