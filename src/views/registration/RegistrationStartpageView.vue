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
        <b>{{ conference_abbr }} {{ conferenceStore.conference?.year }}</b
        >. <br />On this platform you can enter all required information for your
        <b>delegation</b>.<br />
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
            The registration for the {{ conference_abbr }} conference consists of
            <b>pre-registration</b> and <b>final registration</b>, both done entirely <b>online</b>.
            The Conference Managers will guide you, explain next steps and answer questions anytime.
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
                <p>
                  Pre-registration determines <b>how many schools</b> wish to attend and with
                  <b>how many delegates</b>. MUN-Directors submit the <b>school name</b>,
                  <b>contact details</b>, and the <b>requested number of students</b> they would
                  like to take to Lübeck.
                </p>
                <br />

                <p>
                  Please note: The requested number may not always be confirmed; sometimes fewer or
                  later even more students can be accepted. Ensure timely transfer of the
                  <b>pre-registration fee</b> so your delegation is considered. This fee was
                  introduced to prevent late cancellations and is
                  <b>credited towards the conference fee</b> (no extra cost). You initially pay for
                  the <b>requested</b> number, but will ultimately only be charged for the
                  <b>confirmed</b> number of students.
                </p>
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
                Conference Managers and the Secretaries-General assign <b>delegations</b> (states,
                NGOs, IGOs, …) to forums and decide <b>which school represents which delegation</b>.
                You will be informed by email about the <b>confirmed number of students</b>.
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
                <p>
                  In this step, MUN-Directors and students submit all required <b>personal data</b>.
                  Each participant must give <b>data-processing consent</b> before entering
                  information.
                </p>
                <br />

                <p>You will provide:</p>
                <ul style="list-style-type: disc; margin-left: 20px">
                  <li><b>Personal details</b> (name, email, birth date, diet)</li>
                  <li>
                    <b>Conference-related details</b> (who is ambassador of the delegation, whether
                    an MUN-Director is an English teacher)
                  </li>
                  <li>A <b>passport-style photo</b> for the badge</li>
                </ul>
                <br />

                <p>
                  Conference Managers will verify your data and inform you if anything is missing or
                  if your registration is complete.
                </p>
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
                The conference takes place in <b>Lübeck</b>. You will be welcomed by the organizing
                team during the on-site registration where you can pick up your badges and
                conference materials. During the Opening Ceremonies you will meet all other
                participants for the first time. Enjoy the week, meet new people, discuss global
                issues, make friends, and have an <b>unforgettable experience.</b>
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
