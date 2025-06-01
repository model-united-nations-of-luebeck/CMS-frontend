<script setup>
import { useConferenceStore } from "../../stores/conference";
import { ref } from "vue";
import { VDateInput } from "vuetify/labs/VDateInput";
import { useDate } from "vuetify";

const conference_abbr = import.meta.env.VITE_CONFERENCE_ABBREVIATION;

const conferenceStore = useConferenceStore();
conferenceStore.getCurrentConference();

const valid = ref(false);

const updateConferenceSettings = function () {
  conferenceStore.updateConferenceSettings();
};

const adapter = useDate();
function ISOformat(date) {
  return adapter.toISO(date);
}
</script>

<template>
  <div class="">
    <v-container>
      <v-form v-if="conferenceStore.conference" ref="form" v-model="valid">
        <p class="text-h4">General</p>
        <v-row>
          <v-col sm="12">
            <v-text-field
              v-model="conferenceStore.conference.theme"
              label="Conference Theme"
              name="theme"
              prepend-inner-icon="mdi-message-question"
              type="text"
            /> </v-col
        ></v-row>

        <v-row>
          <v-col sm="3">
            <v-text-field
              v-model="conferenceStore.conference.year"
              label="Conference year"
              name="year"
              prepend-inner-icon="mdi-calendar-month"
              type="number"
              :rules="conferenceStore.validationRules.yearRules"
              hint="Use format YYYY for years, so 2019 instead of just 19"
            ></v-text-field>
          </v-col>
          <v-col sm="3">
            <v-text-field
              v-model="conferenceStore.conference.annual_session"
              label="Annual session"
              name="session"
              prepend-inner-icon="mdi-counter"
              type="number"
              :rules="conferenceStore.validationRules.annualSessionRules"
              :hint="`First session was in 1998, i.e. ${conference_abbr} 2022 was the 25th session`"
            ></v-text-field>
          </v-col>
          <v-col sm="3">
            <v-date-input
              :model-value="new Date(conferenceStore.conference.start_date)"
              @update:model-value="
                (val) =>
                  (conferenceStore.conference.start_date =
                    val.toLocaleDateString('en-CA')) // ISO format YYYY-MM-DD
              "
              :rules="conferenceStore.validationRules.startDateRules"
              prepend-inner-icon="mdi-calendar-today"
              prepend-icon=""
              label="Start date"
              placeholder="YYYY-MM-DD"
              :hint="`Use the first day of the conference as start date, at ${conference_abbr} it's usually Monday.`"
              clearable
              :display-format="ISOformat"
            ></v-date-input>
          </v-col>

          <v-col sm="3">
            <v-date-input
              :model-value="new Date(conferenceStore.conference.end_date)"
              @update:model-value="
                (val) =>
                  (conferenceStore.conference.end_date =
                    val.toLocaleDateString('en-CA')) // ISO format YYYY-MM-DD
              "
              label="End date"
              prepend-inner-icon="mdi-calendar"
              prepend-icon=""
              :rules="conferenceStore.validationRules.endDateRules"
              placeholder="YYYY-MM-DD"
              :hint="`Last day of the conference, at ${conference_abbr} usually Friday or Saturday.`"
              clearable
              :display-format="ISOformat"
            ></v-date-input>
          </v-col>
        </v-row>

        <p class="text-h4">Deadlines</p>

        <v-row>
          <v-col sm="4">
            <v-date-input
              :model-value="
                new Date(conferenceStore.conference.pre_registration_deadline)
              "
              @update:model-value="
                (val) =>
                  (conferenceStore.conference.pre_registration_deadline = val) // ISO format YYYY-MM-DD
              "
              prepend-inner-icon="mdi-calendar-clock"
              prepend-icon=""
              label="Pre-Registration deadline"
              placeholder="Format YYYY-MM-DD"
              clearable
              :display-format="ISOformat"
            ></v-date-input>
          </v-col>
          <v-col sm="4">
            <v-date-input
              :model-value="
                new Date(conferenceStore.conference.final_registration_deadline)
              "
              @update:model-value="
                (val) =>
                  (conferenceStore.conference.final_registration_deadline = val) // ISO format YYYY-MM-DD
              "
              prepend-inner-icon="mdi-calendar-clock"
              prepend-icon=""
              label="Final Registration deadline"
              placeholder="Format YYYY-MM-DD"
              clearable
              :display-format="ISOformat"
            ></v-date-input>
          </v-col>
          <v-col sm="4">
            <v-date-input
              :model-value="
                new Date(conferenceStore.conference.position_paper_deadline)
              "
              @update:model-value="
                (val) =>
                  (conferenceStore.conference.position_paper_deadline = val) // ISO format YYYY-MM-DD
              "
              prepend-inner-icon="mdi-calendar-clock"
              prepend-icon=""
              label="Position paper deadline"
              placeholder="Format YYYY-MM-DD"
              clearable
              :display-format="ISOformat"
            ></v-date-input>
          </v-col>
        </v-row>

        <p class="text-h4">Association Board Members</p>

        <v-row>
          <v-col sm="3">
            <v-text-field
              v-model="conferenceStore.conference.chair_human"
              label="Chair:wo:man"
              name="chair human"
              prepend-inner-icon="mdi-account"
              type="text"
              :rules="conferenceStore.validationRules.associationRules"
              required
              :hint="`Full name of the Chairman/woman of the ${conference_abbr} Association`"
            ></v-text-field>
          </v-col>
          <v-col sm="3">
            <v-text-field
              v-model="conferenceStore.conference.vice_chair_human"
              label="Vice-Chair:wo:man"
              name="vice chair human"
              prepend-inner-icon="mdi-account"
              type="text"
              :rules="conferenceStore.validationRules.associationRules"
              :hint="`Full name of the Vice-Chairman/woman of the ${conference_abbr} Association`"
            ></v-text-field>
          </v-col>
          <v-col sm="3">
            <v-text-field
              v-model="conferenceStore.conference.treasurer"
              label="Treasurer"
              name="treasurer"
              prepend-inner-icon="mdi-account-cash"
              type="text"
              :rules="conferenceStore.validationRules.associationRules"
              :hint="`Full name of the Treasurer of the ${conference_abbr} Association`"
            ></v-text-field>
          </v-col>
          <v-col sm="3">
            <v-text-field
              v-model="conferenceStore.conference.vice_treasurer"
              label="Vice-Treasurer"
              name="vice treasurer"
              prepend-inner-icon="mdi-account-cash"
              type="text"
              :rules="conferenceStore.validationRules.associationRules"
              :hint="`Full name of the Vice-Treasurer of the ${conference_abbr} Association`"
            ></v-text-field>
          </v-col>
        </v-row>
        <v-row>
          <v-col sm="12" style="text-align: right">
            <v-btn
              :disabled="!valid"
              color="primary"
              @click="updateConferenceSettings"
              append-icon="mdi-send"
            >
              Update
            </v-btn></v-col
          ></v-row
        >
      </v-form>
    </v-container>
  </div>
</template>

<style>
.text-h4 {
  margin-bottom: 20px;
  margin-top: 15px;
  display: inline-block;
}
</style>
