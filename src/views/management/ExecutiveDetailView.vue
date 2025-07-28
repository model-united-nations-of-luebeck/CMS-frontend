<script setup>
import { ref } from "vue";
import { useExecutivesStore } from "../../stores/executives";
import { useRoute, useRouter } from "vue-router";
import { useDisplay } from "vuetify";
import NameFields from "../../components/inputs/NameFields.vue";
import GenderSelector from "../../components/inputs/GenderSelector.vue";
import PronounsSelector from "../../components/inputs/PronounsSelector.vue";
import EmailAddressField from "../../components/inputs/EmailAddressField.vue";
import PhoneNumberField from "../../components/inputs/PhoneNumberField.vue";

import ExtrasField from "../../components/inputs/ExtrasField.vue";
import BadgePhotoCropper from "../../components/BadgePhotoCropper.vue";
import BirthdateField from "../../components/inputs/BirthdateField.vue";
import ConsentField from "../../components/inputs/ConsentField.vue";

const { mobile } = useDisplay();
const route = useRoute();
const router = useRouter();
const executivesStore = useExecutivesStore();
executivesStore.getExecutive(route.params.executive_id);

const updateExecutive = (executive_id) => {
  // update executive
  executivesStore.updateExecutive(executive_id);

  // go back to executives view
  router.push({ name: "executives" });
};

const valid = ref(true);
</script>

<template>
  <div class="">
    <v-breadcrumbs
      :items="[
        { title: 'Executives', to: { name: 'executives' } },
        {
          title: `${executivesStore.executive?.first_name} ${executivesStore.executive?.last_name}`,
        },
      ]"
    >
      <template v-slot:prepend>
        <v-icon icon="mdi-account-settings" size="small" start></v-icon>
      </template>
    </v-breadcrumbs>

    <v-form v-model="valid" validate-on="blur">
      <v-container fluid>
        <v-row no-gutters="">
          <v-col cols="12" sm="12" md="6">
            <NameFields
              v-model:first_name="executivesStore.executive.first_name"
              v-model:last_name="executivesStore.executive.last_name"
            ></NameFields>

            <v-text-field
              v-model="executivesStore.executive.position_name"
              label="Position"
              prepend-icon="mdi-account-tie"
              type="text"
            ></v-text-field>
            <v-text-field
              v-model="executivesStore.executive.school_name"
              label="School"
              prepend-icon="mdi-school"
              type="text"
            ></v-text-field>

            <GenderSelector
              v-model:gender="executivesStore.executive.gender"
            ></GenderSelector>

            <PronounsSelector
              v-model:pronouns="executivesStore.executive.pronouns"
            ></PronounsSelector>

            <EmailAddressField
              v-model:email="executivesStore.executive.email"
            ></EmailAddressField>
            <PhoneNumberField
              v-model:phone="executivesStore.executive.mobile"
            ></PhoneNumberField>
            <BirthdateField
              v-model:birthday="executivesStore.executive.birthday"
            ></BirthdateField>
            <ExtrasField
              v-model:extras="executivesStore.executive.extras"
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
              v-model:image="executivesStore.executive.picture"
            ></BadgePhotoCropper>
          </v-col>
        </v-row>
        <v-row no-gutters>
          <ConsentField
            v-model:data_consent_time="
              executivesStore.executive.data_consent_time
            "
            v-model:data_consent_ip="executivesStore.executive.data_consent_ip"
            v-model:media_consent_time="
              executivesStore.executive.media_consent_time
            "
            v-model:media_consent_ip="
              executivesStore.executive.media_consent_ip
            "
          ></ConsentField>
        </v-row>
        <v-row no-gutters class="justify-center">
          <div>
            <span
              v-if="!executivesStore.executive.picture"
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
              @click="updateExecutive(executivesStore.executive.id)"
              >Update Executive</v-btn
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
</style>
