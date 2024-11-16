<script setup>
import { ref } from 'vue'
import { useAdvisorsStore } from '../../stores/advisors'
import { useRoute } from 'vue-router'
import GenderSelector from '../../components/GenderSelector.vue'
import PronounsSelector from '../../components/PronounsSelector.vue'
import NameFields from '../../components/NameFields.vue'
import EmailAddressField from '../../components/EmailAddressField.vue'
import PhoneNumberField from '../../components/PhoneNumberField.vue'
import DietSelector from '../../components/DietSelector.vue'
import ExtrasField from '../../components/ExtrasField.vue'
import HelpField from '../../components/HelpField.vue'
import { useDisplay } from 'vuetify'
import BadgePhotoCropper from '../../components/BadgePhotoCropper.vue'
import ConsentField from '../../components/ConsentField.vue'
const { mobile } = useDisplay()

const route = useRoute()

const advisorsStore = useAdvisorsStore()

if (route.params.advisor_id != 'add') {
  advisorsStore.getAdvisor(route.params.advisor_id)
} else {
  advisorsStore.initializeAdvisor()
}

const valid = ref(true)
</script>

<template>
  <div class="advisor-reg">
    <v-alert>
      <p>Dear Conference Advisor,</p>
      <p>
        it is our pleasure to welcome you to this years MUNOL session. Please register by providing
        some information about yourself, the support that you can offer and a badge photo.
      </p>
      <p>Your Conference Managers</p>
    </v-alert>

    <v-form v-model="valid" validate-on="blur">
      <v-container fluid>
        <v-row no-gutters="">
          <v-col cols="12" sm="12" md="6">
            <NameFields
              v-model:first_name="advisorsStore.advisor.first_name"
              v-model:last_name="advisorsStore.advisor.last_name"
            ></NameFields>

            <GenderSelector v-model:gender="advisorsStore.advisor.gender"></GenderSelector>

            <PronounsSelector v-model:pronouns="advisorsStore.advisor.pronouns"></PronounsSelector>

            <EmailAddressField v-model:email="advisorsStore.advisor.email"></EmailAddressField>
            <PhoneNumberField v-model:phone="advisorsStore.advisor.mobile"></PhoneNumberField>
            <DietSelector v-model:diet="advisorsStore.advisor.diet"></DietSelector>
            <ExtrasField v-model:extras="advisorsStore.advisor.extras"></ExtrasField>

            <v-checkbox
              v-model="advisorsStore.advisor.car"
              prepend-icon="mdi-car"
              color="primary"
              :density="mobile ? 'compact' : 'default'"
            >
              <template v-slot:label>
                <span
                  >I have a car available and can offer transportation during the conference.</span
                >
              </template>
            </v-checkbox>
            <v-textarea
              prepend-icon="mdi-card-account-details-star"
              label="MUN Experience"
              rows="2"
              hint="Please specify which role you had in former MUNOL sessions and other conferences, e.g. 'School Management 2013"
              :density="mobile ? 'compact' : 'default'"
              v-model="advisorsStore.advisor.experience"
              :rules="[
                (v) =>
                  !!v || 'Please briefly specify your experience in MUNOL and other conferences'
              ]"
            ></v-textarea>
            <v-textarea
              prepend-icon="mdi-hours-24"
              label="Availability during conference"
              hint="Please specify on which days and nighs you will attend the conference and give your advice"
              :density="mobile ? 'compact' : 'default'"
              v-model="advisorsStore.advisor.availability"
              :rules="[
                (v) => !!v || 'Please specify your estimated availability during the conference'
              ]"
            ></v-textarea>
            <HelpField v-model:help="advisorsStore.advisor.help"></HelpField>
          </v-col>

          <v-col
            cols="12"
            sm="12"
            md="4"
            :offset="mobile ? 0 : 8"
            :class="mobile ? '' : 'badge-photo'"
          >
            <BadgePhotoCropper v-model:image="advisorsStore.advisor.picture"></BadgePhotoCropper>
          </v-col>
        </v-row>
        <v-row no-gutters>
          <ConsentField
            v-model:data_consent_time="advisorsStore.advisor.data_consent_time"
            v-model:data_consent_ip="advisorsStore.advisor.data_consent_ip"
            v-model:media_consent_time="advisorsStore.advisor.media_consent_time"
            v-model:media_consent_ip="advisorsStore.advisor.media_consent_ip"
          ></ConsentField>
        </v-row>
        <v-row no-gutters class="justify-center">
          <div>
            <span
              v-if="!advisorsStore.advisor.picture"
              id="missing-badge-photo"
              class="text-error"
              style="display: block"
              >Please upload a badge photo.</span
            >

            <v-btn
              v-if="route.params.advisor_id != 'add'"
              id="submit-btn"
              color="primary"
              prepend-icon="mdi-send"
              :disabled="!valid"
              @click="advisorsStore.updateAdvisor(advisorsStore.advisor.id)"
              >Update information</v-btn
            >

            <v-btn
              v-if="route.params.advisor_id == 'add'"
              id="submit-btn"
              color="primary"
              prepend-icon="mdi-send"
              :disabled="!valid"
              @click="advisorsStore.createAdvisor()"
              >Submit registration form</v-btn
            >
          </div>
        </v-row>
      </v-container>
    </v-form>
  </div>
</template>

<style>
.advisor-reg {
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
