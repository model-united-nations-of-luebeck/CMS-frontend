<script setup>
import { useRoute } from "vue-router";
import { useSchoolsStore } from "../../stores/schools";
import { useConferenceStore } from "../../stores/conference";
import SchoolNameField from "../../components/inputs/SchoolNameField.vue";
import StreetField from "../../components/inputs/StreetField.vue";
import ZipCodeField from "../../components/inputs/ZipCodeField.vue";
import CityField from "../../components/inputs/CityField.vue";
import CountryField from "../../components/inputs/CountryField.vue";
import { useDisplay } from "vuetify";
import DelegateNumberField from "../../components/inputs/DelegateNumberField.vue";
import AccommodationSelector from "../../components/inputs/AccommodationSelector.vue";
const { mobile } = useDisplay();
const route = useRoute();

const conference_abbr = import.meta.env.VITE_CONFERENCE_ABBREVIATION;

const conferenceStore = useConferenceStore();
conferenceStore.getCurrentConference();

const schoolsStore = useSchoolsStore();
schoolsStore.getSchool(route.params.school_id);

const ordinal = (n) => {
  const s = ["th", "st", "nd", "rd"];
  const v = n % 100;
  return n + (s[(v - 20) % 10] || s[v] || s[0]);
};
</script>

<template>
  <div class="pre-registration">
    <v-sheet
      id="sheet"
      :elevation="mobile ? 0 : 2"
      :rounded="mobile ? false : 'lg'"
    >
      <v-btn
        variant="plain"
        prepend-icon="mdi-arrow-left"
        :to="`/registration/${route.params.school_id}`"
        >Back to registration overview</v-btn
      >

      <h1 class="py-6">Pre-Registration</h1>

      <p>
        Dear MUN-Director, <br />
        we are very delighted that you are interested in taking part in the
        {{ ordinal(conferenceStore.conference.annual_session) }}
        {{ conference_abbr }} session in {{ conferenceStore.conference.year }}.
        In order to register you and your school's delegation, please fill in
        this form by
        {{
          new Date(
            conferenceStore.conference.pre_registration_deadline,
          ).toLocaleDateString("en-GB", {
            weekday: "long",
            year: "numeric",
            month: "long",
            day: "numeric",
          })
        }}. Please don't hesitate contacting the Conference Managers in case you
        have any questions
        <a href="mailto:conferencemanager@munol.org"
          >conferencemanager@munol.org</a
        >.
      </p>

      <v-form>
        <v-container fluid>
          <v-row no-gutters>
            <v-col cols="12" sm="12" md="3">
              <SchoolNameField
                v-model:name="schoolsStore.schools.name"
              ></SchoolNameField>
            </v-col>
          </v-row>
          <v-row no-gutters>
            <v-col cols="12" sm="12" md="3">
              <StreetField
                v-model:street="schoolsStore.schools.street"
              ></StreetField>
            </v-col>
            <v-col cols="12" sm="2" md="1">
              <ZipCodeField
                v-model:zip="schoolsStore.schools.zipcode"
              ></ZipCodeField>
            </v-col>
            <v-col cols="12" sm="10" md="3">
              <CityField v-model:city="schoolsStore.schools.city"></CityField>
            </v-col>
            <v-col cols="12" sm="12" md="3">
              <CountryField
                v-model:country="schoolsStore.schools.country"
              ></CountryField>
            </v-col>
          </v-row>
          <v-row no-gutters="">
            <v-col cols="12" sm="12" md="3">
              <DelegateNumberField
                v-model:requested="schoolsStore.schools.requested"
              ></DelegateNumberField>
            </v-col>
            <v-col cols="12" sm="12" md="7">
              <p class="text-medium-emphasis" :class="{ 'px-8': !mobile }">
                Please note, that this is the number of students requested.
                Although the Conference Managers do their best to fulfil all
                requests and constraints, this is not always possible. So, it
                might happen that only a smaller number of students will be
                confirmed by the Conference Managers. Sometimes however, places
                become free again and MUN-Directors might be granted to bring
                more students.
              </p>
            </v-col>
          </v-row>
          <v-row>
            <!-- <v-col cols="6">
              <v-slider
                v-model="schoolsStore.schools.requested"
                :min="1"
                :max="20"
                :step="1"
                show-ticks="always"
                tick-size="4"
                thumb-label
                color="primary"
              >
                <template #prepend>
                  <v-btn
                    variant="text"
                    icon="mdi-minus"
                    color="primary"
                    @click="requested--"
                  ></v-btn>
                </template>
                <template #append>
                  <v-btn
                    variant="text"
                    icon="mdi-plus"
                    color="primary"
                    @click="requested++"
                  ></v-btn>
                </template>
                <template #label>
                  <v-icon start icon="mdi-account-group"></v-icon>
                  <v-label>Number of Delegates:</v-label><b class="px-4">{{ requested }}</b>
                </template>
              </v-slider>
            </v-col> -->
          </v-row>
          <v-row>
            <v-col cols="12" sm="12" md="4">
              <!-- <v-input prepend-icon="mdi-home">
                <v-label>Accommodation for Delegates</v-label>
                <v-btn-toggle
                  class="px-6"
                  divided
                  variant="outlined"
                  v-model="schoolsStore.schools.housing_delegates"
                >
                  <v-btn value="guest-family">
                    <span class="hidden-sm-and-down">Guest family</span>

                    <v-icon end> mdi-home-heart </v-icon>
                  </v-btn>

                  <v-btn value="hostel">
                    <span class="hidden-sm-and-down">Youth Hostel</span>

                    <v-icon end>mdi-bed</v-icon>
                  </v-btn>

                  <v-btn value="other">
                    <span class="hidden-sm-and-down">Self-organized</span>

                    <v-icon end> mdi-home </v-icon>
                  </v-btn>
                </v-btn-toggle>
              </v-input> -->
              <AccommodationSelector
                v-model:accommodation="schoolsStore.schools.housing_delegates"
                label="Accommodation for Delegates"
              ></AccommodationSelector>

              <!-- <v-input prepend-icon="mdi-home">
                <v-label>Accommodation for MUN-Directors</v-label>
                <v-btn-toggle
                  class="px-6"
                  divided
                  variant="outlined"
                  v-model="schoolsStore.schools.housing_mun_directors"
                >
                  <v-btn value="guest-family">
                    <span class="hidden-sm-and-down">Guest family</span>

                    <v-icon end> mdi-home-heart </v-icon>
                  </v-btn>

                  <v-btn value="hostel">
                    <span class="hidden-sm-and-down">Youth Hostel</span>

                    <v-icon end>mdi-bed</v-icon>
                  </v-btn>

                  <v-btn value="other">
                    <span class="hidden-sm-and-down">Self-organized</span>

                    <v-icon end> mdi-home </v-icon>
                  </v-btn>
                </v-btn-toggle>
              </v-input> -->
              <AccommodationSelector
                v-model:accommodation="
                  schoolsStore.schools.housing_mun_directors
                "
                label="Accommodation for MUN-Directors"
              ></AccommodationSelector>
            </v-col>
            <v-col cols="12" sm="12" md="6">
              <p class="text-medium-emphasis" :class="{ 'py-8': !mobile }">
                {{ conference_abbr }} offers the possibility to stay in host
                families depending on who many families agree on hosting
                delegates. Most of the host families have children in the same
                age attending a school in Lübeck. In order to have a memorable
                time together, both, the host family and the guest have to be
                open-minded and stick to some self-evident rules. We assume that
                guest students follow the parents instructions, e.g. regarding
                staying out in the evening. If you have further questions
                regarding the housing please don't hesitate asking the
                Conference Managers or the Student Supervisors, who coordinate
                the accommodation.
              </p>
            </v-col>
          </v-row>
          <v-row class="justify-center">
            <v-btn
              id="submit-btn"
              color="primary"
              prepend-icon="mdi-send"
              :loading="schoolsStore.button_loading"
              :disabled="schoolsStore.loading"
              @click="schoolsStore.updateSchool(route.params.school_id)"
              >Submit pre-registration data</v-btn
            >
          </v-row>
        </v-container>
      </v-form>
    </v-sheet>
  </div>
</template>

<style scoped>
#sheet {
  padding: 20px;
  margin: 20px 50px;

  @media (max-width: 600px) {
    padding: 0px;
    margin: 20px;
  }
}

.v-slider {
  margin: 0 !important;
}
.v-slider .v-icon {
  margin-right: 16px;
}

#help {
  color: rgba(0, 0, 0, 0.57);
}

.v-form {
  margin-top: 20px;
}

#submit-btn {
  margin-top: 24px;
}
</style>
