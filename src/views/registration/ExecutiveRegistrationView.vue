<script setup>
import { ref, onMounted } from "vue";
import { useExecutivesStore } from "../../stores/executives";
import { useRoute } from "vue-router";
import GenderSelector from "../../components/inputs/GenderSelector.vue";
import PronounsSelector from "../../components/inputs/PronounsSelector.vue";
import NameFields from "../../components/inputs/NameFields.vue";
import EmailAddressField from "../../components/inputs/EmailAddressField.vue";
import PhoneNumberField from "../../components/inputs/PhoneNumberField.vue";
import DietSelector from "../../components/inputs/DietSelector.vue";
import ExtrasField from "../../components/inputs/ExtrasField.vue";
import { useDisplay } from "vuetify";
import BadgePhotoCropper from "../../components/BadgePhotoCropper.vue";
import BirthdateField from "../../components/inputs/BirthdateField.vue";
import { toast } from "vue3-toastify";
import "vue3-toastify/dist/index.css";
import ConsentField from "../../components/inputs/ConsentField.vue";
const { mobile } = useDisplay();

const conference_abbr = import.meta.env.VITE_CONFERENCE_ABBREVIATION;
const valid = ref(true);
const route = useRoute();
const executivesStore = useExecutivesStore();
const emit = defineEmits(["show-login-dialog"]);

async function loadData() {
  if (route.params.executive_id) {
    executivesStore.getExecutive(route.params.executive_id).catch((err) => {
      if (err?.response?.status === 403) {
        emit("show-login-dialog", err?.response);
      }
    });
  } else {
    toast.error("Executive not found", {
      position: toast.POSITION.BOTTOM_CENTER,
    });
  }
}

onMounted(() => {
  loadData();
});

defineExpose({
  retry: loadData,
});
</script>

<template>
  <div class="executive-reg" v-if="executivesStore.executive">
    <v-alert>
      <p>Dear executive team member,</p>
      <p>
        it is our pleasure to welcome you to this years
        {{ conference_abbr }} session. Please register by providing some
        information about yourself and a badge photo.
      </p>
      <p>Your Conference Managers</p>
    </v-alert>

    <v-form v-model="valid" validate-on="blur">
      <v-container fluid>
        <v-row no-gutters="">
          <v-col cols="12" sm="12" md="6">
            <NameFields
              v-model:first_name="executivesStore.executive.first_name"
              v-model:last_name="executivesStore.executive.last_name"
            ></NameFields>

            <GenderSelector
              v-model:gender="executivesStore.executive.gender"
            ></GenderSelector>

            <PronounsSelector
              v-model:pronouns="executivesStore.executive.pronouns"
            ></PronounsSelector>

            <EmailAddressField
              v-model:email="executivesStore.executive.email"
            ></EmailAddressField>
            <PhoneNumberField
              v-model:phone="executivesStore.executive.mobile"
            ></PhoneNumberField>
            <BirthdateField
              v-model:birthday="executivesStore.executive.birthday"
            ></BirthdateField>
            <DietSelector
              v-model:diet="executivesStore.executive.diet"
            ></DietSelector>
            <ExtrasField
              v-model:extras="executivesStore.executive.extras"
            ></ExtrasField>

            <v-text-field
              v-model="executivesStore.executive.position_name"
              label="Position"
              prepend-icon="mdi-account-tie"
              type="text"
              readonly
            ></v-text-field>
            <v-text-field
              v-model="executivesStore.executive.school_name"
              label="School"
              prepend-icon="mdi-school"
              type="text"
              readonly
            ></v-text-field>
          </v-col>

          <v-col
            cols="12"
            sm="12"
            md="4"
            :offset="mobile ? 0 : 8"
            :class="mobile ? '' : 'badge-photo'"
          >
            <BadgePhotoCropper
              v-model:image="executivesStore.executive.picture"
            ></BadgePhotoCropper>
          </v-col>
        </v-row>
        <v-row no-gutters>
          <ConsentField
            v-model:data_consent_time="
              executivesStore.executive.data_consent_time
            "
            v-model:data_consent_ip="executivesStore.executive.data_consent_ip"
            v-model:media_consent_time="
              executivesStore.executive.media_consent_time
            "
            v-model:media_consent_ip="
              executivesStore.executive.media_consent_ip
            "
          ></ConsentField>
        </v-row>
        <v-row no-gutters class="justify-center">
          <div>
            <span
              v-if="!executivesStore.executive.picture"
              id="missing-badge-photo"
              class="text-error"
              style="display: block"
              >Please upload a badge photo.</span
            >

            <v-btn
              id="submit-btn"
              color="primary"
              prepend-icon="mdi-send"
              :disabled="!valid"
              @click="
                executivesStore.updateExecutive(executivesStore.executive.id)
              "
              >Submit registration form</v-btn
            >
          </div>
        </v-row>
      </v-container>
    </v-form>
  </div>
</template>

<style>
.executive-reg {
  padding: 20px;
}

.v-col {
  padding: 0px !important;
}

#submit-btn {
  margin-top: 24px;
}

.badge-photo {
  position: absolute;
}
</style>
