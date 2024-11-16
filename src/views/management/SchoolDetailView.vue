<script setup>
import { useSchoolsStore, housing_options, registration_status_options } from '../../stores/schools'

import { useRoute, useRouter } from 'vue-router'

const route = useRoute()
const router = useRouter()
const schoolsStore = useSchoolsStore()
schoolsStore.getSchool(route.params.school_id)

const updateSchool = (school_id) => {
  // update school
  schoolsStore.updateSchool(school_id)

  // go back to schools view
  router.push({ name: 'schools' })
}

const validationRules = {
  nameRules: [
    (v) => !!v || 'School name is required',
    (v) => v.length <= 50 || 'Name must be less than 50 characters'
  ],
  countryRules: [
    (v) => !!v || 'Country of origin is required',
    (v) => v.length <= 50 || 'Country of origin must be less than 50 characters'
  ]
}
</script>

<template>
  <div class="">
    <v-breadcrumbs
      :items="[{ title: 'Schools', to: { name: 'schools' } }, { title: schoolsStore.school.name }]"
    >
      <template v-slot:prepend>
        <v-icon icon="mdi-bank" size="small" start></v-icon>
      </template>
    </v-breadcrumbs>
    <v-form>
      <v-container>
        <v-row>
          <v-col cols="6">
            <v-text-field
              v-model="schoolsStore.school.name"
              label="Name *"
              hint="Name will be used like this for badges and certificates."
              prepend-icon="mdi-bank"
              :rules="validationRules.nameRules"
              required
            ></v-text-field>
          </v-col>
          <v-col cols="6">
            <v-text-field
              v-model="schoolsStore.school.country"
              label="Country of origin *"
              prepend-icon="mdi-flag"
              :rules="validationRules.countryRules"
              required
            >
            </v-text-field>
          </v-col>
          <v-col cols="4">
            <v-text-field
              v-model="schoolsStore.school.street"
              label="Street Name and House Number *"
              prepend-icon="mdi-home-floor-1"
              :rules="validationRules.streetNameRules"
              required
            ></v-text-field>
          </v-col>
          <v-col cols="4">
            <v-text-field
              v-model="schoolsStore.school.zipcode"
              label="ZIP Code *"
              prepend-icon="mdi-numeric"
              :rules="validationRules.zipcodeRules"
              required
            ></v-text-field>
          </v-col>
          <v-col cols="4">
            <v-text-field
              v-model="schoolsStore.school.city"
              label="City *"
              prepend-icon="mdi-home-city"
              :rules="validationRules.cityRules"
              required
            ></v-text-field>
          </v-col>
          <v-col cols="2">
            <v-text-field
              v-model="schoolsStore.school.requested"
              label="Number of requested students *"
              prepend-icon="mdi-account-group"
              hint="Note, that this is the <b>requested</b> number, <u>not</u> the confirmed one which might be lower."
              :rules="validationRules.requestedRules"
              required
            ></v-text-field>
          </v-col>

          <v-col cols="2">
            <v-select
              v-model="schoolsStore.school.housing_delegates"
              :items="housing_options"
              item-title="text"
              item-value="value"
              label="Housing Delegates *"
              hint="Please note, that housing in guest families is not available for all delegations and we will prefer international delegations in our housing who travels the longest distances."
            ></v-select>
          </v-col>
          <v-col cols="2">
            <v-select
              v-model="schoolsStore.school.housing_mun_directors"
              :items="housing_options"
              item-title="text"
              item-value="value"
              label="Housing MUN-Directors *"
              hint="Please note, that housing in guest families is not available for all delegations and we will prefer international delegations in our housing who travels the longest distances."
            ></v-select>
          </v-col>
          <v-col cols="4">
            <v-select
              v-model="schoolsStore.school.registration_status"
              :items="registration_status_options"
              item-title="text"
              item-value="value"
              label="Registration status"
              hint="This status indicates at which stage of registration the school is."
            ></v-select>
          </v-col>
          <v-col cols="2"
            ><v-checkbox
              v-model="schoolsStore.school.fee_paid"
              label="Pre-registration fee paid?"
              append-icon="mdi-currency-eur"
              hint="Has the pre-registration fee already been paid?"
            ></v-checkbox
          ></v-col>
          <v-col cols="4">
            <v-textarea
              v-model="schoolsStore.school.arrival"
              outlined
              auto-grow
              rows="3"
              label="Arrival Information"
              hint="Please provide date, time and location (e.g. school, conference venue, train station, airport, ...) of arrival here so that we can plan the registration process and housing respectively."
            ></v-textarea>
          </v-col>
          <v-col cols="4">
            <v-textarea
              v-model="schoolsStore.school.departure"
              outlined
              auto-grow
              rows="3"
              label="Departure Information"
              hint="Please provide date, time and location (e.g. conference venue, train station, airport, ...) of departure here so that we can plan in advance."
            ></v-textarea>
          </v-col>
          <v-col cols="4">
            <v-textarea
              v-model="schoolsStore.school.comment"
              outlined
              auto-grow
              rows="3"
              label="Internal Comment"
              hint="Write down notes and comments regarding this school here, e.g. outstanding fees, contact persons names, etc."
            ></v-textarea>
          </v-col>
        </v-row>
        <v-row class="justify-center">
          <v-btn
            id="submit-btn"
            color="primary"
            prepend-icon="mdi-send"
            :loading="schoolsStore.button_loading"
            @click="updateSchool(schoolsStore.school.id)"
            >update school</v-btn
          >
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
