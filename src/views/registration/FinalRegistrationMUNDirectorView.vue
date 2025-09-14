<script setup>
import { ref, onMounted } from "vue";
import { useMUNDirectorsStore } from "../../stores/mun_directors";
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
import CheckboxField from "../../components/inputs/CheckboxField.vue";
import ConsentField from "../../components/inputs/ConsentField.vue";

const conference_abbr = import.meta.env.VITE_CONFERENCE_ABBREVIATION;

const { mobile } = useDisplay();
const route = useRoute();
const munDirectorsStore = useMUNDirectorsStore();
const conferenceStore = useConferenceStore();
conferenceStore.getCurrentConference();
const valid = ref(true);
const emit = defineEmits(["show-login-dialog"]);

async function loadData() {
  if (route.params.mun_director_id) {
    munDirectorsStore
      .getMUNDirector(route.params.mun_director_id)
      .catch((err) => {
        if (err?.response?.status === 403) {
          emit("show-login-dialog", err?.response);
        }
      });
  } else {
    toast.error("MUN-Director not found. Please ask admin for help.", {
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
  <div class="mun-director-reg" v-if="munDirectorsStore.mun_director">
    <div id="intro" v-if="munDirectorsStore.loading == false">
      <v-alert>
        <p>
          Dear MUN-Director, <br />

          we are excited that you are participating in {{ conference_abbr }}
          {{ conferenceStore.conference.year }}. To organize the conference and
          prepare everything, we would like you to fill in this form and upload
          a photo for your badge. Please don't hesitate contacting the
          Conference Managers in case you have any questions
          <a href="mailto:conferencemanager@munol.org"
            >conferencemanager@munol.org</a
          >.
        </p>
        <p>Your Conference Managers</p>
      </v-alert>
    </div>

    <v-form v-model="valid" validate-on="blur">
      <v-container fluid>
        <v-row no-gutters="">
          <v-col cols="12" sm="12" md="6">
            <NameFields
              v-model:first_name="munDirectorsStore.mun_director.first_name"
              v-model:last_name="munDirectorsStore.mun_director.last_name"
            ></NameFields>

            <GenderSelector
              v-model:gender="munDirectorsStore.mun_director.gender"
            ></GenderSelector>

            <PronounsSelector
              v-model:pronouns="munDirectorsStore.mun_director.pronouns"
            ></PronounsSelector>

            <EmailAddressField
              v-model:email="munDirectorsStore.mun_director.email"
            ></EmailAddressField>
            <PhoneNumberField
              v-model:phone="munDirectorsStore.mun_director.mobile"
            ></PhoneNumberField>
            <CheckboxField
              v-model:value="munDirectorsStore.mun_director.english_teacher"
              label="Are you an English teacher and able to help checking the grammar of written resolutions?"
              prepend-icon="mdi-human-male-board"
            ></CheckboxField>
            <ExtrasField
              v-model:extras="munDirectorsStore.mun_director.extras"
            ></ExtrasField>
          </v-col>

          <v-col
            cols="12"
            sm="12"
            md="4"
            :offset="mobile ? 0 : 8"
            :class="mobile ? '' : 'badge-photo'"
          >
            <BadgePhotoCropper
              v-model:image="munDirectorsStore.mun_director.picture"
            ></BadgePhotoCropper>
          </v-col>
        </v-row>
        <v-row no-gutters>
          <ConsentField
            v-model:data_consent_time="
              munDirectorsStore.mun_director.data_consent_time
            "
            v-model:data_consent_ip="
              munDirectorsStore.mun_director.data_consent_ip
            "
            v-model:media_consent_time="
              munDirectorsStore.mun_director.media_consent_time
            "
            v-model:media_consent_ip="
              munDirectorsStore.mun_director.media_consent_ip
            "
          ></ConsentField>
        </v-row>
        <v-row no-gutters class="justify-center">
          <div>
            <span
              v-if="!munDirectorsStore.mun_director.picture"
              id="missing-badge-photo"
              class="text-error"
              style="display: block"
              >Please upload a badge photo.</span
            >

            <v-btn
              id="submit-btn"
              color="primary"
              prepend-icon="mdi-send"
              :disabled="!valid || !munDirectorsStore.mun_director.picture"
              @click="
                munDirectorsStore.updateMUNDirector(
                  munDirectorsStore.mun_director.id,
                )
              "
              >Submit registration form</v-btn
            >
          </div>
        </v-row>
      </v-container>
    </v-form>
  </div>
</template>

<style>
.mun-director-reg {
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
