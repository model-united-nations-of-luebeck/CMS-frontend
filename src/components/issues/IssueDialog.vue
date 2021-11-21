<template>
  <div>
    <v-dialog v-model="dialog" persistent max-width="600px">
      <v-card>
        <v-card-title>
          <span class="headline">Add new issue</span>
        </v-card-title>
        <v-card-text>
          <v-container>
            <v-form v-model="valid">
              <v-row>
                <v-col cols="12">
                  <v-text-field
                    v-model="issue.name"
                    label="Name *"
                    hint="e.g. 'First Committee', 'Economic and Social Council'"
                    prepend-icon="mdi-format-list-bulleted-type"
                    :rules="validationRules.nameRules"
                    required
                  ></v-text-field>
                </v-col>
                <v-col cols="12" sm="12">
                  <v-select
                    v-model="issue.forum"
                    :items="forums"
                    prepend-icon="mdi-message"
                    label="Forum"
                    hint="select the forum of this issue"
                  ></v-select>
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
      message="The issue has been successfully created."
      color="success"
      prepend_icon="mdi-check"
    />
    <toast-message
      ref="errorSnackbar"
      :message="'Creating issue failed. Details:' + errorMessage"
      color="error"
      prepend_icon="mdi-alert"
    />
  </div>
</template>

<script>
import ToastMessage from "../generic/ToastMessage.vue";
export default {
  components: { ToastMessage },
  name: "IssueDialog",

  data: () => ({
    issue: null,
    forums: null,
    defaultIssue: {
      name: "",
      forum: null,
    },
    dialog: false,
    errorMessage: "",
    valid: false,
    validationRules: {
      nameRules: [
        (v) => !!v || "Name is required",
        (v) => v.length <= 256 || "Name must be less than 256 characters",
      ],
    },
  }),
  watch: {},
  async mounted() {
    this.issue = this.defaultIssue;

    // fetch required data for this page
    try {
      const { forums } = (
        await this.$http.get("https://munoltom.pythonanywhere.com/api/forums/")
      ).data;
      this.forums = forums;
    } catch (error) {
      alert(error);
    }
  },
  methods: {
    open() {
      this.dialog = true;
    },
    cancel() {
      this.dialog = false;
      this.issue = this.defaultIssue;
    },
    async save() {
      // convert object to form data to also upload file
      const fd = new FormData();
      for (const key in this.issue) {
        if (this.issue[key] != null) {
          fd.append(key, this.issue[key]);
        }
      }
      await this.$http
        .post(`https://munoltom.pythonanywhere.com/api/issues/`, fd, {
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
          this.issue = this.defaultIssue;
        })
        .catch((e) => {
          console.log(e);
          this.errorMessage = e.message;
          this.$refs.errorSnackbar.show();
          this.issue = this.defaultIssue;
        });
    },
  },
};
</script>
