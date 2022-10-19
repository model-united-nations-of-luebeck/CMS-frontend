<template>
  <div>
    <v-dialog v-model="dialog" persistent max-width="600px">
      <v-card>
        <v-card-title>
          <span class="headline">Add new school</span>
        </v-card-title>
        <v-card-text>
          <v-container>
            <v-form v-model="valid">
              <v-row>
                <v-col cols="12">
                  <v-text-field
                    v-model="school.name"
                    label="Name *"
                    prepend-icon="mdi-bank"
                    :rules="validationRules.nameRules"
                  ></v-text-field>
                </v-col>
              </v-row>
            </v-form>
            <small>*indicates required field</small>
            <p></p>
            <p>
              Password will be generated automatically and the other information
              will be entered by the corresponding MUN Director.
            </p>
          </v-container>
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
      message="The school has been successfully created."
      color="success"
      prepend_icon="mdi-check"
    />
    <toast-message
      ref="errorSnackbar"
      :message="'Creating school failed. Details:' + errorMessage"
      color="error"
      prepend_icon="mdi-alert"
    />
  </div>
</template>

<script>
import ToastMessage from "../generic/ToastMessage.vue";
export default {
  components: { ToastMessage },
  name: "SchoolDialog",

  data: () => ({
    school: null,
    defaultSchool: {
      name: "",
    },
    dialog: false,
    errorMessage: "",
    valid: false,
    validationRules: {
      nameRules: [
        (v) => !!v || "School name is required",
        (v) => v.length <= 50 || "Name must be less than 50 characters",
      ],
    },
  }),
  mounted() {
    this.school = this.defaultSchool;
  },
  methods: {
    open() {
      this.dialog = true;
    },
    cancel() {
      this.dialog = false;
      this.school = this.defaultSchool;
    },
    async save() {
      // convert object to form data to also upload file
      const fd = new FormData();
      for (const key in this.school) {
        if (this.school[key] != null) {
          fd.append(key, this.school[key]);
        }
      }
      await this.$http
        .post(`https://munoltom.pythonanywhere.com/api/schools/`, fd, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        })
        .then((r) => {
          if (r.status == 201) {
            this.$refs.successSnackbar.show();
            this.dialog = false;
          } else {
            console.log(r.status);
          }
          this.school = this.defaultSchool;
        })
        .catch((e) => {
          console.log(e);
          this.errorMessage = e.message;
          this.$refs.errorSnackbar.show();
          this.school = this.defaultSchool;
        });
    },
  },
};
</script>
