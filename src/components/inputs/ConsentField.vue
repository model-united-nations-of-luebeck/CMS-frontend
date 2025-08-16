<script setup>
import { useDisplay } from "vuetify";
const { mobile } = useDisplay();
import { ref, onMounted, watch } from "vue";
import { toast } from "vue3-toastify";
import "vue3-toastify/dist/index.css";

const conference_abbr = import.meta.env.VITE_CONFERENCE_ABBREVIATION;

const data_consent_statement = `I hereby consent to the collection, processing and use of my personal data as it is described in the privacy policy.`;
const media_consent_statement = `I hereby consent to the timely unlimited publication and display of images and sound recordings of myself as it is described in the privacy policy.`;

const props = defineProps({
  data_consent_time: String,
  data_consent_ip: String,
  media_consent_time: String,
  media_consent_ip: String,
});

const emit = defineEmits([
  "update:data_consent_time",
  "update:data_consent_ip",
  "update:media_consent_time",
  "update:media_consent_ip",
]);

const updateDataProtectionConsent = (value) => {
  if (value) {
    //consent given
    fetch("https://api.ipify.org?format=json")
      .then((response) => response.json())
      .then((data) => {
        emit("update:data_consent_time", new Date().toISOString());
        emit("update:data_consent_ip", data.ip);
      })
      .catch((error) => {
        console.error("Error fetching IP address:", error);
        emit("update:data_consent_time", new Date().toISOString());
        emit("update:data_consent_ip", null);
      });
  } else {
    //consent removed
    emit("update:data_consent_time", null);
    emit("update:data_consent_ip", null);
  }
};

const updateMediaConsent = (value) => {
  if (value) {
    //consent given
    fetch("https://api.ipify.org?format=json")
      .then((response) => response.json())
      .then((data) => {
        emit("update:media_consent_time", new Date().toISOString());
        emit("update:media_consent_ip", data.ip);
      })
      .catch((error) => {
        console.error("Error fetching IP address:", error);
        alert(error);
        emit("update:media_consent_time", new Date().toISOString());
        emit("update:media_consent_ip", null);
      });
  } else {
    //consent removed
    emit("update:media_consent_time", null);
    emit("update:media_consent_ip", null);
  }
};

const consent_dialog = ref(true);

const submitConsentDialog = () => {
  if (props.data_consent_time != null) {
    consent_dialog.value = false;
  } else {
    // Show extra toast that explains that asking the conference managers is an option or accepting the data protection.
    toast(
      `<p>While giving consent to data processing is voluntary and thus not necessary for participating in ${conference_abbr}, it makes organizing the conference much easier. So please reconsider accepting the data processing regulation.</p><br><p>In case you do not want to accept the regulations or revoke your consent, please contact the conference managers to figure out a way to participate in ${conference_abbr}.</p>`,
      {
        autoClose: false,
        type: "info",
        position: "bottom-center",
        dangerouslyHTMLString: true,
      },
    );
  }
};

onMounted(() => {
  // if delegate has already given consent,
  if (props.data_consent_time != null) {
    consent_dialog.value = false; //no need to open dialog
  } else {
    consent_dialog.value = true; //otherwise, show consent dialog
  }
});

watch(
  () => props.data_consent_time,
  (newVal, oldVal) => {
    if (newVal === null && oldVal !== null) {
      consent_dialog.value = true;
    }
  },
);
</script>

