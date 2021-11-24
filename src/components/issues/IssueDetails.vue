<template>
  <div>
    <v-container>
      <v-breadcrumbs :items="breadcrumbs" divider="/"></v-breadcrumbs>
      <v-form v-model="valid">
        <v-row>
          <v-col cols="12" sm="8">
            <v-text-field
              v-model="issue.name"
              label="Name *"
              hint="e.g. 'First Committee', 'Economic and Social Council'"
              prepend-icon="mdi-message"
              :rules="validationRules.nameRules"
              required
            ></v-text-field>
          </v-col>
          <v-col cols="12" sm="4">
            <v-select
              v-model="issue.forum"
              :items="this.forums"
              item-text="name"
              item-value="id"
              prepend-icon="mdi-message"
              label="Forum"
              hint="select the forum of this issue"
            ></v-select>
          </v-col>
        </v-row>
      </v-form>
      <small>*indicates required field</small>
      <v-row>
        <v-btn dark color="red" @click="deleteIssue">
          <v-icon left> mdi-delete </v-icon>Delete issue
        </v-btn>
        <v-spacer></v-spacer>

        <v-btn color="primary" @click="save" :disabled="!valid">
          Update
        </v-btn>
      </v-row>
    </v-container>

    <v-snackbar v-model="successSnackbar" color="success" timeout="2000">
      The issue has been successfully updated.
      <template v-slot:action="{ attrs }">
        <v-btn text v-bind="attrs" @click="successSnackbar = false">
          OK
        </v-btn>
      </template>
    </v-snackbar>
    <v-snackbar v-model="errorSnackbar" color="error">
      Updating issue failed. Details: {{ errorMessage }}
      <template v-slot:action="{ attrs }">
        <v-btn text v-bind="attrs" @click="errorSnackbar = false">
          OK
        </v-btn>
      </template>
    </v-snackbar>

    <v-dialog v-model="deleteIssueDialog" max-width="500px">
      <v-card>
        <v-card-title>Delete issue?</v-card-title>
        <v-card-text>Are you sure you want to delete this issue? </v-card-text>
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
  name: "IssueDetails",
  props: ["id"],
  data: () => ({
    issue: null,
    forums: null,
    defaultIssue: {
      name: "",
      abbreviation: "",
      subtitle: "",
      email: "",
    },
    breadcrumbs: [
      {
        text: "Issues on the Agenda",
        href: "/issues",
      },
      {
        text: "",
      },
    ],
    deleteIssueDialog: false,
    uploadPercentage: 0,
    successSnackbar: false,
    errorSnackbar: false,
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
    if (this.id != undefined) {
      this.$http
        .get(`https://munoltom.pythonanywhere.com/api/issues/${this.id}`)
        .then((response) => {
          this.issue = response.data;
          this.breadcrumbs[1].text = `${this.issue.forum}: ${this.issue.name}`;
        })
        .catch((error) => alert(error));
    }

    // fetch required data for this page

    this.$http
      .get("https://munoltom.pythonanywhere.com/api/forums/")
      .then((response) => {
        this.forums = response.data;
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
      for (const key in this.issue) {
        if (this.issue[key] != null) {
          fd.append(key, this.issue[key]);
        }
      }
      await this.$http
        .put(`https://munoltom.pythonanywhere.com/api/issues/${this.id}/`, fd, {
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
    deleteIssue() {
      this.deleteIssueDialog = true;
    },
    async deleteItemConfirm() {
      await this.$http
        .delete(
          `https://munoltom.pythonanywhere.com/api/issues/${this.id}/`,
          {}
        )
        .then((r) => {
          if (r.status == 204) {
            alert("Deleted");
            //TODO: trigger load issues page
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
      this.deleteIssueDialog = false;
    },
  },
};
</script>
