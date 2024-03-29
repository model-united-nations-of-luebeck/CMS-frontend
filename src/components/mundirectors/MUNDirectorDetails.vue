<template>
  <div>
    <v-container>
      <v-breadcrumbs :items="breadcrumbs" divider="/"></v-breadcrumbs>
      <v-form v-model="valid">
        <v-row>
          <v-col cols="3">
            <v-text-field
              v-model="mundirector.first_name"
              label="First name *"
              hint="Including second names if wanted"
              prepend-icon="mdi-account"
              :rules="validationRules.firstNameRules"
              required
            ></v-text-field>
          </v-col>
          <v-col cols="3">
            <v-text-field
              v-model="mundirector.last_name"
              label="Last name *"
              hint="Including prefixes like 'von', 'zu', 'de' etc."
              :rules="validationRules.lastNameRules"
            ></v-text-field>
          </v-col>
          <v-col cols="3">
            <v-select
              v-model="mundirector.gender"
              :items="genders"
              label="Gender"
              hint="the diversity of genders is reflected in the 'other' choice"
            ></v-select>
          </v-col>
          <v-col cols="3">
            <v-select
              v-model="mundirector.diet"
              :items="diets"
              label="Diet *"
              hint="main diet, smaller variations like allergies shall be indicated in the extras field"
              prepend-icon="mdi-food"
              required
            ></v-select>
          </v-col>
          <v-col cols="4">
            <v-text-field
              v-model="mundirector.email"
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
          <v-col cols="3" style="padding-left: 0px;">
            <vue-tel-input-vuetify
              v-model="mundirector.mobile"
              label="Mobile Phone"
              defaultCountry="DE"
              mode="international"
              :disabledFetchingCountry="false"
              hint="remember to include the country code, e.g. for Germany +49 and then leave out the leading 0"
            ></vue-tel-input-vuetify>
          </v-col>
          <v-col cols="1">
            <div
              class="v-input theme--light v-text-field v-text-field--is-booted"
            >
              <div
                class="v-input__icon v-input__icon--prepend v-input__prepend-outer"
              >
                <v-icon v-on="on">
                  mdi-phone-classic
                </v-icon>
              </div>
            </div>
          </v-col>
          <v-col cols="3" style="padding-left: 0px;">
            <vue-tel-input-vuetify
              v-model="mundirector.landline_phone"
              label="Landline Phone"
              defaultCountry="DE"
              mode="international"
              :disabledFetchingCountry="false"
              hint="in case that a call is quicker than an email, don't forget the country code"
            ></vue-tel-input-vuetify>
          </v-col>
        </v-row>
        <v-row>
          <v-col cols="8">
            <v-file-input
              v-model="mundirector.picture"
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
              v-model="mundirector.english_teacher"
              label="Is the MUN-Director an English teacher?"
              append-icon="mdi-human-male-board"
              hint="English teachers can help with correcting the language and grammar of resolutions."
            ></v-checkbox
          ></v-col>
        </v-row>
        <v-row>
          <v-col cols="6">
            <v-textarea
              v-model="mundirector.extras"
              outlined
              auto-grow
              rows="3"
              label="Extra information"
              hint="please include here all additional information about diet, allergies, preferences etc. so that we can try to provide a perfect conference"
            ></v-textarea>
          </v-col>
        </v-row>
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
        <v-spacer></v-spacer>

        <v-btn color="primary" @click="save" :disabled="!valid">
          Update
        </v-btn>
      </v-row>
    </v-container>

    <v-snackbar v-model="successSnackbar" color="success" timeout="2000">
      The MUN-Director has been successfully updated.
      <template v-slot:action="{ attrs }">
        <v-btn text v-bind="attrs" @click="successSnackbar = false">
          OK
        </v-btn>
      </template>
    </v-snackbar>
    <v-snackbar v-model="errorSnackbar" color="error">
      Updating MUN-Director failed. Details: {{ errorMessage }}
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
  name: "MUNDirectorDetails",
  props: ["id"],
  data: () => ({
    mundirector: null,
    defaultMUNDirector: {
      first_name: "",
      last_name: "",
      gender: "f",
      email: "",
      mobile: "",
      extras: "",
      landline_phone: "",
      english_teacher: false,
      diet: "vegetarian",
    },
    genders: [
      { text: "male", value: "m" },
      { text: "female", value: "f" },
      { text: "other", value: "o" },
    ],
    diets: ["meat", "vegetarian", "vegan"],
    breadcrumbs: [
      {
        text: "MUN-Directors",
        href: "/mun-directors",
      },
      {
        text: "",
      },
    ],
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
    },
  }),
  watch: {},
  mounted() {
    if (this.id != undefined) {
      this.$http
        .get(`api/mun-directors/${this.id}`)
        .then((response) => {
          this.mundirector = response.data;
          this.breadcrumbs[1].text = `${this.mundirector.first_name} ${this.mundirector.last_name}`;
        })
        .catch((error) => alert(error));
    }
  },
  methods: {
    async save() {
      // convert object to form data to also upload file
      const fd = new FormData();
      for (const key in this.mundirector) {
        if (this.mundirector[key] != null) {
          fd.append(key, this.mundirector[key]);
        }
      }
      await this.$http
        .put(`api/mun-directors/${this.id}/`, fd, {
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
  },
};
</script>
