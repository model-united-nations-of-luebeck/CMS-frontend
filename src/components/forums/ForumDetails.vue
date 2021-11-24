<template>
  <div>
    <v-container>
      <v-breadcrumbs :items="breadcrumbs" divider="/"></v-breadcrumbs>
      <v-form v-model="valid">
        <v-row>
          <v-col cols="12" sm="4">
            <v-text-field
              v-model="forum.name"
              label="Name *"
              hint="e.g. 'First Committee', 'Economic and Social Council'"
              prepend-icon="mdi-message"
              :rules="validationRules.nameRules"
              required
            ></v-text-field>
          </v-col>
          <v-col cols="12" sm="4">
            <v-text-field
              v-model="forum.subtitle"
              label="Explanatory Subtitle"
              prepend-icon="mdi-text"
              hint="e.g. 'Disarmament and International Security'"
              :rules="validationRules.subtitleRules"
            ></v-text-field>
          </v-col>
          <v-col cols="12" sm="2">
            <v-text-field
              v-model="forum.abbreviation"
              prepend-icon="mdi-text-short"
              label="Abbreviated forum name"
              hint="e.g. 'GA1', 'ECOSOC'"
            ></v-text-field>
          </v-col>

          <v-col cols="12" sm="2">
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
        <v-btn dark color="red" @click="deleteForum">
          <v-icon left> mdi-delete </v-icon>Delete forum
        </v-btn>
        <v-spacer></v-spacer>

        <v-btn color="primary" @click="save" :disabled="!valid">
          Update
        </v-btn>
      </v-row>
    </v-container>

    <v-snackbar v-model="successSnackbar" color="success" timeout="2000">
      The forum has been successfully updated.
      <template v-slot:action="{ attrs }">
        <v-btn text v-bind="attrs" @click="successSnackbar = false">
          OK
        </v-btn>
      </template>
    </v-snackbar>
    <v-snackbar v-model="errorSnackbar" color="error">
      Updating forum failed. Details: {{ errorMessage }}
      <template v-slot:action="{ attrs }">
        <v-btn text v-bind="attrs" @click="errorSnackbar = false">
          OK
        </v-btn>
      </template>
    </v-snackbar>

    <v-dialog v-model="deleteForumDialog" max-width="500px">
      <v-card>
        <v-card-title>Delete forum?</v-card-title>
        <v-card-text>Are you sure you want to delete this forum? </v-card-text>
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
  name: "ForumDetails",
  props: ["id"],
  data: () => ({
    forum: null,
    defaultForum: {
      name: "",
      abbreviation: "",
      subtitle: "",
      email: "",
    },
    breadcrumbs: [
      {
        text: "Forums",
        href: "/forums",
      },
      {
        text: "",
      },
    ],
    deleteForumDialog: false,
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
        .get(`https://munoltom.pythonanywhere.com/api/forums/${this.id}`)
        .then((response) => {
          this.forum = response.data;
          this.breadcrumbs[1].text = `${this.forum.name}`;
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
      for (const key in this.forum) {
        if (this.forum[key] != null) {
          fd.append(key, this.forum[key]);
        }
      }
      await this.$http
        .put(`https://munoltom.pythonanywhere.com/api/forums/${this.id}/`, fd, {
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
    deleteForum() {
      this.deleteForumDialog = true;
    },
    async deleteItemConfirm() {
      await this.$http
        .delete(
          `https://munoltom.pythonanywhere.com/api/forums/${this.id}/`,
          {}
        )
        .then((r) => {
          if (r.status == 204) {
            alert("Deleted");
            //TODO: trigger load forums page
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
      this.deleteForumDialog = false;
    },
  },
};
</script>
