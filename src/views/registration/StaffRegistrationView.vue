<script setup>
import { ref } from 'vue'
import { useStaffsStore } from '../../stores/staffs'
import { useRoute } from 'vue-router'
import GenderSelector from '../../components/GenderSelector.vue'
import PronounsSelector from '../../components/PronounsSelector.vue'
import NameFields from '../../components/NameFields.vue'
import EmailAddressField from '../../components/EmailAddressField.vue'
import PhoneNumberField from '../../components/PhoneNumberField.vue'
import DietSelector from '../../components/DietSelector.vue'
import ExtrasField from '../../components/ExtrasField.vue'
import { useDisplay } from 'vuetify'
import BadgePhotoCropper from '../../components/BadgePhotoCropper.vue'
import BirthdateField from '../../components/BirthdateField.vue'
import { toast } from 'vue3-toastify'
import 'vue3-toastify/dist/index.css'
import ConsentField from '../../components/ConsentField.vue'
const { mobile } = useDisplay()

const route = useRoute()

const staffsStore = useStaffsStore()

if (route.params.staff_id) {
  staffsStore.getStaff(route.params.staff_id)
} else {
  toast.error('Staff not found', {
    position: toast.POSITION.BOTTOM_CENTER
  })
}

const valid = ref(true)
</script>

<template>
  <div class="staff-reg">
    <v-alert>
      <p>Dear staff member,</p>
      <p>
        it is our pleasure to welcome you to this years MUNOL session. Please register by providing
        some information about yourself and a badge photo.
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
            <DietSelector v-model:diet="staffsStore.staff.diet"></DietSelector>
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
          <ConsentField
            v-model:data_consent_time="staffsStore.staff.data_consent_time"
            v-model:data_consent_ip="staffsStore.staff.data_consent_ip"
            v-model:media_consent_time="staffsStore.staff.media_consent_time"
            v-model:media_consent_ip="staffsStore.staff.media_consent_ip"
          ></ConsentField>
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
              :disabled="!valid"
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
