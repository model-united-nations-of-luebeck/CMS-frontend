<script setup>
// import { inject } from "vue";
// const http = inject("backend_instance");
import { useForumsStore } from "../../stores/forums";
import { useDelegatesStore } from "../../stores/delegates";
import { useMUNDirectorsStore } from "../../stores/mun_directors";
import { useStudentOfficersStore } from "../../stores/student_officers";
import { useExecutivesStore } from "../../stores/executives";
import { useStaffsStore } from "../../stores/staffs";
import { useAdvisorsStore } from "../../stores/advisors";
const forumsStore = useForumsStore();
forumsStore.getForums();
const delegatesStore = useDelegatesStore();
delegatesStore.getDelegates();
const studentOfficersStore = useStudentOfficersStore();
studentOfficersStore.getStudentOfficers();
const executivesStore = useExecutivesStore();
executivesStore.getExecutives();
const staffsStore = useStaffsStore();
staffsStore.getStaffs();
const munDirectorsStore = useMUNDirectorsStore();
munDirectorsStore.getMUNDirectors();
const advisorsStore = useAdvisorsStore();
advisorsStore.getAdvisors();
import EmailListField from "../../components/inputs/EmailListField.vue";
</script>

<template>
  <div id="container">
    <v-alert border="start" color="primary" variant="tonal">
      To send emails quickly to participants without copying every email address, you can use the
      following lists of semi-colon separated email addresses per participant role. You can copy and
      paste these lists into the BCC field of your email client to send emails to all participants
      of a specific role without revealing their email addresses to each other.
    </v-alert>

    <v-container style="display: inline">
      <v-row>
        <v-col cols="12" md="6">
          <v-card title="Email Lists per Role" class="h-100">
            <v-card-text>
              <EmailListField
                icon="mdi-account-tie"
                title="All Delegates"
                :emails="delegatesStore.delegates.map((d) => d.email).join('; ')"
              ></EmailListField>
              <EmailListField
                icon="mdi-account-star"
                title="All Ambassadors"
                :emails="
                  delegatesStore.delegates
                    .filter((d) => d.ambassador === true)
                    .map((d) => d.email)
                    .join('; ')
                "
              ></EmailListField>
              <EmailListField
                icon="mdi-school"
                title="All MUN-Directors"
                :emails="munDirectorsStore.mun_directors.map((d) => d.email).join('; ')"
              ></EmailListField>
              <EmailListField
                icon="mdi-account-settings"
                title="All Student Officers"
                :emails="studentOfficersStore.student_officers.map((d) => d.email).join('; ')"
              ></EmailListField>
              <EmailListField
                icon="mdi-account-settings"
                title="All Executives"
                :emails="executivesStore.executives.map((d) => d.email).join('; ')"
              ></EmailListField>
              <EmailListField
                icon="mdi-account"
                title="All Staffs"
                :emails="staffsStore.staffs.map((d) => d.email).join('; ')"
              ></EmailListField>
              <EmailListField
                icon="mdi-account-star"
                title="All Advisors"
                :emails="advisorsStore.advisors.map((d) => d.email).join('; ')"
              ></EmailListField>
            </v-card-text>
          </v-card>
        </v-col>
        <v-col cols="12" md="6">
          <v-card title="Email Lists - Forums" class="h-100">
            <v-card-text>
              <EmailListField
                v-for="forum in forumsStore.forums"
                :key="forum.id"
                icon="mdi-forum"
                :title="forum.abbreviation"
                :emails="
                  delegatesStore.delegates
                    .filter((d) => d.forum === forum.id)
                    .map((d) => d.email)
                    .join('; ')
                "
              ></EmailListField>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
    </v-container>

    <p></p>
  </div>
</template>

<style scoped></style>
