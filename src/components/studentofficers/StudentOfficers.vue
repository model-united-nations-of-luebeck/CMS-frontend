<template>
  <div>
    <v-container>
      <!-- Floating action button -->
      <v-btn
        @click="openNewStudentOfficerDialog"
        fab
        right
        bottom
        fixed
        color="primary"
        ><v-icon>mdi-account-plus</v-icon></v-btn
      >
      <!-- Dialog for creating new studentofficers -->
      <student-officer-dialog
        ref="newStudentOfficerDialog"
      ></student-officer-dialog>

      <!-- Header with actions -->
      <v-card-title>
        Student Officers

        <v-spacer></v-spacer>
        <v-btn
          icon
          @click="closeAll"
          color="primary"
          v-if="this.expanded.length != 0"
        >
          <tooltipped-icon
            icon="mdi-unfold-less-horizontal"
            text="close all rows"
            position="top"
        /></v-btn>
        <v-btn
          icon
          @click="openAll"
          color="primary"
          v-if="this.expanded.length < this.studentofficers.length"
          ><tooltipped-icon
            icon="mdi-unfold-more-horizontal"
            text="expand all rows"
            position="top"
        /></v-btn>
        <v-btn
          icon
          :href="download"
          download="data.json"
          color="primary"
          v-if="this.selected.length != 0"
          ><tooltipped-icon
            icon="mdi-download"
            text="download data of selected student officers as JSON"
            position="top"
        /></v-btn>
        <v-btn icon color="primary" v-if="this.selected.length != 0"
          ><download-csv :data="selected">
            <tooltipped-icon
              icon="mdi-file-delimited"
              text="download data of selected student officers as CSV"
              position="top"
            /> </download-csv
        ></v-btn>
        <v-btn icon color="primary" v-if="this.selected.length != 0"
          ><download-excel :data="selected">
            <tooltipped-icon
              icon="mdi-microsoft-excel"
              text="download data of selected student officers as Excel file (xls)"
              position="top"
            /> </download-excel
        ></v-btn>
        <v-spacer></v-spacer>
        <v-text-field
          v-model="search"
          append-icon="mdi-magnify"
          label="Search"
          single-line
          hide-details
          autofocus
        ></v-text-field>
      </v-card-title>

      <!-- Table with student officers -->
      <v-data-table
        :headers="headers"
        :items="studentofficers"
        class="elevation-1"
        show-select
        v-model="selected"
        :search="search"
        :itemsPerPage="-1"
        :footer-props="{
          showFirstLastPage: true,
          itemsPerPageOptions: [5, 15, -1],
          itemsPerPageText: 'Student Officers per page:',
          showCurrentPage: true,
        }"
      >
        <template v-slot:[`footer.page-text`]="props"
          >Student Officers {{ props.pageStart }} - {{ props.pageStop }} of
          {{ props.itemsLength }}</template
        >
        <template v-slot:top>
          <!-- delete student officer dialog -->
          <v-dialog v-model="deleteStudentOfficerDialog" max-width="500px">
            <v-card>
              <v-card-title>Delete student officer?</v-card-title>
              <v-card-text
                >Are you sure you want to delete this student officer?
              </v-card-text>
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
        </template>
        <template v-slot:[`item.name`]="{ item }">
          {{ `${item.first_name} ${item.last_name}` }}
        </template>
        <template v-slot:[`item.position_name`]="{ item }">
          {{ item.position_name }}
        </template>
        <template v-slot:[`item.gender`]="{ item }">
          <tooltipped-icon
            v-if="item.gender == 'm'"
            icon="mdi-gender-male"
            text="male"
            position="bottom"
            color="blue"
          />
          <tooltipped-icon
            v-if="item.gender == 'f'"
            icon="mdi-gender-female"
            text="female"
            position="bottom"
            color="pink"
          />
          <tooltipped-icon
            v-if="item.gender == 'o'"
            icon="mdi-gender-male-female"
            text="other"
            position="bottom"
            color="green"
          />
        </template>

        <template v-slot:[`item.email`]="{ item }">
          <tooltipped-icon
            v-if="item.email"
            icon="mdi-email"
            :text="item.email + ' (click to copy)'"
            position="bottom"
            @clicked="copyToClipboard(item.email)"
          />
        </template>
        <template v-slot:[`item.mobile`]="{ item }">
          <tooltipped-icon
            v-if="item.mobile"
            icon="mdi-phone"
            :text="item.mobile + ' (click to copy)'"
            position="bottom"
            @clicked="copyToClipboard(item.mobile)"
          />
        </template>
        <template v-slot:[`item.diet`]="{ item }">
          <tooltipped-icon
            v-if="item.diet == 'meat'"
            icon="mdi-food-steak"
            text="meat"
            color="red"
            position="bottom"
          />
          <tooltipped-icon
            v-if="item.diet == 'vegetarian'"
            icon="mdi-egg"
            color="#ffbb00"
            text="vegetarian"
            position="bottom"
          />
          <tooltipped-icon
            v-if="item.diet == 'vegan'"
            icon="mdi-sprout"
            color="green"
            text="vegan"
            position="bottom"
          />
        </template>
        <template v-slot:[`item.birthday`]="{ item }">
          <v-chip
            class="ma-2"
            v-if="item.birthday"
            :color="birthdayColor(item.birthday)"
          >
            {{ item.birthday }}
          </v-chip>
        </template>
        <template v-slot:[`item.extras`]="{ item }">
          <tooltipped-icon
            v-if="item.extras"
            icon="mdi-information-variant"
            :text="item.extras"
            position="bottom"
          />
        </template>
        <template v-slot:[`item.actions`]="{ item }">
          <v-btn
            small
            icon
            :to="{ name: 'StudentOfficerDetails', params: { id: item.id } }"
          >
            <v-icon small color="primary">
              mdi-pencil
            </v-icon>
          </v-btn>
          <v-btn small icon @click="deleteStudentOfficer(item)">
            <v-icon small color="red">
              mdi-delete
            </v-icon>
          </v-btn>
        </template>
        <template v-slot:no-data>
          <span>No student officers available!</span>
        </template>
      </v-data-table>

      <toast-message
        ref="copiedToClipboardSnackbar"
        message="Copied to clipboard!"
        prepend_icon="mdi-content-copy"
      />
      <toast-message
        ref="deletedSnackbar"
        message="Deleted successfully"
        prepend_icon="mdi-check"
        color="success"
      />
      <toast-message
        ref="deletedErrorSnackbar"
        message="Deletion wasn't successful"
        prepend_icon="mdi-alert"
        color="error"
      />
    </v-container>
  </div>
