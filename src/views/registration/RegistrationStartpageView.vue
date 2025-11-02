<script setup>
import { useRoute } from "vue-router";
import { useConferenceStore } from "../../stores/conference";
import { useDisplay } from "vuetify";
import { useSchoolsStore } from "../../stores/schools";
const { mobile } = useDisplay();

const conference_abbr = import.meta.env.VITE_CONFERENCE_ABBREVIATION;

const route = useRoute();

const conferenceStore = useConferenceStore();
conferenceStore.getCurrentConference();
const schoolsStore = useSchoolsStore();
schoolsStore.getSchool(route.params.school_id);
</script>

<template>
  <div class="registration-startpage">
    <v-alert>
      <p>
        Dear MUN-Director, <br />
        thank you for your efforts to enable your students to participate in
        {{ conference_abbr }} {{ conferenceStore.conference?.year }}. <br />On this platform you can
        enter the required information for your delegation.<br />
        If you have any questions or need assistance, please don't hesitate to write us an email to
        <a href="mailto:conferencemanager@munol.org">conferencemanager@munol.org</a>.<br />
        Your Conference Managers
      </p>
    </v-alert>
    <v-sheet id="sheet" :elevation="mobile ? 0 : 2" :rounded="mobile ? false : 'lg'">
      <div id="registration-timeline">
        <div class="reg-intro">
          <h2 class="py-4">Registration Procedure</h2>
          <p>
            The process of applying for and getting enrolled into the
            {{ conference_abbr }}
            conference is called registration. In general, registration is divided into
            pre-registration and final registration. The entire registration process will be done
            online on this online registration platform. At any time, the Conference Managers are
            happy to guide you through the registration process, let you know what steps to take
            next and answer any questions.
          </p>
        </div>
        <v-timeline
          class="py-4"
          :side="mobile ? 'end' : false"
          :size="mobile ? 'small' : 'default'"
        >
          <v-timeline-item dot-color="primary" icon="mdi-account-edit">
            <template v-slot:opposite v-if="!mobile">
              <p>Fall to Christmas</p>
              <span :class="`font-weight-light`"
                >Deadline:
                {{
                  new Date(
                    conferenceStore.conference?.pre_registration_deadline,
                  ).toLocaleDateString("en")
                }}</span
              >
            </template>
            <v-card class="py-4">
              <v-card-title :class="`headline font-weight-bold mb-4 red--text`"
                >Pre-Registration</v-card-title
              >
              <v-card-subtitle v-if="mobile">
                <p>Fall to Christmas</p>
                <span :class="`font-weight-light`"
                  >Deadline:
                  {{
                    new Date(
                      conferenceStore.conference?.pre_registration_deadline,
                    ).toLocaleDateString("en")
                  }}</span
                >
              </v-card-subtitle>
              <v-card-text>
                The aim of pre-registration is to figure out how many schools want to attend the
                conference with how many delegates. During pre-registration MUN-Directors basically
                just show interest to take part in the next {{ conference_abbr }} session by
                submitting their school’s name, contact details and most importantly a number of
                students they would like to take to Lübeck. Please note, that this is the number of
                students requested. Although the Conference Managers do their best to fulfil all
                requests and constraints, this is not always possible. So, it might happen that only
                a smaller number of students will be confirmed by the Conference Managers. Sometimes
                however, places become free again and MUN-Directors might be granted to bring more
                students. The deadline for pre-registration is usually before Christmas in December.
                Make sure to transfer the pre-registration fee in time so that the Conference
                Managers can take your delegation into consideration. In the past, there we several
                schools quitting registration at a late point and messed up all preparation that’s
                why the fee was introduced. The pre-registration fee will be charged against the
                conference fee, so this is no extra cost for your delegates. Of course, we will only
                charge the number of students the Conference Managers confirm, although the fee for
                the number of requested students has to be paid first.
              </v-card-text>
              <v-card-actions class="justify-center">
                <v-btn
                  prepend-icon="mdi-account-edit"
                  variant="tonal"
                  color="primary"
                  :to="{
                    name: 'pre-registration',
                    params: { school_id: route.params.school_id },
                  }"
                  >Enter pre-registration data</v-btn
                >
              </v-card-actions>
            </v-card>
          </v-timeline-item>
          <v-timeline-item dot-color="primary" icon="mdi-gesture-double-tap">
            <template v-slot:opposite v-if="!mobile">
              <span class="">Between the years</span>
            </template>
            <v-card>
              <v-card-title :class="`font-weight-bold`">Country Allocation</v-card-title>
              <v-card-subtitle v-if="mobile">
                <span class="">Between the years</span>
              </v-card-subtitle>
              <v-card-text>
                Within the next couple of weeks, the Conference Managers in close cooperation with
                the Secretaries-General do the country allocation. Basically, they decide which
                delegations (states, non-governmental organisations, inter-governmental
                organisations, ...) will be represented in which forums and which delegation will be
                represented by which school. Like this, they will determine the number of students
                they confirm to each MUN-Director to bring to the conference and will inform them
                via email about it.
              </v-card-text>
            </v-card>
          </v-timeline-item>
          <v-timeline-item dot-color="primary" icon="mdi-account-check">
            <template v-slot:opposite v-if="!mobile">
              <p>Spring</p>
              <span :class="`font-weight-light`"
                >Deadline:
                {{
                  new Date(
                    conferenceStore.conference?.final_registration_deadline,
                  ).toLocaleDateString("en")
                }}</span
              >
            </template>
            <v-card class="py-4">
              <v-card-title>Final Registration</v-card-title>
              <v-card-subtitle v-if="mobile">
                <p>Spring</p>
                <span :class="`font-weight-light`"
                  >Deadline:
                  {{
                    new Date(
                      conferenceStore.conference?.final_registration_deadline,
                    ).toLocaleDateString("en")
                  }}</span
                >
              </v-card-subtitle>
              <v-card-text>
                In the final registration step, MUN-Directors as well as the participating students
                provide some personal information required for organizing the conference. As the
                information is personal and protected by data privacy regulations, each
                participating person has to give their consent for the data processing and storage
                first, before the data can be entered. Besides personal information like names,
                titles, email addresses, birth dates, diet also some conference-related information
                has to be set, e.g. who is the ambassador of the delegation or whether the
                MUN-Director is an English teacher. Participants are also asked to upload a photo in
                the style of a passport photo which will be used to create their badges. Once all
                the information is provided the Conference Managers will review everything. They
                will let you know if anything needs to be done or if you’ve just completed the
                registration successfully.
              </v-card-text>
              <v-card-actions class="justify-center">
                <span
                  v-tooltip="{
                    text: 'Pre-registration needs to be completed first, before entering final registration data.',
                    location: 'bottom',
                    disabled: [
                      'WAITING_FOR_FINAL_REGISTRATION',
                      'FINAL_REGISTRATION_DONE',
                    ].includes(schoolsStore.school?.registration_status),
                  }"
                >
                  <v-btn
                    :to="{
                      name: 'final-registration',
                      params: { school_id: route.params.school_id },
                    }"
                    prepend-icon="mdi-account-check"
                    :disabled="
                      !['WAITING_FOR_FINAL_REGISTRATION', 'FINAL_REGISTRATION_DONE'].includes(
                        schoolsStore.school?.registration_status,
                      )
                    "
                    variant="tonal"
                    color="primary"
                    >Enter final registration data</v-btn
                  >
                </span>
              </v-card-actions>
            </v-card>
          </v-timeline-item>
          <v-timeline-item dot-color="primary" icon="mdi-account-group">
            <template v-slot:opposite v-if="!mobile">
              <span v-if="conferenceStore.conference?.start_date">{{
                new Date(conferenceStore.conference?.start_date).toLocaleDateString("en")
              }}</span>
              -
              <span v-if="conferenceStore.conference?.end_date">{{
                new Date(conferenceStore.conference?.end_date).toLocaleDateString("en")
              }}</span>
            </template>
            <v-card class="py-4">
              <v-card-title :class="`font-weight-bold`"
                >{{ conference_abbr }} {{ conferenceStore.conference?.year }}</v-card-title
              >
              <v-card-subtitle v-if="mobile">
                <span v-if="conferenceStore.conference?.start_date">{{
                  new Date(conferenceStore.conference?.start_date).toLocaleDateString("en")
                }}</span>
                -
                <span v-if="conferenceStore.conference?.end_date">{{
                  new Date(conferenceStore.conference?.end_date).toLocaleDateString("en")
                }}</span>
              </v-card-subtitle>
              <v-card-text>
                The conference takes place in Lübeck. You will be welcomed by the organizing team
                during the Opening Ceremonies. Enjoy the week, meet new people, discuss global
                issues, make friends, solve international problems and have an unforgettable week.
              </v-card-text>
            </v-card>
          </v-timeline-item>
        </v-timeline>
      </div>
    </v-sheet>
  </div>
</template>

<style>
.registration-startpage {
  padding: 20px;
}

.v-alert {
  margin: 0px 50px 20px 50px;
  @media (max-width: 600px) {
    margin: 0px;
  }
}

#sheet {
  margin: 10px 50px;

  /* on mobile screens no margin */
  @media (max-width: 600px) {
    margin: 0px 0;
  }
}

.reg-intro {
  padding: 20px;
}

#registration-timeline {
  margin: 0px 100px;

  /* on mobile screens no margin */
  @media (max-width: 600px) {
    margin: 0px 0px;
  }
}

.v-timeline-item__opposite {
  @media (max-width: 600px) {
    display: none;
  }
}

.v-timeline-item__body {
  @media (max-width: 600px) {
    padding: 5px !important;
  }
}
</style>
