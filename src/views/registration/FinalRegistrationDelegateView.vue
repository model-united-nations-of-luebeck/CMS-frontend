<script setup>
import { ref, onMounted } from "vue";
import { useDelegatesStore } from "../../stores/delegates";
import { useMemberOrganizationsStore } from "../../stores/member_organizations";
import { useForumsStore } from "../../stores/forums";
import { useConferenceStore } from "../../stores/conference";
import { useRoute } from "vue-router";
import { useDisplay } from "vuetify";
import { toast } from "vue3-toastify";
import "vue3-toastify/dist/index.css";
import NameFields from "../../components/inputs/NameFields.vue";
import GenderSelector from "../../components/inputs/GenderSelector.vue";
import PronounsSelector from "../../components/inputs/PronounsSelector.vue";

import EmailAddressField from "../../components/inputs/EmailAddressField.vue";
import PhoneNumberField from "../../components/inputs/PhoneNumberField.vue";
import ExtrasField from "../../components/inputs/ExtrasField.vue";
import BadgePhotoCropper from "../../components/BadgePhotoCropper.vue";
import BirthdateField from "../../components/inputs/BirthdateField.vue";
import CheckboxField from "../../components/inputs/CheckboxField.vue";
import ConsentField from "../../components/inputs/ConsentField.vue";

const conference_abbr = import.meta.env.VITE_CONFERENCE_ABBREVIATION;

const { mobile } = useDisplay();

const route = useRoute();

const delegatesStore = useDelegatesStore();
const memberOrganizationsStore = useMemberOrganizationsStore();
memberOrganizationsStore.getMemberOrganizations();
const forumsStore = useForumsStore();
forumsStore.getForums();
const conferenceStore = useConferenceStore();
conferenceStore.getCurrentConference();
const valid = ref(true);
const emit = defineEmits(["show-login-dialog"]);

async function loadData() {
  if (route.params.delegate_id) {
    delegatesStore.getDelegate(route.params.delegate_id).catch((err) => {
      if (err?.response?.status === 403) {
        emit("show-login-dialog", err?.response);
      }
    });
  } else {
    toast.error("Delegate not found. Please ask admin for help.", {
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
  <div class="delegate-reg" v-if="delegatesStore.delegate">
    <div
      id="intro"
      v-if="
        memberOrganizationsStore.loading == false &&
        forumsStore.loading == false &&
        delegatesStore.loading == false
      "
    >
      <v-alert>
        <p>
          Dear Delegate, <br />

          we are excited that you are participating in {{ conference_abbr }}
          {{ conferenceStore.conference.year }} as a delegate of the
          <b>{{
            memberOrganizationsStore.member_organizations?.find(
              (org) => org.id == delegatesStore.delegate.represents,
            ).official_name
          }}</b>
          in the
          <b>{{
            forumsStore.forums?.find((forum) => forum.id === delegatesStore.delegate.forum).name
          }}</b
          >. To organize the conference and prepare everything, we would like you to fill in this
          form and upload a photo for your badge. Please don't hesitate contacting the Conference
          Managers in case you have any questions
          <a href="mailto:conferencemanager@munol.org">conferencemanager@munol.org</a>.
        </p>
        <p>Your Conference Managers</p>
      </v-alert>

      <v-alert
        id="ambassador-info"
        v-if="delegatesStore.delegate.ambassador"
        title="Ambassador"
        type="warning"
        icon="mdi-account-star"
        :text="`
        You've been selected as the ambassador of your delegation. Thus, you not only represent
        the
        ${
          memberOrganizationsStore.member_organizations?.find(
            (org) => org.id == delegatesStore.delegate.represents,
          ).official_name
        }
        in your forum, but also act on its behalf as the ambassador of
        ${
          memberOrganizationsStore.member_organizations?.find(
            (org) => org.id == delegatesStore.delegate.represents,
          ).short_name
        }. For example, you may give an opening speech in the General Assembly or a statement in
        other forums. If you don't want to be the ambassador of your delegation, please get in
        touch with your MUN-Director and ask them to give this role to another delegate.
      `"
      >
      </v-alert>
    </div>

    <v-form v-model="valid" validate-on="blur">
      <v-container fluid>
        <v-row no-gutters="">
          <v-col cols="12" sm="12" md="6">
            <NameFields
              v-model:first_name="delegatesStore.delegate.first_name"
              v-model:last_name="delegatesStore.delegate.last_name"
            ></NameFields>

            <GenderSelector v-model:gender="delegatesStore.delegate.gender"></GenderSelector>

            <PronounsSelector
              v-model:pronouns="delegatesStore.delegate.pronouns"
            ></PronounsSelector>

            <EmailAddressField v-model:email="delegatesStore.delegate.email"></EmailAddressField>
            <PhoneNumberField v-model:phone="delegatesStore.delegate.mobile"></PhoneNumberField>
            <BirthdateField v-model:birthday="delegatesStore.delegate.birthday"></BirthdateField>
            <CheckboxField
              v-model:value="delegatesStore.delegate.first_timer"
              :label="`Will ${conference_abbr} be your first MUN conference?`"
              hint="There is a first MUN conference for everyone. Knowing this in advance, the team can prepare a smooth first conference for first timers."
              prepend-icon="mdi-account-question"
            ></CheckboxField>
            <ExtrasField v-model:extras="delegatesStore.delegate.extras"></ExtrasField>
          </v-col>

          <v-col
            cols="12"
            sm="12"
            md="4"
            :offset="mobile ? 0 : 8"
            :class="mobile ? '' : 'badge-photo'"
          >
            <BadgePhotoCropper v-model:image="delegatesStore.delegate.picture"></BadgePhotoCropper>
          </v-col>
        </v-row>
        <v-row no-gutters>
          <v-col cols="12" sm="12" md="6">
            <ConsentField
              v-model:data_consent_time="delegatesStore.delegate.data_consent_time"
              v-model:data_consent_ip="delegatesStore.delegate.data_consent_ip"
              v-model:media_consent_time="delegatesStore.delegate.media_consent_time"
              v-model:media_consent_ip="delegatesStore.delegate.media_consent_ip"
            ></ConsentField>
          </v-col>
        </v-row>
        <v-row no-gutters class="justify-center">
          <div>
            <span
              v-if="!delegatesStore.delegate.picture"
              id="missing-badge-photo"
              class="text-error"
              style="display: block"
              >Please upload a badge photo.</span
            >

            <v-btn
              id="submit-btn"
              color="primary"
              prepend-icon="mdi-send"
              :disabled="!valid || !delegatesStore.delegate.picture"
              @click="delegatesStore.updateDelegate(delegatesStore.delegate.id)"
              >Submit registration form</v-btn
            >
          </div>
        </v-row>
      </v-container>
    </v-form>
  </div>
</template>

<style>
.delegate-reg {
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

#ambassador-info {
  margin-top: 20px;
}
</style>