</template>

<script>
import StudentOfficerDialog from "./StudentOfficerDialog.vue";
import TooltippedIcon from "../generic/TooltippedIcon.vue";
import ToastMessage from "../generic/ToastMessage.vue";
export default {
  components: { StudentOfficerDialog, TooltippedIcon, ToastMessage },
  name: "StudentOfficers",

  data: () => ({
    studentofficers: [],
    conference: null, // required to calculate age of participants at beginning of conference
    search: "",
    expanded: [],
    selected: [],
    editedIndex: null,
    editedItem: { first_name: "", last_name: "" },
    newStudentOfficerDialog: false,
    deleteStudentOfficerDialog: false,
    headers: [
      { text: "", value: "data-table-expand", groupable: false },
      {
        text: "Name",
        align: "start",
        sortable: true,
        value: "name",
        groupable: false,
      },
      { text: "Position", value: "position_name" },
      { text: "Gender", value: "gender" },
      { text: "Email", value: "email", groupable: false },
      { text: "Mobile", value: "mobile", groupable: false },
      { text: "Diet", value: "diet" },
      { text: "Birthday", value: "birthday", groupable: false },
      { text: "Extras", value: "extras", groupable: false },
      {
        text: "Actions",
        value: "actions",
        sortable: false,
        groupable: false,
      },
      { text: "", value: "data-table-select", groupable: false },
    ],
  }),
  mounted() {
    // fetch required data for this page
    this.$http
      .get("api/conferences/")
      .then((response) => {
        [this.conference] = response.data;
      })
      .catch((error) => console.trace(`%c ${error}", "#FF0000`));
    this.$http
      .get("api/student-officers/")
      .then((response) => {
        this.studentofficers = response.data;
      })
      .catch((error) => alert(error));
  },
  computed: {
    download() {
      // downloads selected items as JSON
      const json_encoded = JSON.stringify(this.selected, null, 4);
      const blob = new Blob([json_encoded], { type: "application/json" });
      return window.URL.createObjectURL(blob);
    },
  },
  methods: {
    openNewStudentOfficerDialog() {
      this.$refs.newStudentOfficerDialog.open();
    },
    deleteStudentOfficer(item) {
      this.editedIndex = this.studentofficers.indexOf(item);
      this.editedItem = Object.assign({}, item);
      this.deleteStudentOfficerDialog = true;
    },

    async deleteItemConfirm() {
      await this.$http
        .delete(`api/student-officers/${this.editedItem.id}/`, {})
        .then((r) => {
          if (r.status == 204) {
            this.$refs.deletedSnackbar.show();
            //TODO: trigger page refresh
          } else {
            console.log(r.status);
          }
        })
        .catch((e) => {
          console.log(e);
          this.$refs.deletedErrorSnackbar.show();
        });
      this.studentofficers.splice(this.editedIndex, 1);
      this.closeDeleteDialog();
    },
    closeDeleteDialog() {
      this.deleteStudentOfficerDialog = false;
      this.editedIndex = null;
      this.editedItem = null;
    },
    closeAll() {
      console.log(this.expanded);
      this.expanded = [];
    },
    openAll() {
      this.expanded = this.studentofficers;
    },
    birthdayColor(dateString) {
      const date = new Date(dateString);
      const difference = new Date(this.conference.startdate) - date;
      const years = difference / (1000 * 60 * 60 * 24 * 365);
      if (years < 16) {
        return "red";
      } else if (years < 18) {
        return "orange";
      } else if (years >= 18) {
        return "green";
      } else {
        return "gray";
      }
    },
    copyToClipboard(text) {
      this.$copyText(text).then(() => {
        this.$refs.copiedToClipboardSnackbar.show();
      });
    },
  },
};
</script>
