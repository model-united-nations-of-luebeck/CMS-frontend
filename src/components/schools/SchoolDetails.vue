<template>
  <div>
    <v-container>
      <v-breadcrumbs :items="breadcrumbs" divider="/"></v-breadcrumbs>
      <v-form v-model="valid">
        <v-row>
          <v-col cols="6">
            <v-text-field
              v-model="school.name"
              label="Name *"
              hint="Name will be used like this for badges and certificates."
              prepend-icon="mdi-bank"
              :rules="validationRules.nameRules"
              required
            ></v-text-field>
          </v-col>
          <v-col cols="6">
            <v-text-field
              v-model="school.country"
              label="Country of origin *"
              prepend-icon="mdi-flag"
              :rules="validationRules.countryRules"
              required
            >
            </v-text-field>
          </v-col>
          <v-col cols="4">
            <v-text-field
              v-model="school.street"
              label="Street Name and House Number *"
              prepend-icon="mdi-home-floor-1"
              :rules="validationRules.streetNameRules"
              required
            ></v-text-field>
          </v-col>
          <v-col cols="4">
            <v-text-field
              v-model="school.zipcode"
              label="ZIP Code *"
              prepend-icon="mdi-numeric"
              :rules="validationRules.zipcodeRules"
              required
            ></v-text-field>
          </v-col>
          <v-col cols="4">
            <v-text-field
              v-model="school.city"
              label="City *"
              prepend-icon="mdi-home-city"
              :rules="validationRules.cityRules"
              required
            ></v-text-field>
          </v-col>
          <v-col cols="2">
            <v-text-field
              v-model="school.requested"
              label="Number of requested students *"
              prepend-icon="mdi-account-group"
              hint="Note, that this is the <b>requested</b> number, <u>not</u> the confirmed one which might be lower."
              :rules="validationRules.requestedRules"
              required
            ></v-text-field>
          </v-col>
          <v-col cols="3">
            <v-select
              v-model="school.housing"
              :items="housing_options"
              label="Housing option *"
              hint="Please note, that housing in guest families is not available for all delegations and we will prefer international delegations in our housing who travels the longest distances."
            ></v-select>
          </v-col>
          <v-col cols="3">
            <v-select
              v-model="school.registration_status"
              :items="status_options"
              label="Registration status"
              hint="This status indicates at what stage of registration the school is."
            ></v-select>
          </v-col>
          <v-col cols="2"
            ><v-checkbox
              v-model="school.fee"
              label="Pre-registration fee paid?"
              append-icon="mdi-currency-eur"
              hint="Was the pre-registration fee paid?"
            ></v-checkbox
          ></v-col>
          <v-col cols="4">
            <v-textarea
              v-model="school.arrival"
              outlined
              auto-grow
              rows="3"
              label="Arrival Information"
              hint="Please provide date, time and location (e.g. school, conference venue, train station, airport, ...) of arrival here so that we can plan the registration process and housing respectively."
            ></v-textarea>
          </v-col>
          <v-col cols="4">
            <v-textarea
              v-model="school.departure"
              outlined
              auto-grow
              rows="3"
              label="Departure Information"
              hint="Please provide date, time and location (e.g. conference venue, train station, airport, ...) of departure here so that we can plan in advance."
            ></v-textarea>
          </v-col>
          <v-col cols="4">
            <v-textarea
              v-model="school.comment"
              outlined
              auto-grow
              rows="3"
              label="Internal Comment"
              hint="Write down notes and comments regarding this school here, e.g. outstanding fees, contact persons names, etc."
            ></v-textarea>
          </v-col>
        </v-row>
      </v-form>
      <small>* indicates required fields</small>

      <v-row>
        <v-spacer></v-spacer>

        <v-btn color="primary" @click="save" :disabled="!valid">
          Update
        </v-btn>
      </v-row>
    </v-container>

    <v-snackbar v-model="successSnackbar" color="success" timeout="2000">
      The school has been successfully updated.
      <template v-slot:action="{ attrs }">
        <v-btn text v-bind="attrs" @click="successSnackbar = false">
          OK
        </v-btn>
      </template>
    </v-snackbar>
    <v-snackbar v-model="errorSnackbar" color="error">
      Updating school failed. Details: {{ errorMessage }}
      <template v-slot:action="{ attrs }">
        <v-btn text v-bind="attrs" @click="errorSnackbar = false">
          OK
        </v-btn>
      </template>
    </v-snackbar>
  </div>
</template>

<script>
export default {
  name: "SchoolDetails",
  props: ["id"],
  data: () => ({
    school: null,
    defaultSchool: {
      name: "",
      street: "",
      city: "",
      zipcode: "",
      country: "",
      requested: null,
      housing: "other",
      registration_status: "waiting for pre-registration",
      fee: false,
      arrival: "",
      departure: "",
      comment: "",
    },
    housing_options: [
      { text: "hostel", value: "hostel" },
      { text: "guest family", value: "guest family" },
      { text: "other self-organized accommodation", value: "other" },
    ],
    status_options: [
      {
        value: "WAITING_FOR_PRE_REGISTRATION",
        text: "waiting for pre-registration",
      },
      { value: "PRE_REGISTRATION_DONE", text: "pre-registration done" },
      {
        value: "WAITING_FOR_DATA_PROTECTION",
        text: "waiting for data protection",
      },
      {
        value: "WAITING_FOR_FINAL_REGISTRATION",
        text: "waiting for final registration",
      },
      { value: "FINAL_REGISTRATION_DONE", text: "final registration done" },
      { value: "CANCELED", text: "canceled" },
    ],
    breadcrumbs: [
      {
        text: "Schools",
        href: "/schools",
      },
      {
        text: "",
      },
    ],

    successSnackbar: false,
    errorSnackbar: false,
    errorMessage: "",
    valid: false,
    validationRules: {
      nameRules: [
        (v) => !!v || "School name is required",
        (v) => v.length <= 50 || "Name must be less than 50 characters",
      ],
      countryRules: [
        (v) => !!v || "Country of origin is required",
        (v) =>
          v.length <= 50 || "Country of origin must be less than 50 characters",
      ],
    },
  }),
  mounted() {
    if (this.id != undefined) {
      this.$http
        .get(`https://munoltom.pythonanywhere.com/api/schools/${this.id}`)
        .then((response) => {
          this.school = response.data;
          this.breadcrumbs[1].text = `${this.school.name}`;
        })
        .catch((error) => alert(error));
    }
  },
  methods: {
    async save() {
      // convert object to form data to also upload file
      const fd = new FormData();
      for (const key in this.school) {
        if (this.school[key] != null) {
          fd.append(key, this.school[key]);
        }
      }
      await this.$http
        .put(
          `https://munoltom.pythonanywhere.com/api/schools/${this.id}/`,
          fd,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        )
        .then((r) => {
          if (r.status == 200) {
            this.successSnackbar = true;
          } else {
            console.log(r.status);
          }
        })
        .catch((e) => {
          console.log(e);
          this.errorMessage = e.message;
          this.errorSnackbar = true;
        });
    },
  },
};
</script>
