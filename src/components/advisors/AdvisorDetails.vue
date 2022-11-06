<template>
  <div>
    <v-container>
      <v-breadcrumbs :items="breadcrumbs" divider="/"></v-breadcrumbs>
      <v-form v-model="valid">
        <v-row>
          <v-col cols="3">
            <v-text-field
              v-model="advisor.first_name"
              label="First name *"
              hint="Including second names if wanted"
              prepend-icon="mdi-account"
              :rules="validationRules.firstNameRules"
              required
            ></v-text-field>
          </v-col>
          <v-col cols="3">
            <v-text-field
              v-model="advisor.last_name"
              label="Last name *"
              hint="Including prefixes like 'von', 'zu', 'de' etc."
              :rules="validationRules.lastNameRules"
            ></v-text-field>
          </v-col>
          <v-col cols="3">
            <v-select
              v-model="advisor.gender"
              :items="genders"
              label="Gender"
              hint="the diversity of genders is reflected in the 'other' choice"
            ></v-select>
          </v-col>
          <v-col cols="3">
            <v-menu
              ref="birthdayMenu"
              v-model="birthdayMenu"
              :close-on-content-click="false"
              transition="scale-transition"
              offset-y
              min-width="auto"
            >
              <template v-slot:activator="{ on, attrs }">
                <v-text-field
                  v-model="advisor.birthday"
                  label="Birthday"
                  hint="in format YYYY-MM-DD"
                  prepend-icon="mdi-calendar"
                  v-bind="attrs"
                  v-on="on"
                ></v-text-field>
              </template>
              <v-date-picker
                ref="picker"
                v-model="advisor.birthday"
                :max="new Date().toISOString().substr(0, 10)"
                min="1920-01-01"
                @change="saveBirthday"
              ></v-date-picker>
            </v-menu>
          </v-col>
          <v-col cols="4">
            <v-text-field
              v-model="advisor.email"
              label="Email"
              prepend-icon="mdi-email"
              :rules="validationRules.emailRules"
            ></v-text-field>
          </v-col>
          <v-col cols="1">
            <div
              class="v-input theme--light v-text-field v-text-field--is-booted"
            >
              <div
                class="v-input__icon v-input__icon--prepend v-input__prepend-outer"
              >
                <v-icon v-on="on">
                  mdi-phone
                </v-icon>
              </div>
            </div>
          </v-col>
          <v-col cols="4" style="padding-left: 0px;">
            <vue-tel-input-vuetify
              v-model="advisor.mobile"
              label="Mobile Phone"
              prepend-icon="mdi-phone"
              defaultCountry="DE"
              mode="international"
              :disabledFetchingCountry="false"
              hint="remember to include the country code, e.g. for Germany +49 and then leave out the leading 0"
            ></vue-tel-input-vuetify>
          </v-col>
          <v-col cols="3">
            <v-select
              v-model="advisor.diet"
              :items="diets"
              label="Diet *"
              hint="main diet, smaller variations like allergies shall be indicated in the extras field"
              prepend-icon="mdi-food"
              required
            ></v-select>
          </v-col>
        </v-row>
        <v-row>
          <v-col cols="8">
            <v-file-input
              v-model="advisor.picture"
              accept="image/*"
              label="Badge photo"
              hint="please provide a passport-style photo for the badge"
              persistent-hint
              show-size
              truncate-length="15"
            ></v-file-input>
          </v-col>
          <v-col cols="4"
            ><v-checkbox
              v-model="advisor.car"
              label="Car available?"
              append-icon="mdi-car-side"
              hint="Do you have a car available and a valid drivers license?"
            ></v-checkbox
          ></v-col>
        </v-row>
        <v-row>
          <v-col cols="6">
            <v-textarea
              v-model="advisor.extras"
              outlined
              auto-grow
              rows="3"
              label="Extra information"
              hint="please include here all additional information about diet, allergies, preferences etc. so that we can try to provide a perfect conference"
            ></v-textarea>
          </v-col>
          <v-col cols="6">
            <v-textarea
              v-model="advisor.availability"
              outlined
              auto-grow
              rows="3"
              label="Availibility during conference"
              hint="Please specify on which days and nighs you will attend the conference and give your advice"
            ></v-textarea>
          </v-col>
        </v-row>
        <v-row>
          <v-col cols="6">
            <v-textarea
              v-model="advisor.experience"
              outlined
              auto-grow
              rows="3"
              label="MUN Experience"
              hint="Please specify which role you had in former MUNOL sessions and other conferences, e.g. 'School Management 2019'"
            ></v-textarea> </v-col
          ><v-col cols="6"
            ><v-textarea
              v-model="advisor.help"
              outlined
              auto-grow
              rows="3"
              label="Areas of help *"
              hint="In which areas would you like to support the team?"
              :rules="validationRules.helpRules"
              required
            ></v-textarea></v-col
        ></v-row>
      </v-form>
      <small>*indicates required field</small>
      <v-progress-linear
        v-model="uploadPercentage"
        v-if="uploadPercentage"
        color="primary"
        height="25"
        striped
      >
        <template v-slot:default="{ value }">
          <strong>{{ Math.ceil(value) }}%</strong>
        </template>
      </v-progress-linear>
      <v-row>
        <v-btn dark color="red" @click="deleteAdvisor">
          <v-icon left> mdi-delete </v-icon>Delete advisor
        </v-btn>
        <v-spacer></v-spacer>

        <v-btn color="primary" @click="save" :disabled="!valid">
          Update
        </v-btn>
      </v-row>
    </v-container>

    <v-snackbar v-model="successSnackbar" color="success" timeout="2000">
      The advisor has been successfully updated.
      <template v-slot:action="{ attrs }">
        <v-btn text v-bind="attrs" @click="successSnackbar = false">
          OK
        </v-btn>
      </template>
    </v-snackbar>
    <v-snackbar v-model="errorSnackbar" color="error">
      Updating advisor failed. Details: {{ errorMessage }}
      <template v-slot:action="{ attrs }">
        <v-btn text v-bind="attrs" @click="errorSnackbar = false">
          OK
        </v-btn>
      </template>
    </v-snackbar>

    <v-dialog v-model="deleteAdvisorDialog" max-width="500px">
      <v-card>
        <v-card-title>Delete advisor?</v-card-title>
        <v-card-text
          >Are you sure you want to delete this advisor?
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="blue darken-1" text @click="closeDeleteDialog"
            >Cancel</v-btn
          >
          <v-btn color="blue darken-1" text @click="deleteItemConfirm"
            >OK</v-btn
          >
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
export default {
  name: "AdvisorDetails",
  props: ["id"],
  data: () => ({
    advisor: null,
    defaultAdvisor: {
      first_name: "",
      last_name: "",
      gender: "f",
      email: "",
      mobile: "",
      extras: "",
      availability: "",
      car: false,
      experience: "",
      birthday: null,
      diet: "vegetarian",
      help: "",
    },
    birthdayMenu: false,
    genders: [
      { text: "male", value: "m" },
      { text: "female", value: "f" },
      { text: "other", value: "o" },
    ],
    diets: ["meat", "vegetarian", "vegan"],
    breadcrumbs: [
      {
        text: "Advisors",
        href: "/advisors",
      },
      {
        text: "",
      },
    ],
    deleteAdvisorDialog: false,
    uploadPercentage: 0,
    successSnackbar: false,
    errorSnackbar: false,
    errorMessage: "",
    valid: false,
    validationRules: {
      firstNameRules: [
        (v) => !!v || "First name is required",
        (v) => v.length <= 30 || "Name must be less than 30 characters",
      ],
      lastNameRules: [
        (v) => !!v || "Last name is required",
        (v) => v.length <= 30 || "Name must be less than 30 characters",
      ],
      emailRules: [
        (v) =>
          !v ||
          /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(v) ||
          "Email must be valid",
      ],
      mobileRules: [
        (v) =>
          !v ||
          /^\+[1-9]{1}[0-9]{3,14}$/.test(v) ||
          "Mobile phone number must be valid, remember country code",
      ],
      helpRules: [
        (v) =>
          !!v ||
          "Please enter an area of help, advisors are supposed to support",
      ],
    },
  }),
  watch: {
    birthdayMenu(val) {
      val && setTimeout(() => (this.$refs.picker.activePicker = "YEAR"));
    },
  },
  mounted() {
    if (this.id != undefined) {
      this.$http
        .get(`api/advisors/${this.id}`)
        .then((response) => {
          this.advisor = response.data;
          this.breadcrumbs[1].text = `${this.advisor.first_name} ${this.advisor.last_name}`;
        })
        .catch((error) => alert(error));
    }
  },
  methods: {
    saveBirthday(date) {
      this.$refs.birthdayMenu.save(date);
    },
    async save() {
      // convert object to form data to also upload file
      const fd = new FormData();
      for (const key in this.advisor) {
        if (this.advisor[key] != null) {
          fd.append(key, this.advisor[key]);
        }
      }
      await this.$http
        .put(`api/advisors/${this.id}/`, fd, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
          onUploadProgress: function (progressEvent) {
            this.uploadPercentage = Math.round(
              (progressEvent.loaded * 100.0) / progressEvent.total
            );
          }.bind(this),
        })
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
    deleteAdvisor() {
      this.deleteAdvisorDialog = true;
    },
    async deleteItemConfirm() {
      await this.$http
        .delete(`api/advisors/${this.id}/`, {})
        .then((r) => {
          if (r.status == 204) {
            alert("Deleted");
            //TODO: trigger load advisors page
          } else {
            console.log(r.status);
          }
        })
        .catch((e) => {
          console.log(e);
          alert("Deletion wasn't successful");
        });
      this.closeDeleteDialog();
    },
    closeDeleteDialog() {
      this.deleteAdvisorDialog = false;
    },
  },
};
</script>
