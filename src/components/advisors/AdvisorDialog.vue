<template>
  <div>
    <v-dialog v-model="dialog" persistent max-width="600px">
      <v-card>
        <v-card-title>
          <span class="headline">Add new advisor</span>
        </v-card-title>
        <v-card-text>
          <v-container>
            <v-form v-model="valid">
              <v-row>
                <v-col cols="12" sm="4">
                  <v-text-field
                    v-model="advisor.first_name"
                    label="First name *"
                    hint="Including second names if wanted"
                    prepend-icon="mdi-account"
                    :rules="validationRules.firstNameRules"
                    required
                  ></v-text-field>
                </v-col>
                <v-col cols="12" sm="4">
                  <v-text-field
                    v-model="advisor.last_name"
                    label="Last name *"
                    hint="Including prefixes like 'von', 'zu', 'de' etc."
                    :rules="validationRules.lastNameRules"
                  ></v-text-field>
                </v-col>
                <v-col cols="12" sm="4">
                  <v-select
                    v-model="advisor.gender"
                    :items="genders"
                    label="Gender"
                    hint="the diversity of genders is reflected in the 'other' choice"
                  ></v-select>
                </v-col>

                <v-col cols="12">
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
                <v-col cols="11" style="padding-left: 0px;">
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
                <v-col cols="12" sm="6">
                  <v-select
                    v-model="advisor.diet"
                    :items="diets"
                    label="Diet *"
                    hint="main diet, smaller variations like allergies shall be indicated in the extras field"
                    prepend-icon="mdi-food"
                    required
                  ></v-select>
                </v-col>
                <v-col cols="12" sm="6">
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
              </v-row>
              <v-row>
                <v-col cols="12" sm="12">
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
              </v-row>
              <v-row>
                <v-col cols="12" sm="12">
                  <v-textarea
                    v-model="advisor.extras"
                    outlined
                    auto-grow
                    rows="3"
                    label="Extra information"
                    hint="please include here all additional information about diet, allergies, preferences etc. so that we can try to provide a perfect conference"
                  ></v-textarea>
                </v-col>
              </v-row>
              <v-row
                ><v-col cols="12" sm="12"
                  ><v-checkbox
                    v-model="advisor.car"
                    label="Car available?"
                    append-icon="mdi-car-side"
                    hint="Do you have a car available and a valid drivers license?"
                  ></v-checkbox></v-col
              ></v-row>
              <v-row>
                <v-col cols="12" sm="12">
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
                <v-col cols="12" sm="12">
                  <v-textarea
                    v-model="advisor.experience"
                    outlined
                    auto-grow
                    rows="3"
                    label="MUN Experience"
                    hint="Please specify which role you had in former MUNOL sessions and other conferences, e.g. 'School Management 2019'"
                  ></v-textarea>
                </v-col>
              </v-row>
              <v-row
                ><v-col cols="12" sm="12"
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
          </v-container>
        </v-card-text>
        <v-card-text v-if="uploadPercentage">
          <v-progress-linear
            v-model="uploadPercentage"
            color="primary"
            height="25"
            striped
          >
            <template v-slot:default="{ value }">
              <strong>{{ Math.ceil(value) }}%</strong>
            </template>
          </v-progress-linear>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>

          <v-btn color="red " text @click="cancel">
            Cancel
          </v-btn>
          <v-btn color="green" text @click="save" :disabled="!valid">
            Save
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <toast-message
      ref="successSnackbar"
      message="The advisor has been successfully created."
      color="success"
      prepend_icon="mdi-check"
    />
    <toast-message
      ref="errorSnackbar"
      :message="'Creating advisor failed. Details:' + errorMessage"
      color="error"
      prepend_icon="mdi-alert"
    />
  </div>
</template>

<script>
import ToastMessage from "../generic/ToastMessage.vue";
export default {
  components: { ToastMessage },
  name: "AdvisorDialog",

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
    dialog: false,
    birthdayMenu: false,
    genders: [
      { text: "male", value: "m" },
      { text: "female", value: "f" },
      { text: "other", value: "o" },
    ],
    diets: ["meat", "vegetarian", "vegan"],
    uploadPercentage: 0,
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
    this.advisor = this.defaultAdvisor;
  },
  methods: {
    open() {
      this.dialog = true;
    },
    cancel() {
      this.dialog = false;
      this.advisor = this.defaultAdvisor;
    },
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
        .post(`https://munoltom.pythonanywhere.com/api/advisors/`, fd, {
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
          if (r.status == 201) {
            this.$refs.successSnackbar.show();
            this.dialog = false;
          } else {
            console.log(r.status);
          }
          this.advisor = this.defaultAdvisor;
        })
        .catch((e) => {
          console.log(e);
          this.errorMessage = e.message;
          this.$refs.errorMessage.show();
          this.advisor = this.defaultAdvisor;
        });
    },
  },
};
</script>
