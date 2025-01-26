<script setup>
import { ref } from "vue";
import { useStudentOfficersStore } from "../../stores/student_officers";
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

const route = useRoute();

const studentOfficersStore = useStudentOfficersStore();

if (route.params.student_officer_id) {
  studentOfficersStore.getStudentOfficer(route.params.student_officer_id);
} else {
  toast.error("Student Officer not found", {
    position: toast.POSITION.BOTTOM_CENTER,
  });
}

const valid = ref(true);
</script>

<template>
  <div class="student-officer-reg">
    <v-alert>
      <p>Dear student officer,</p>
      <p>
        it is our pleasure to welcome you to this years MUNOL session. Please
        register by providing some information about yourself and a badge photo.
      </p>
      <p>Your Conference Managers</p>
    </v-alert>

    <v-form v-model="valid" validate-on="blur">
      <v-container fluid>
        <v-row no-gutters="">
          <v-col cols="12" sm="12" md="6">
            <NameFields
              v-model:first_name="
                studentOfficersStore.student_officer.first_name
              "
              v-model:last_name="studentOfficersStore.student_officer.last_name"
            ></NameFields>

            <GenderSelector
              v-model:gender="studentOfficersStore.student_officer.gender"
            ></GenderSelector>

            <PronounsSelector
              v-model:pronouns="studentOfficersStore.student_officer.pronouns"
            ></PronounsSelector>

            <EmailAddressField
              v-model:email="studentOfficersStore.student_officer.email"
            ></EmailAddressField>
            <PhoneNumberField
              v-model:phone="studentOfficersStore.student_officer.mobile"
            ></PhoneNumberField>
            <BirthdateField
              v-model:birthday="studentOfficersStore.student_officer.birthday"
            ></BirthdateField>
            <DietSelector
              v-model:diet="studentOfficersStore.student_officer.diet"
            ></DietSelector>
            <ExtrasField
              v-model:extras="studentOfficersStore.student_officer.extras"
            ></ExtrasField>

            <v-text-field
              v-model="studentOfficersStore.student_officer.position_name"
              label="Position"
              prepend-icon="mdi-account-tie"
              type="text"
              readonly
            ></v-text-field>
            <v-text-field
              v-model="studentOfficersStore.student_officer.school_name"
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
              v-model:image="studentOfficersStore.student_officer.picture"
            ></BadgePhotoCropper>
          </v-col>
        </v-row>
        <v-row no-gutters>
          <ConsentField
            v-model:data_consent_time="
              studentOfficersStore.student_officer.data_consent_time
            "
            v-model:data_consent_ip="
              studentOfficersStore.student_officer.data_consent_ip
            "
            v-model:media_consent_time="
              studentOfficersStore.student_officer.media_consent_time
            "
            v-model:media_consent_ip="
              studentOfficersStore.student_officer.media_consent_ip
            "
          ></ConsentField>
        </v-row>
        <v-row no-gutters class="justify-center">
          <div>
            <span
              v-if="!studentOfficersStore.student_officer.picture"
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
                studentOfficersStore.updateStudentOfficer(
                  studentOfficersStore.student_officer.id,
                )
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
.student-officer-reg {
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
