<script setup>
import { ref } from "vue";
import { useStudentOfficersStore } from "../../stores/student_officers";
import { useForumsStore } from "../../stores/forums";
import { useRoute, useRouter } from "vue-router";
import { useDisplay } from "vuetify";
import NameFields from "../../components/inputs/NameFields.vue";
import GenderSelector from "../../components/inputs/GenderSelector.vue";
import PronounsSelector from "../../components/inputs/PronounsSelector.vue";
import EmailAddressField from "../../components/inputs/EmailAddressField.vue";
import PhoneNumberField from "../../components/inputs/PhoneNumberField.vue";
import ExtrasField from "../../components/inputs/ExtrasField.vue";
import BadgePhotoCropper from "../../components/BadgePhotoCropper.vue";
import BirthdateField from "../../components/inputs/BirthdateField.vue";
import ConsentField from "../../components/inputs/ConsentField.vue";

const { mobile } = useDisplay();
const route = useRoute();
const router = useRouter();
const forumsStore = useForumsStore();
forumsStore.getForums();
const studentOfficersStore = useStudentOfficersStore();
studentOfficersStore.getStudentOfficer(route.params.student_officer_id);

const updateStudentOfficer = (student_officer_id) => {
  // update student officer
  studentOfficersStore.updateStudentOfficer(student_officer_id);

  // go back to student officer view
  router.push({ name: "student-officers" });
};

const forumSelectProps = function (forum) {
  return {
    title: forum.name,
    subtitle: forum.subtitle,
    value: forum.id,
  };
};

const valid = ref(true);
</script>

<template>
  <div class="">
    <v-breadcrumbs
      :items="[
        { title: 'Student Officers', to: { name: 'student-officers' } },
        {
          title: `${studentOfficersStore.student_officer?.first_name} ${studentOfficersStore.student_officer?.last_name}`,
        },
      ]"
    >
      <template v-slot:prepend>
        <v-icon icon="mdi-account-settings" size="small" start></v-icon>
      </template>
    </v-breadcrumbs>

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

            <v-text-field
              v-model="studentOfficersStore.student_officer.position_name"
              label="Position"
              prepend-icon="mdi-account-tie"
              type="text"
            ></v-text-field>

            <v-select
              :model-value="studentOfficersStore.student_officer.forum"
              :item-props="forumSelectProps"
              :items="forumsStore.forums"
              label="Forum"
              prepend-icon="mdi-forum"
              @update:modelValue="
                studentOfficersStore.student_officer.forum = $event
              "
            >
            </v-select>

            <v-text-field
              v-model="studentOfficersStore.student_officer.school_name"
              label="School"
              prepend-icon="mdi-school"
              type="text"
            ></v-text-field>

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
            <ExtrasField
              v-model:extras="studentOfficersStore.student_officer.extras"
            ></ExtrasField>
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
                updateStudentOfficer(studentOfficersStore.student_officer.id)
              "
              >Update Student Officer</v-btn
            >
          </div>
        </v-row>
      </v-container>
    </v-form>
  </div>
</template>

<style>
.fab-bottom-right {
  position: fixed;
  top: 75px;
  right: 25px;
}
#search {
  width: 300px;
}
.badge-photo {
  position: absolute;
}
</style>
