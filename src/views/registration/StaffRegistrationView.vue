<script setup>
import { ref, onMounted } from "vue";
import { useStaffsStore } from "../../stores/staffs";
import { useRoute } from "vue-router";
import GenderSelector from "../../components/inputs/GenderSelector.vue";
import PronounsSelector from "../../components/inputs/PronounsSelector.vue";
import NameFields from "../../components/inputs/NameFields.vue";
import EmailAddressField from "../../components/inputs/EmailAddressField.vue";
import PhoneNumberField from "../../components/inputs/PhoneNumberField.vue";
import ExtrasField from "../../components/inputs/ExtrasField.vue";
import { useDisplay } from "vuetify";
import BadgePhotoCropper from "../../components/BadgePhotoCropper.vue";
import BirthdateField from "../../components/inputs/BirthdateField.vue";
import { toast } from "vue3-toastify";
import "vue3-toastify/dist/index.css";
import ConsentField from "../../components/inputs/ConsentField.vue";
const { mobile } = useDisplay();

const conference_abbr = import.meta.env.VITE_CONFERENCE_ABBREVIATION;

const route = useRoute();

const staffsStore = useStaffsStore();
const valid = ref(true);
const emit = defineEmits(["show-login-dialog"]);

async function loadData() {
  if (route.params.staff_id) {
    staffsStore.getStaff(route.params.staff_id).catch((err) => {
      if (err?.response?.status === 403) {
        emit("show-login-dialog", err?.response);
      }
    });
  } else {
    toast.error("Staff not found. Please ask admin for help.", {
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
  <div class="staff-reg" v-if="staffsStore.staff">
    <v-alert>
      <p>Dear staff member,</p>
      <p>
        it is our pleasure to welcome you to this years
        {{ conference_abbr }} session. Please register by providing some information about yourself
        and a badge photo.
      </p>
      <p>Your Conference Managers</p>
    </v-alert>

    <v-form v-model="valid" validate-on="blur">
      <v-container fluid>
        <v-row no-gutters="">
          <v-col cols="12" sm="12" md="6">
            <NameFields
              v-model:first_name="staffsStore.staff.first_name"
              v-model:last_name="staffsStore.staff.last_name"
            ></NameFields>

            <GenderSelector v-model:gender="staffsStore.staff.gender"></GenderSelector>

            <PronounsSelector v-model:pronouns="staffsStore.staff.pronouns"></PronounsSelector>

            <EmailAddressField v-model:email="staffsStore.staff.email"></EmailAddressField>
            <PhoneNumberField v-model:phone="staffsStore.staff.mobile"></PhoneNumberField>
            <BirthdateField v-model:birthday="staffsStore.staff.birthday"></BirthdateField>

            <ExtrasField v-model:extras="staffsStore.staff.extras"></ExtrasField>

            <v-text-field
              v-model="staffsStore.staff.position_name"
              label="Position"
              prepend-icon="mdi-account-tie"
              type="text"
              readonly
            ></v-text-field>
            <v-text-field
              v-model="staffsStore.staff.school_name"
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
            <BadgePhotoCropper v-model:image="staffsStore.staff.picture"></BadgePhotoCropper>
          </v-col>
        </v-row>
        <v-row no-gutters>
          <v-col cols="12" sm="12" md="6">
            <ConsentField
              v-model:data_consent_time="staffsStore.staff.data_consent_time"
              v-model:data_consent_ip="staffsStore.staff.data_consent_ip"
              v-model:media_consent_time="staffsStore.staff.media_consent_time"
              v-model:media_consent_ip="staffsStore.staff.media_consent_ip"
              v-model:organizers_notice_time="staffsStore.staff.organizers_notice_time"
              v-model:organizers_notice_ip="staffsStore.staff.organizers_notice_ip"
            ></ConsentField>
          </v-col>
        </v-row>
        <v-row no-gutters class="justify-center">
          <div>
            <span
              v-if="!staffsStore.staff.picture"
              id="missing-badge-photo"
              class="text-error"
              style="display: block"
              >Please upload a badge photo.</span
            >

            <v-btn
              id="submit-btn"
              color="primary"
              prepend-icon="mdi-send"
              :disabled="!valid || !staffsStore.staff.picture"
              @click="staffsStore.updateStaff(staffsStore.staff.id)"
              >Submit registration form</v-btn
            >
          </div>
        </v-row>
      </v-container>
    </v-form>
  </div>
</template>

<style>
.staff-reg {
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
