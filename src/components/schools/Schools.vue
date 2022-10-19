<template>
  <div>
    <v-container>
      <!-- Floating action button -->
      <v-btn @click="openNewSchoolDialog" fab right bottom fixed color="primary"
        ><v-icon>mdi-plus</v-icon></v-btn
      >

      <!-- Dialog for creating new schools -->
      <school-dialog ref="newSchoolDialog"></school-dialog>

      <!-- Header with actions -->
      <v-card-title>
        Schools

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
          v-if="this.expanded.length < this.schools.length"
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
            text="download data of selected schools as JSON"
            position="top"
        /></v-btn>
        <v-btn icon color="primary" v-if="this.selected.length != 0"
          ><download-csv :data="selected">
            <tooltipped-icon
              icon="mdi-file-delimited"
              text="download data of selected schools as CSV"
              position="top"
            /> </download-csv
        ></v-btn>
        <v-btn icon color="primary" v-if="this.selected.length != 0"
          ><download-excel :data="selected">
            <tooltipped-icon
              icon="mdi-microsoft-excel"
              text="download data of selected schools as Excel file (xls)"
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

      <!-- Table with schools -->
      <v-data-table
        :headers="headers"
        :items="schools"
        class="elevation-1"
        show-expand
        :expanded.sync="expanded"
        show-select
        v-model="selected"
        :search="search"
        :itemsPerPage="-1"
        :footer-props="{
          showFirstLastPage: true,
          itemsPerPageOptions: [5, 15, -1],
          itemsPerPageText: 'Schools per page:',
          showCurrentPage: true,
        }"
      >
        <template v-slot:[`footer.page-text`]="props"
          >Schools {{ props.pageStart }} - {{ props.pageStop }} of
          {{ props.itemsLength }}</template
        >
        <template v-slot:[`item.name`]="{ item }">
          {{ `${item.name} (${item.city}, ${item.country})` }}
        </template>
        <template v-slot:[`item.fee`]="{ item }">
          <tooltipped-icon
            icon="mdi-currency-eur"
            text="pre-reg fee not paid yet"
            v-if="item.fee"
          />
          <tooltipped-icon
            icon="mdi-check"
            text="pre-reg fee already paid"
            v-if="!item.fee"
          />
        </template>

        <template v-slot:[`item.requested`]="{ item }">
          <tooltipped-icon
            icon="mdi-account-outline"
            text="Numer of student requested"
            position="left"
          />
          {{ String(item.requested).padStart(4, "&nbsp;") }}
        </template>
        <template v-slot:[`item.confirmed`]="{}">
          <tooltipped-icon
            color="green"
            icon="mdi-account"
            text="Numer of student confirmed"
            position="left"
          />13
        </template>
        <template v-slot:[`item.housing`]="{ item }">
          <tooltipped-icon
            :icon="item.housing | housingIcon"
            :text="item.housing | capitalize"
          />
        </template>
        <template v-slot:[`item.registration_status`]="{ item }">
          <v-chip :color="item.registration_status | regStatusColor">
            {{ item.registration_status }}
          </v-chip>
        </template>
        <template v-slot:[`item.actions`]="{ item }">
          <v-btn
            small
            icon
            :to="{ name: 'SchoolDetails', params: { id: item.id } }"
          >
            <v-icon small color="primary">
              mdi-pencil
            </v-icon>
          </v-btn>
        </template>
        <template v-slot:expanded-item="{ headers, item }">
          <td :colspan="headers.length">
            <v-row>
              <v-col sm="4">
                <p>{{ item.street }}</p>
                <p>{{ item.zipcode }}, {{ item.city }}</p>
                <p>{{ item.country }}</p>
              </v-col>
              <v-col sm="4">
                <v-textarea
                  outlined
                  label="Arrival"
                  rows="2"
                  readonly
                  :value="item.arrival"
                ></v-textarea>
                <v-textarea
                  outlined
                  label="Departure"
                  rows="2"
                  readonly
                  :value="item.departure"
                ></v-textarea>
              </v-col>
              <v-col sm="4">
                <v-textarea
                  outlined
                  label="Internal comment"
                  rows="7"
                  :value="item.comment"
                ></v-textarea>
              </v-col>
            </v-row>
          </td>
        </template>
        <template v-slot:no-data>
          <span>No schools available!</span>
        </template>
      </v-data-table>

      <toast-message
        ref="copiedToClipboardSnackbar"
        message="Copied to clipboard!"
        prepend_icon="mdi-content-copy"
      />
    </v-container>
  </div>
</template>

<script>
import SchoolDialog from "./SchoolDialog.vue";
import TooltippedIcon from "../generic/TooltippedIcon";
import ToastMessage from "../generic/ToastMessage.vue";

export default {
  name: "Schools",
  components: { TooltippedIcon, ToastMessage, SchoolDialog },
  filters: {
    capitalize(value) {
      if (!value) return "";
      value = value.toString();
      return value.charAt(0).toUpperCase() + value.slice(1);
    },
    regStatusColor(value) {
      switch (value) {
        case "WAITING_FOR_PRE_REGISTRATION":
          return "red";
        case "PRE_REGISTRATION_DONE":
          return "orange";
        case "WAITING_FOR_DATA_PROTECTION":
          return "red";
        case "WAITING_FOR_FINAL_REGISTRATION":
          return "red";
        case "FINAL_REGISTRATION_DONE":
          return "green";
        case "CANCELED":
          return "gray";
        default:
          return "red";
      }
    },
    housingIcon(value) {
      switch (value) {
        case "guest family":
          return "mdi-home-heart";
        case "hostel":
          return "mdi-hotel";
        default:
          return "mdi-home";
      }
    },
  },
  data: () => ({
    schools: [],
    search: "",
    expanded: [],
    selected: [],
    editedIndex: null,
    editedItem: { first_name: "", last_name: "" },
    newAdvisorDialog: false,
    headers: [
      { text: "", value: "data-table-expand", groupable: false },
      {
        text: "Name",
        align: "start",
        sortable: true,
        value: "name",
        groupable: false,
      },
      { text: "City", value: "city", align: " d-none" }, //to make it searchable by city
      { text: "Country", value: "country", algin: " d-none" }, //to make it searchable by city
      { text: "Pre-Reg Fee", value: "fee", align: "center" },
      {
        text: "requested",
        value: "requested",
        algin: "end",
        groupable: false,
      },
      { text: "confirmed", value: "confirmed", groupable: false },
      { text: "Housing", value: "housing" },
      { text: "Status", value: "registration_status" },
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
      .get("https://munoltom.pythonanywhere.com/api/schools/")
      .then((response) => {
        this.schools = response.data;
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
    closeAll() {
      console.log(this.expanded);
      this.expanded = [];
    },
    openAll() {
      this.expanded = this.delegates;
    },
    copyToClipboard(text) {
      this.$copyText(text).then(() => {
        this.$refs.copiedToClipboardSnackbar.show();
      });
    },
    openNewSchoolDialog() {
      this.$refs.newSchoolDialog.open();
    },
  },
};
</script>

<style>
.v-expansion-panel-header__icon {
  order: -1 !important;
}

.col {
  text-align: center;
}
</style>
