<template>
  <div>
    <v-dialog v-model="dialog" max-width="600px">
      <v-card>
        <v-card-title>
          <span class="headline">Select school to link</span>
        </v-card-title>
        <v-card-text>
          <v-container>
            <p>
              A member organization is represented by one school.<br />
              Please select the school for {{ memberOrganization.name }}:
            </p>
            <v-select
              v-model="selectedSchoolId"
              :items="schools"
              item-text="name"
              item-value="id"
              clearable
              label="Select school"
            ></v-select>
          </v-container>
        </v-card-text>

        <v-card-actions>
          <v-spacer></v-spacer>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <toast-message
      ref="successSnackbar"
      message="The executive has been successfully created."
      color="success"
      prepend_icon="mdi-check"
    />
    <toast-message
      ref="errorSnackbar"
      :message="'Creating executive failed. Details:' + errorMessage"
      color="error"
      prepend_icon="mdi-alert"
    />
  </div>
</template>

<script>
import ToastMessage from "../generic/ToastMessage.vue";
export default {
  components: { ToastMessage },
  name: "LinkSchoolDialog",
  props: ["schools", "memberOrganization"],
  data: () => ({
    dialog: false,
    selectedSchoolId: null,
  }),
  watch: {
    dialog: function (newValue) {
      if (!newValue) {
        this.$emit("selected", this.selectedSchoolId);
      }
    },
  },
  mounted() {},
  methods: {
    open() {
      this.dialog = true;
    },
    cancel() {
      this.dialog = false;
    },
  },
};
</script>
