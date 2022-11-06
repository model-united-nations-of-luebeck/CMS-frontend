<template>
  <div>
    <v-dialog v-model="dialog" persistent max-width="600px">
      <v-card>
        <v-card-title>
          <span class="headline">Add new member organization</span>
        </v-card-title>
        <v-card-text>
          <v-container>
            <v-form v-model="valid">
              <v-row>
                <v-col cols="12">
                  <v-text-field
                    v-model="memberOrganization.name"
                    label="Name *"
                    hint="Use common (short) version of the name, e.g. 'Russia' instead of 'Russion Federation' or 'EU' instrad of 'European Union', so use abbreviations. This name is only used internally and thus allows to create Countries twice, e.g. China 1 and China 2 if the delegation is split between two schools."
                    prepend-icon="mdi-flag"
                    :rules="validationRules.nameRules"
                    required
                  ></v-text-field>
                </v-col>
                <v-col cols="12">
                  <v-text-field
                    v-model="memberOrganization.official_name"
                    label="Official name *"
                    prepend-icon="mdi-text-short"
                    hint="Official name as stated on resolutions of the UN, e.g. 'Russion Federation' instead of Russia. No abbreviations allowed here.'"
                    :rules="validationRules.officialNameRules"
                    required
                  ></v-text-field>
                </v-col>
                <v-col cols="12">
                  <v-text-field
                    v-model="memberOrganization.placard_name"
                    prepend-icon="mdi-tag"
                    label="Placard name *"
                    hint="The best readable compromise between no abbreviation but also not the full official name"
                    :rules="validationRules.placardNameRules"
                    required
                  ></v-text-field>
                </v-col>

                <v-col cols="12" sm="8">
                  <v-select
                    v-model="memberOrganization.status"
                    :items="stati"
                    label="Status in the UN *"
                    prepend-icon="mdi-shield-star-outline"
                    required
                  ></v-select>
                </v-col>
                <v-col cols="12" sm="4">
                  <v-checkbox
                    v-model="memberOrganization.active"
                    label="Represented at this conference?"
                    hint="This allows to store all countries but only select the ones to be simulated and quickly change the selection."
                  ></v-checkbox>
                </v-col>
                <v-col cols="12">
                  <v-text-field
                    v-model="memberOrganization.flag"
                    prepend-icon="mdi-flag"
                    label="Flag URL"
                    hint="URL to SVG Flag file of the Member Organization if it has one"
                    :rules="validationRules.flagRules"
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
      message="The member organization has been successfully created."
      color="success"
      prepend_icon="mdi-check"
    />
    <toast-message
      ref="errorSnackbar"
      :message="'Creating member organization failed. Details:' + errorMessage"
      color="error"
      prepend_icon="mdi-alert"
    />
  </div>
</template>

<script>
import ToastMessage from "../generic/ToastMessage.vue";
export default {
  components: { ToastMessage },
  name: "MemberOrganizationDialog",

  data: () => ({
    memberOrganization: null,
    defaultMemberOrganization: {
      name: "",
      official_name: "",
      placard_name: "",
      status: "",
      active: true,
      flag: "",
    },
    stati: [
      "member state",
      "observer state",
      "former member state",
      "non-governmental organization",
      "inter-governmental organization",
      "UN sub-body",
    ],
    dialog: false,
    errorMessage: "",
    valid: false,
    validationRules: {
      nameRules: [
        (v) => !!v || "Name is required",
        (v) => v.length <= 50 || "Name must be less than 50 characters",
      ],
      officialNameRules: [
        (v) => !!v || "Official Name is required",
        (v) =>
          v.length <= 150 || "Official Name must be less than 150 characters",
      ],
      placardNameRules: [
        (v) => !!v || "Placard Name is required",
        (v) => v.length <= 50 || "Placard Name must be less than 50 characters",
      ],
      flagRules: [
        (v) => v.length <= 250 || "Flag URL must be less than 250 characters",
      ],
    },
  }),
  watch: {},
  mounted() {
    this.memberOrganization = this.defaultMemberOrganization;
  },
  methods: {
    open() {
      this.dialog = true;
    },
    cancel() {
      this.dialog = false;
      this.memberOrganization = this.defaultMemberOrganization;
    },
    async save() {
      // convert object to form data to also upload file
      const fd = new FormData();
      for (const key in this.memberOrganization) {
        if (this.memberOrganization[key] != null) {
          fd.append(key, this.memberOrganization[key]);
        }
      }
      await this.$http
        .post(`api/member-organizations/`, fd, {
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
          this.memberOrganization = this.defaultMemberOrganization;
        })
        .catch((e) => {
          console.log(e);
          this.errorMessage = e.message;
          this.$refs.errorSnackbar.show();
          this.memberOrganization = this.defaultMemberOrganization;
        });
    },
  },
};
</script>
