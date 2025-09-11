<script setup>
import { ref, watch } from "vue";
import { useAdvisorsStore } from "../../stores/advisors";
import { useRoute, useRouter } from "vue-router";
import { useDisplay } from "vuetify";
import NameFields from "../../components/inputs/NameFields.vue";
import GenderSelector from "../../components/inputs/GenderSelector.vue";
import PronounsSelector from "../../components/inputs/PronounsSelector.vue";
import EmailAddressField from "../../components/inputs/EmailAddressField.vue";
import PhoneNumberField from "../../components/inputs/PhoneNumberField.vue";
import ExtrasField from "../../components/inputs/ExtrasField.vue";
import BadgePhotoCropper from "../../components/BadgePhotoCropper.vue";
import HelpField from "../../components/inputs/HelpField.vue";
import ConsentField from "../../components/inputs/ConsentField.vue";

const conference_abbr = import.meta.env.VITE_CONFERENCE_ABBREVIATION;

const { mobile } = useDisplay();
const route = useRoute();
const router = useRouter();
const advisorsStore = useAdvisorsStore();

const fetchAdvisor = () => {
  if (route.params.advisor_id) {
    advisorsStore.getAdvisor(route.params.advisor_id);
  }
};

fetchAdvisor();

watch(
  () => route.params.advisor_id,
  () => {
    fetchAdvisor();
  },
);

const updateAdvisor = (advisor_id) => {
  // update advisor
  advisorsStore.updateAdvisor(advisor_id);

  // go back to advisors view
  router.push({ name: "advisors" });
};

const valid = ref(true);
</script>

<template>
  <div class="">
    <v-breadcrumbs
      :items="[
        { title: 'Advisors', to: { name: 'advisors' } },
        {
          title: `${advisorsStore.advisor?.first_name} ${advisorsStore.advisor?.last_name}`,
        },
      ]"
    >
      <template v-slot:prepend>
        <v-icon icon="mdi-account-star" size="small" start></v-icon>
      </template>
    </v-breadcrumbs>

    <v-form v-model="valid" validate-on="blur">
      <v-container fluid>
        <v-row no-gutters="">
          <v-col cols="12" sm="12" md="6">
            <NameFields
              v-model:first_name="advisorsStore.advisor.first_name"
              v-model:last_name="advisorsStore.advisor.last_name"
            ></NameFields>

            <GenderSelector
              v-model:gender="advisorsStore.advisor.gender"
            ></GenderSelector>

            <PronounsSelector
              v-model:pronouns="advisorsStore.advisor.pronouns"
            ></PronounsSelector>

            <EmailAddressField
              v-model:email="advisorsStore.advisor.email"
            ></EmailAddressField>
            <PhoneNumberField
              v-model:phone="advisorsStore.advisor.mobile"
            ></PhoneNumberField>
            <ExtrasField
              v-model:extras="advisorsStore.advisor.extras"
            ></ExtrasField>

            <v-checkbox
              v-model="advisorsStore.advisor.car"
              prepend-icon="mdi-car"
              color="primary"
              :density="mobile ? 'compact' : 'default'"
            >
              <template v-slot:label>
                <span
                  >I have a car available and can offer transportation during
                  the conference.</span
                >
              </template>
            </v-checkbox>
            <v-textarea
              prepend-icon="mdi-card-account-details-star"
              label="MUN Experience"
              rows="2"
              :hint="`Please specify which role you had in former ${conference_abbr} sessions and other conferences, e.g. 'School Management 2013`"
              :density="mobile ? 'compact' : 'default'"
              v-model="advisorsStore.advisor.experience"
              :rules="[
                (v) =>
                  !!v ||
                  `Please briefly specify your experience in ${conference_abbr} and other conferences`,
              ]"
            ></v-textarea>
            <v-textarea
              prepend-icon="mdi-hours-24"
              label="Availability during conference"
              hint="Please specify on which days and nighs you will attend the conference and give your advice"
              :density="mobile ? 'compact' : 'default'"
              v-model="advisorsStore.advisor.availability"
              :rules="[
                (v) =>
                  !!v ||
                  'Please specify your estimated availability during the conference',
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
            <BadgePhotoCropper
              v-model:image="advisorsStore.advisor.picture"
            ></BadgePhotoCropper>
          </v-col>
        </v-row>
        <v-row no-gutters>
          <ConsentField
            v-model:data_consent_time="advisorsStore.advisor.data_consent_time"
            v-model:data_consent_ip="advisorsStore.advisor.data_consent_ip"
            v-model:media_consent_time="
              advisorsStore.advisor.media_consent_time
            "
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
              id="submit-btn"
              color="primary"
              prepend-icon="mdi-send"
              :disabled="!valid"
              @click="updateAdvisor(advisorsStore.advisor.id)"
              >Update Advisor</v-btn
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
