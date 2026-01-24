<script setup>
import { ref, watch } from "vue";
import { useMUNDirectorsStore } from "../../stores/mun_directors";
import { useRoute, useRouter } from "vue-router";
import { useDisplay } from "vuetify";
import NameFields from "../../components/inputs/NameFields.vue";
import GenderSelector from "../../components/inputs/GenderSelector.vue";
import PronounsSelector from "../../components/inputs/PronounsSelector.vue";
import EmailAddressField from "../../components/inputs/EmailAddressField.vue";
import PhoneNumberField from "../../components/inputs/PhoneNumberField.vue";
import ExtrasField from "../../components/inputs/ExtrasField.vue";
import BadgePhotoCropper from "../../components/BadgePhotoCropper.vue";
import CheckboxField from "../../components/inputs/CheckboxField.vue";
import ConsentField from "../../components/inputs/ConsentField.vue";

const { mobile } = useDisplay();
const route = useRoute();
const router = useRouter();
const munDirectorsStore = useMUNDirectorsStore();

const fetchMUNDirector = () => {
  if (route.params.mun_director_id) {
    munDirectorsStore.getMUNDirector(route.params.mun_director_id);
  }
};

fetchMUNDirector();

watch(
  () => route.params.mun_director_id,
  () => {
    fetchMUNDirector();
  },
);

const updateMUNDirector = (mun_director_id) => {
  // update MUN director
  munDirectorsStore.updateMUNDirector(mun_director_id);

  // go back to MUN director view
  router.push({ name: "mun-directors" });
};

const valid = ref(true);
</script>

<template>
  <div class="">
    <v-breadcrumbs
      :items="[
        { title: 'MUN-Directors', to: { name: 'mun-directors' } },
        {
          title: `${munDirectorsStore.mun_director?.first_name} ${munDirectorsStore.mun_director?.last_name}`,
        },
      ]"
    >
      <template v-slot:prepend>
        <v-icon icon="mdi-school" size="small" start></v-icon>
      </template>
    </v-breadcrumbs>

    <v-form v-model="valid" validate-on="blur">
      <v-container fluid>
        <v-row no-gutters="">
          <v-col cols="12" sm="12" md="6">
            <NameFields
              v-model:first_name="munDirectorsStore.mun_director.first_name"
              v-model:last_name="munDirectorsStore.mun_director.last_name"
            ></NameFields>

            <GenderSelector v-model:gender="munDirectorsStore.mun_director.gender"></GenderSelector>

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
            <ExtrasField v-model:extras="munDirectorsStore.mun_director.extras"></ExtrasField>
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
            v-model:data_consent_time="munDirectorsStore.mun_director.data_consent_time"
            v-model:data_consent_ip="munDirectorsStore.mun_director.data_consent_ip"
            v-model:media_consent_time="munDirectorsStore.mun_director.media_consent_time"
            v-model:media_consent_ip="munDirectorsStore.mun_director.media_consent_ip"
            v-model:organizers_notice_time="munDirectorsStore.mun_director.organizers_notice_time"
            v-model:organizers_notice_ip="munDirectorsStore.mun_director.organizers_notice_ip"
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
              :disabled="!valid"
              @click="updateMUNDirector(munDirectorsStore.mun_director.id)"
              >Update MUN-Director</v-btn
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