<template>
  <div>
    <v-checkbox
      v-if="props.data_consent_time"
      :model-value="props.data_consent_time != null"
      @update:modelValue="updateDataProtectionConsent"
      :label="`${data_consent_statement} (Consent given on ${new Date(
        props.data_consent_time,
      ).toLocaleDateString('en-GB', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        hour12: 'h12',
      })})`"
      :density="mobile ? 'compact' : 'default'"
      prepend-icon="mdi-shield-check"
      color="primary"
    ></v-checkbox>
    <v-checkbox
      v-else
      :model-value="props.data_consent_time != null"
      @update:modelValue="updateDataProtectionConsent"
      :label="`${data_consent_statement} (Consent not given)`"
      :density="mobile ? 'compact' : 'default'"
      prepend-icon="mdi-shield-check"
      color="primary"
    ></v-checkbox>
    <v-checkbox
      v-if="props.media_consent_time"
      :model-value="props.media_consent_time != null"
      @update:modelValue="updateMediaConsent"
      :label="`${media_consent_statement} (Consent given on ${new Date(
        props.media_consent_time,
      ).toLocaleDateString('en-GB', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        hour12: 'h12',
      })})`"
      :density="mobile ? 'compact' : 'default'"
      prepend-icon="mdi-multimedia"
      color="primary"
    ></v-checkbox>
    <v-checkbox
      v-else
      :model-value="props.media_consent_time != null"
      @update:modelValue="updateMediaConsent"
      :label="`${media_consent_statement} (Consent not given)`"
      :density="mobile ? 'compact' : 'default'"
      prepend-icon="mdi-multimedia"
      color="primary"
    ></v-checkbox>
    <v-input
      prepend-icon="mdi-white"
      direction="horizontal"
      style="margin-bottom: -20px !important"
    >
      <p>
        Here is our
        <a
          :href="`${import.meta.env.BASE_URL}/registration/privacy-policy`"
          target="_blank"
        >
          privacy policy</a
        ><v-icon size="x-small">mdi-open-in-new</v-icon>
      </p>
    </v-input>
  </div>
  <!-- Consent dialog -->

  <v-dialog v-model="consent_dialog" width="1000" persistent>
    <v-card>
      <v-card-title>Data Protection Consent</v-card-title>
      <v-card-text>
        <p>
          Dear participant, based on GDPR we need to inform you about our data
          processing procedures prior to letting you enter your data for the
          registration purposes. Here is our
          <a
            :href="`${import.meta.env.BASE_URL}/registration/privacy-policy`"
            target="_blank"
            >privacy policy</a
          >
          ><v-icon size="x-small">mdi-open-in-new</v-icon>
          which describes the processing of data and your rights and our
          responsibilities. Please read through them and if you agree, please
          give your consent.
        </p>
        <br />
        <v-checkbox
          v-if="props.data_consent_time"
          :model-value="props.data_consent_time != null"
          @update:modelValue="updateDataProtectionConsent"
          :label="`${data_consent_statement} (Consent given on ${new Date(
            props.data_consent_time,
          ).toLocaleDateString('en-GB', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            hour12: 'h12',
          })})`"
          :density="mobile ? 'compact' : 'default'"
          prepend-icon="mdi-shield-check"
          color="primary"
        ></v-checkbox>
        <v-checkbox
          v-else
          :model-value="props.data_consent_time != null"
          @update:modelValue="updateDataProtectionConsent"
          :label="`${data_consent_statement} (Consent not given)`"
          :density="mobile ? 'compact' : 'default'"
          prepend-icon="mdi-shield-check"
          color="primary"
        ></v-checkbox>
        <v-checkbox
          v-if="props.media_consent_time"
          :model-value="props.media_consent_time != null"
          @update:modelValue="updateMediaConsent"
          :label="`${media_consent_statement} (Consent given on ${new Date(
            props.media_consent_time,
          ).toLocaleDateString('en-GB', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            hour12: 'h12',
          })})`"
          :density="mobile ? 'compact' : 'default'"
          prepend-icon="mdi-multimedia"
          color="primary"
        ></v-checkbox>
        <v-checkbox
          v-else
          :model-value="props.media_consent_time != null"
          @update:modelValue="updateMediaConsent"
          :label="`${media_consent_statement} (Consent not given)`"
          :density="mobile ? 'compact' : 'default'"
          prepend-icon="mdi-multimedia"
          color="primary"
        ></v-checkbox>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="primary" @click="submitConsentDialog()">Confirm</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<style>
:root {
  --toastify-toast-width: 820px;
}
</style>
