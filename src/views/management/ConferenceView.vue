<script setup>
import { useConferenceStore } from '../../stores/conference'
import { ref } from 'vue'

const conferenceStore = useConferenceStore()
conferenceStore.getCurrentConference()

const valid = ref(false)

const updateConferenceSettings = function () {
  conferenceStore.updateConferenceSettings()
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
              hint="First session was in 1998, i.e. MUNOL 2022 was the 25th session"
            ></v-text-field>
          </v-col>
          <v-col sm="3">
            <v-text-field
              v-model="conferenceStore.conference.start_date"
              label="Start date"
              prepend-inner-icon="mdi-calendar-today"
              :rules="conferenceStore.validationRules.startDateRules"
              placeholder="YYYY-MM-DD"
              hint="Use the first day of the conference as start date, at MUNOL it's usually
                        Monday. Local time zone at 0 o'clock will be selected automatically."
            ></v-text-field>
          </v-col>
          <v-col sm="3">
            <v-text-field
              v-model="conferenceStore.conference.end_date"
              label="End date"
              prepend-inner-icon="mdi-calendar"
              :rules="conferenceStore.validationRules.endDateRules"
              placeholder="YYYY-MM-DD"
              hint="Last day of the conference, at MUNOL usually Saturday. Local time zone at 0 o'clock will be selected automatically."
            ></v-text-field>
          </v-col>
        </v-row>

        <p class="text-h4">Deadlines</p>

        <v-row>
          <v-col sm="4">
            <v-text-field
              v-model="conferenceStore.conference.pre_registration_deadline"
              prepend-inner-icon="mdi-calendar-clock"
              label="Pre-Registration deadline"
              placeholder="Format YYYY-MM-DD"
            ></v-text-field>
          </v-col>
          <v-col sm="4">
            <v-text-field
              v-model="conferenceStore.conference.final_registration_deadline"
              prepend-inner-icon="mdi-calendar-clock"
              label="Final Registration deadline"
              placeholder="Format YYYY-MM-DD"
            >
            </v-text-field>
          </v-col>
          <v-col sm="4">
            <v-text-field
              v-model="conferenceStore.conference.position_paper_deadline"
              prepend-inner-icon="mdi-calendar-clock"
              label="position paper deadline"
              placeholder="Format YYYY-MM-DD"
            ></v-text-field>
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
              hint="Full name of the Chairman/woman of the MUNOL Association"
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
              hint="Full name of the Vice-Chairman/woman of the MUNOL Association"
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
              hint="Full name of the Treasurer of the MUNOL Association"
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
              hint="Full name of the Vice-Treasurer of the MUNOL Association"
            ></v-text-field>
          </v-col>
        </v-row>
        <v-row>
          <v-col sm="12" style="text-align: right">
            <v-btn :disabled="!valid" color="primary" @click="updateConferenceSettings">
              Update
              <v-icon right dark> mdi-send </v-icon>
            </v-btn></v-col
          ></v-row
        >
      </v-form>

      <v-alert style="margin-top: 20px" title="TODOs" color="warning">
        <ul>
          <li>Fix validation rules, state is null in the beginning</li>
          <li>Define custom date text field with opening date picker</li>
          <li>
            Fix bug with value not being shown and instead label being shown (might be related to
            type)
          </li>
          <li>
            Fix bug with text field being selected and thus two clicks are needed to select date
          </li>
          <li>Fix bug with time zone</li>
        </ul>
      </v-alert>
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
