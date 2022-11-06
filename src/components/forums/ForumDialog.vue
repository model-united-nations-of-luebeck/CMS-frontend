<template>
  <div>
    <v-dialog v-model="dialog" persistent max-width="600px">
      <v-card>
        <v-card-title>
          <span class="headline">Add new forum</span>
        </v-card-title>
        <v-card-text>
          <v-container>
            <v-form v-model="valid">
              <v-row>
                <v-col cols="12">
                  <v-text-field
                    v-model="forum.name"
                    label="Name *"
                    hint="e.g. 'First Committee', 'Economic and Social Council'"
                    prepend-icon="mdi-message"
                    :rules="validationRules.nameRules"
                    required
                  ></v-text-field>
                </v-col>
                <v-col cols="12">
                  <v-text-field
                    v-model="forum.subtitle"
                    label="Explanatory Subtitle"
                    prepend-icon="mdi-text"
                    hint="e.g. 'Disarmament and International Security'"
                    :rules="validationRules.subtitleRules"
                  ></v-text-field>
                </v-col>
                <v-col cols="12">
                  <v-text-field
                    v-model="forum.abbreviation"
                    prepend-icon="mdi-text-short"
                    label="Abbreviated forum name"
                    hint="e.g. 'GA1', 'ECOSOC'"
                  ></v-text-field>
                </v-col>

                <v-col cols="12">
                  <v-text-field
                    v-model="forum.email"
                    label="Email"
                    prepend-icon="mdi-email"
                    hint="Email will be displayed on website"
                    :rules="validationRules.emailRules"
                  ></v-text-field>
                </v-col>
              </v-row>
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
      message="The forum has been successfully created."
      color="success"
      prepend_icon="mdi-check"
    />
    <toast-message
      ref="errorSnackbar"
      :message="'Creating forum failed. Details:' + errorMessage"
      color="error"
      prepend_icon="mdi-alert"
    />
  </div>
</template>

<script>
import ToastMessage from "../generic/ToastMessage.vue";
export default {
  components: { ToastMessage },
  name: "ForumDialog",

  data: () => ({
    forum: null,
    defaultForum: {
      name: "",
      abbreviation: "",
      subtitle: "",
      email: "",
    },
    dialog: false,
    errorMessage: "",
    valid: false,
    validationRules: {
      nameRules: [
        (v) => !!v || "Name is required",
        (v) => v.length <= 50 || "Name must be less than 50 characters",
      ],
      subtitleRules: [
        (v) => v.length <= 75 || "Subtitle must be less than 75 characters",
      ],
      emailRules: [
        (v) =>
          !v ||
          /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(v) ||
          "Email must be valid",
      ],
    },
  }),
  watch: {},
  mounted() {
    this.forum = this.defaultForum;
  },
  methods: {
    open() {
      this.dialog = true;
    },
    cancel() {
      this.dialog = false;
      this.forum = this.defaultForum;
    },
    async save() {
      // convert object to form data to also upload file
      const fd = new FormData();
      for (const key in this.forum) {
        if (this.forum[key] != null) {
          fd.append(key, this.forum[key]);
        }
      }
      await this.$http
        .post(`api/forums/`, fd, {
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
          this.forum = this.defaultForum;
        })
        .catch((e) => {
          console.log(e);
          this.errorMessage = e.message;
          this.$refs.errorSnackbar.show();
          this.forum = this.defaultForum;
        });
    },
  },
};
</script>
