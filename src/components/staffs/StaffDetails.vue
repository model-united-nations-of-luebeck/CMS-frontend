<template>
  <div>
    <v-container>
      <v-breadcrumbs :items="breadcrumbs" divider="/"></v-breadcrumbs>
      <v-form v-model="valid">
        <v-row>
          <v-col cols="3">
            <v-text-field
              v-model="staff.first_name"
              label="First name *"
              hint="Including second names if wanted"
              prepend-icon="mdi-account"
              :rules="validationRules.firstNameRules"
              required
            ></v-text-field>
          </v-col>
          <v-col cols="3">
            <v-text-field
              v-model="staff.last_name"
              label="Last name *"
              hint="Including prefixes like 'von', 'zu', 'de' etc."
              :rules="validationRules.lastNameRules"
            ></v-text-field>
          </v-col>
          <v-col cols="3">
            <v-select
              v-model="staff.gender"
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
                  v-model="staff.birthday"
                  label="Birthday"
                  hint="in format YYYY-MM-DD"
                  prepend-icon="mdi-calendar"
                  v-bind="attrs"
                  v-on="on"
                ></v-text-field>
              </template>
              <v-date-picker
                ref="picker"
                v-model="staff.birthday"
                :max="new Date().toISOString().substr(0, 10)"
                min="1920-01-01"
                @change="saveBirthday"
              ></v-date-picker>
            </v-menu>
          </v-col>

          <v-col cols="6">
            <v-text-field
              v-model="staff.position_name"
              label="Position *"
              hint=""
              prepend-icon="mdi-account"
              :rules="validationRules.positionRules"
              required
            ></v-text-field>
          </v-col>

          <v-col cols="6">
            <v-text-field
              v-model="staff.school_name"
              label="School"
              prepend-icon="mdi-bank"
            ></v-text-field>
          </v-col>

          <v-col cols="4">
            <v-text-field
              v-model="staff.email"
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
              v-model="staff.mobile"
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
              v-model="staff.diet"
              :items="diets"
              label="Diet *"
              hint="main diet, smaller variations like allergies shall be indicated in the extras field"
              prepend-icon="mdi-food"
              required
            ></v-select>
          </v-col>
        </v-row>
        <v-row>
          <v-col cols="12">
            <v-file-input
              v-model="staff.picture"
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
          <v-col cols="12">
            <v-textarea
              v-model="staff.extras"
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
        <v-btn dark color="red" @click="deleteStaff">
          <v-icon left> mdi-delete </v-icon>Delete staff
        </v-btn>
        <v-spacer></v-spacer>

        <v-btn color="primary" @click="save" :disabled="!valid">
          Update
        </v-btn>
      </v-row>
    </v-container>

    <v-snackbar v-model="successSnackbar" color="success" timeout="2000">
      The staff has been successfully updated.
      <template v-slot:action="{ attrs }">
        <v-btn text v-bind="attrs" @click="successSnackbar = false">
          OK
        </v-btn>
      </template>
    </v-snackbar>
    <v-snackbar v-model="errorSnackbar" color="error">
      Updating staff failed. Details: {{ errorMessage }}
      <template v-slot:action="{ attrs }">
        <v-btn text v-bind="attrs" @click="errorSnackbar = false">
          OK
        </v-btn>
      </template>
    </v-snackbar>

    <v-dialog v-model="deleteStaffDialog" max-width="500px">
      <v-card>
        <v-card-title>Delete staff?</v-card-title>
        <v-card-text>Are you sure you want to delete this staff? </v-card-text>
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
  name: "StaffDialog",
  props: ["id"],
  data: () => ({
    staff: null,
    defaultStaff: {
      first_name: "",
      last_name: "",
      position_name: "",
      school_name: "",
      gender: "f",
      email: "",
      mobile: "",
      extras: "",
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
        text: "Staffs",
        href: "/staffs",
      },
      {
        text: "",
      },
    ],
    deleteStaffDialog: false,
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
      positionRules: [
        (v) => !!v || "Please enter a position for this staff",
        (v) => v.length <= 20 || "Name must be less than 20 characters",
      ],
    },
  }),
  watch: {
    birthdayMenu(val) {
      val && setTimeout(() => (this.$refs.picker.activePicker = "YEAR"));
    },
  },
  async mounted() {
    try {
      if (this.id != undefined) {
        const { data } = await this.$http.get(
          `https://munoltom.pythonanywhere.com/api/staffs/${this.id}`
        );
        this.staff = data;
        this.breadcrumbs[1].text = `${this.staff.first_name} ${this.staff.last_name}`;
      }
    } catch (error) {
      alert(error);
    }
  },
  methods: {
    saveBirthday(date) {
      this.$refs.birthdayMenu.save(date);
    },
    async save() {
      // convert object to form data to also upload file
      const fd = new FormData();
      for (const key in this.staff) {
        if (this.staff[key] != null) {
          fd.append(key, this.staff[key]);
        }
      }
      await this.$http
        .put(`https://munoltom.pythonanywhere.com/api/staffs/${this.id}/`, fd, {
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
    deleteStaff() {
      this.deleteStaffDialog = true;
    },
    async deleteItemConfirm() {
      await this.$http
        .delete(
          `https://munoltom.pythonanywhere.com/api/staffs/${this.id}/`,
          {}
        )
        .then((r) => {
          if (r.status == 204) {
            alert("Deleted");
            //TODO: trigger load staffs page
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
      this.deleteStaffDialog = false;
    },
  },
};
</script>
