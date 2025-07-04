<script setup>
import { ref } from "vue";
import { useDelegatesStore } from "../../stores/delegates";
import { useRoute, useRouter } from "vue-router";
import { useDisplay } from "vuetify";
import NameFields from "../../components/inputs/NameFields.vue";
import GenderSelector from "../../components/inputs/GenderSelector.vue";
import PronounsSelector from "../../components/inputs/PronounsSelector.vue";
import EmailAddressField from "../../components/inputs/EmailAddressField.vue";
import PhoneNumberField from "../../components/inputs/PhoneNumberField.vue";
import DietSelector from "../../components/inputs/DietSelector.vue";
import ExtrasField from "../../components/inputs/ExtrasField.vue";
import BadgePhotoCropper from "../../components/BadgePhotoCropper.vue";
import BirthdateField from "../../components/inputs/BirthdateField.vue";
import CheckboxField from "../../components/inputs/CheckboxField.vue";
import ConsentField from "../../components/inputs/ConsentField.vue";

const conference_abbr = import.meta.env.VITE_CONFERENCE_ABBREVIATION;

const { mobile } = useDisplay();
const route = useRoute();
const router = useRouter();
const delegatesStore = useDelegatesStore();
delegatesStore.getDelegate(route.params.delegate_id);

const updateDelegate = (delegate_id) => {
  // update delegate
  delegatesStore.updateDelegate(delegate_id);

  // go back to delegates view
  router.push({ name: "delegates" });
};

const valid = ref(true);
</script>

<template>
  <div class="">
    <v-breadcrumbs
      :items="[
        { title: 'Delegates', to: { name: 'delegates' } },
        {
          title: `${delegatesStore.delegate?.first_name} ${delegatesStore.delegate?.last_name}`,
        },
      ]"
    >
      <template v-slot:prepend>
        <v-icon icon="mdi-account-tie" size="small" start></v-icon>
      </template>
    </v-breadcrumbs>

    <v-form v-model="valid" validate-on="blur">
      <v-container fluid>
        <v-row no-gutters="">
          <v-col cols="12" sm="12" md="6">
            <NameFields
              v-model:first_name="delegatesStore.delegate.first_name"
              v-model:last_name="delegatesStore.delegate.last_name"
            ></NameFields>

            <GenderSelector
              v-model:gender="delegatesStore.delegate.gender"
            ></GenderSelector>

            <PronounsSelector
              v-model:pronouns="delegatesStore.delegate.pronouns"
            ></PronounsSelector>

            <EmailAddressField
              v-model:email="delegatesStore.delegate.email"
            ></EmailAddressField>
            <PhoneNumberField
              v-model:phone="delegatesStore.delegate.mobile"
            ></PhoneNumberField>
            <BirthdateField
              v-model:birthday="delegatesStore.delegate.birthday"
            ></BirthdateField>
            <DietSelector
              v-model:diet="delegatesStore.delegate.diet"
            ></DietSelector>
            <CheckboxField
              v-model:value="delegatesStore.delegate.first_timer"
              :label="`Will ${conference_abbr} be your first MUN conference?`"
              hint="There is a first MUN conference for everyone. Knowing this in advance, the team can prepare a smooth first conference for first timers."
              prepend-icon="mdi-account-question"
            ></CheckboxField>
            <ExtrasField
              v-model:extras="delegatesStore.delegate.extras"
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
              v-model:image="delegatesStore.delegate.picture"
            ></BadgePhotoCropper>
          </v-col>
        </v-row>
        <v-row no-gutters>
          <ConsentField
            v-model:data_consent_time="
              delegatesStore.delegate.data_consent_time
            "
            v-model:data_consent_ip="delegatesStore.delegate.data_consent_ip"
            v-model:media_consent_time="
              delegatesStore.delegate.media_consent_time
            "
            v-model:media_consent_ip="delegatesStore.delegate.media_consent_ip"
          ></ConsentField>
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
              :disabled="!valid"
              @click="updateDelegate(delegatesStore.delegate.id)"
              >Update Delegate</v-btn
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
