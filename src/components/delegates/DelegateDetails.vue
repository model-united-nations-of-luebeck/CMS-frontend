<template>
  <div>
    <v-container>
      <v-breadcrumbs :items="breadcrumbs" divider="/"></v-breadcrumbs>
      <v-form v-model="valid">
        <v-row>
          <v-col cols="3">
            <v-text-field
              v-model="delegate.first_name"
              label="First name *"
              hint="Including second names if wanted"
              prepend-icon="mdi-account"
              :rules="validationRules.firstNameRules"
              required
            ></v-text-field>
          </v-col>
          <v-col cols="3">
            <v-text-field
              v-model="delegate.last_name"
              label="Last name *"
              hint="Including prefixes like 'von', 'zu', 'de' etc."
              :rules="validationRules.lastNameRules"
            ></v-text-field>
          </v-col>
          <v-col cols="3">
            <v-select
              v-model="delegate.gender"
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
                  v-model="delegate.birthday"
                  label="Birthday"
                  hint="in format YYYY-MM-DD"
                  prepend-icon="mdi-calendar"
                  v-bind="attrs"
                  v-on="on"
                ></v-text-field>
              </template>
              <v-date-picker
                ref="picker"
                v-model="delegate.birthday"
                :max="new Date().toISOString().substr(0, 10)"
                min="1920-01-01"
                @change="saveBirthday"
              ></v-date-picker>
            </v-menu>
          </v-col>
          <v-col cols="4">
            <v-text-field
              v-model="delegate.email"
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
              v-model="delegate.mobile"
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
              v-model="delegate.diet"
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
              v-model="delegate.picture"
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
              v-model="delegate.ambassador"
              label="Ambassador?"
              append-icon="mdi-shield-star-outline"
              hint="Is this delegate the ambassador of the delegation?"
            ></v-checkbox
          ></v-col>
        </v-row>
        <v-row>
          <v-col cols="6">
            <v-textarea
              v-model="delegate.extras"
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
      The delegate has been successfully updated.
      <template v-slot:action="{ attrs }">
        <v-btn text v-bind="attrs" @click="successSnackbar = false">
          OK
        </v-btn>
      </template>
    </v-snackbar>
    <v-snackbar v-model="errorSnackbar" color="error">
      Updating delegate failed. Details: {{ errorMessage }}
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
  name: "DelegateDetails",
  props: ["id"],
  data: () => ({
    delegate: null,
    defaultDelegate: {
      first_name: "",
      last_name: "",
      gender: "f",
      email: "",
      mobile: "",
      extras: "",
      ambassador: "",
      birthday: null,
      diet: "vegetarian",
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
        text: "Delegates",
        href: "/delegates",
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
  watch: {
    birthdayMenu(val) {
      val && setTimeout(() => (this.$refs.picker.activePicker = "YEAR"));
    },
  },
  mounted() {
    this.$http
      .get(`api/delegates/${this.id}`)
      .then((response) => {
        this.delegate = response.data;
        this.breadcrumbs[1].text = `${this.delegate.first_name} ${this.delegate.last_name}`;
      })
      .catch((error) => alert(error));
  },
  methods: {
    saveBirthday(date) {
      this.$refs.birthdayMenu.save(date);
    },
    async save() {
      // convert object to form data to also upload file
      const fd = new FormData();
      for (const key in this.delegate) {
        if (this.delegate[key] != null) {
          fd.append(key, this.delegate[key]);
        }
      }
      await this.$http
        .put(`api/delegates/${this.id}/`, fd, {
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
