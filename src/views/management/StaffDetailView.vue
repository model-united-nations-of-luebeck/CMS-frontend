<script setup>
import { ref } from "vue";
import { useStaffsStore } from "../../stores/staffs";
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
import ConsentField from "../../components/inputs/ConsentField.vue";

const { mobile } = useDisplay();
const route = useRoute();
const router = useRouter();
const staffsStore = useStaffsStore();
staffsStore.getStaff(route.params.staff_id);

const updateStaff = (staff_id) => {
  // update staff
  staffsStore.updateStaff(staff_id);

  // go back to staffs view
  router.push({ name: "staffs" });
};

const valid = ref(true);
</script>

<template>
  <div class="">
    <v-breadcrumbs
      :items="[
        { title: 'Staffs', to: { name: 'staffs' } },
        {
          title: `${staffsStore.staff?.first_name} ${staffsStore.staff?.last_name}`,
        },
      ]"
    >
      <template v-slot:prepend>
        <v-icon icon="mdi-account" size="small" start></v-icon>
      </template>
    </v-breadcrumbs>

    <v-form v-model="valid" validate-on="blur">
      <v-container fluid>
        <v-row no-gutters="">
          <v-col cols="12" sm="12" md="6">
            <NameFields
              v-model:first_name="staffsStore.staff.first_name"
              v-model:last_name="staffsStore.staff.last_name"
            ></NameFields>

            <v-text-field
              v-model="staffsStore.staff.position_name"
              label="Position"
              prepend-icon="mdi-account-tie"
              type="text"
            ></v-text-field>
            <v-text-field
              v-model="staffsStore.staff.school_name"
              label="School"
              prepend-icon="mdi-school"
              type="text"
            ></v-text-field>

            <GenderSelector
              v-model:gender="staffsStore.staff.gender"
            ></GenderSelector>

            <PronounsSelector
              v-model:pronouns="staffsStore.staff.pronouns"
            ></PronounsSelector>

            <EmailAddressField
              v-model:email="staffsStore.staff.email"
            ></EmailAddressField>
            <PhoneNumberField
              v-model:phone="staffsStore.staff.mobile"
            ></PhoneNumberField>
            <BirthdateField
              v-model:birthday="staffsStore.staff.birthday"
            ></BirthdateField>
            <DietSelector v-model:diet="staffsStore.staff.diet"></DietSelector>
            <ExtrasField
              v-model:extras="staffsStore.staff.extras"
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
              v-model:image="staffsStore.staff.picture"
            ></BadgePhotoCropper>
          </v-col>
        </v-row>
        <v-row no-gutters>
          <ConsentField
            v-model:data_consent_time="staffsStore.staff.data_consent_time"
            v-model:data_consent_ip="staffsStore.staff.data_consent_ip"
            v-model:media_consent_time="staffsStore.staff.media_consent_time"
            v-model:media_consent_ip="staffsStore.staff.media_consent_ip"
          ></ConsentField>
        </v-row>
        <v-row no-gutters class="justify-center">
          <div>
            <span
              v-if="!staffsStore.staff.picture"
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
              @click="updateStaff(staffsStore.staff.id)"
              >Update Staff</v-btn
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
