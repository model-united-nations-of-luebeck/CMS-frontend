<template>
  <div>
    <v-container>
      <!-- Floating action button -->
      <v-btn @click="openNewIssueDialog" fab right bottom fixed color="primary"
        ><v-icon>mdi-plus</v-icon></v-btn
      >
      <!-- Dialog for creating new issues -->
      <issue-dialog ref="newIssueDialog"></issue-dialog>

      <!-- Header with actions -->
      <v-card-title>
        Issues on the Agenda

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
          v-if="this.expanded.length < this.issues.length"
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
            text="download data of selected issues as JSON"
            position="top"
        /></v-btn>
        <v-btn icon color="primary" v-if="this.selected.length != 0"
          ><download-csv :data="selected">
            <tooltipped-icon
              icon="mdi-file-delimited"
              text="download data of selected issues as CSV"
              position="top"
            /> </download-csv
        ></v-btn>
        <v-btn icon color="primary" v-if="this.selected.length != 0"
          ><download-excel :data="selected">
            <tooltipped-icon
              icon="mdi-microsoft-excel"
              text="download data of selected issues as Excel file (xls)"
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

      <!-- Table with issues -->
      <v-data-table
        :headers="headers"
        :items="issues"
        class="elevation-1"
        show-select
        v-model="selected"
        :search="search"
        :itemsPerPage="-1"
        :footer-props="{
          showFirstLastPage: true,
          itemsPerPageOptions: [5, 15, -1],
          itemsPerPageText: 'Issues per page:',
          showCurrentPage: true,
        }"
      >
        <template v-slot:[`footer.page-text`]="props"
          >Issues {{ props.pageStart }} - {{ props.pageStop }} of
          {{ props.itemsLength }}</template
        >
        <template v-slot:top>
          <!-- delete issue dialog -->
          <v-dialog v-model="deleteIssueDialog" max-width="500px">
            <v-card>
              <v-card-title>Delete issue?</v-card-title>
              <v-card-text
                >Are you sure you want to delete this issue?
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
          {{ item.name }}
        </template>
        <template v-slot:[`item.actions`]="{ item }">
          <v-btn
            small
            icon
            :to="{ name: 'IssueDetails', params: { id: item.id } }"
          >
            <v-icon small color="primary">
              mdi-pencil
            </v-icon>
          </v-btn>
          <v-btn small icon @click="deleteIssue(item)">
            <v-icon small color="red">
              mdi-delete
            </v-icon>
          </v-btn>
        </template>
        <template v-slot:no-data>
          <span>No issues available!</span>
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
import IssueDialog from "./IssueDialog.vue";
import TooltippedIcon from "../generic/TooltippedIcon.vue";
import ToastMessage from "../generic/ToastMessage.vue";
export default {
  components: { IssueDialog, TooltippedIcon, ToastMessage },
  name: "Issues",

  data: () => ({
    issues: [],
    forums: null,
    conference: null, // required to calculate age of participants at beginning of conference
    search: "",
    expanded: [],
    selected: [],
    editedIndex: null,
    editedItem: { first_name: "", last_name: "" },
    newIssueDialog: false,
    deleteIssueDialog: false,
    headers: [
      {
        text: "Name",
        align: "start",
        sortable: true,
        value: "name",
        groupable: false,
      },
      {
        text: "Forum",
        sortable: true,
        value: "forum",
        groupable: false,
      },
      {
        text: "Actions",
        value: "actions",
        sortable: false,
        groupable: false,
      },
      { text: "", value: "data-table-select", groupable: false },
    ],
  }),
  async mounted() {
    // fetch required data for this page
    try {
      const [conference] = (
        await this.$http.get(
          "https://munoltom.pythonanywhere.com/api/conferences/"
        )
      ).data;
      this.conference = conference;
      const { data } = await this.$http.get(
        "https://munoltom.pythonanywhere.com/api/issues/"
      );
      this.issues = data;
    } catch (error) {
      alert(error);
    }
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
    openNewIssueDialog() {
      this.$refs.newIssueDialog.open();
    },
    deleteIssue(item) {
      this.editedIndex = this.issues.indexOf(item);
      this.editedItem = Object.assign({}, item);
      this.deleteIssueDialog = true;
    },

    async deleteItemConfirm() {
      await this.$http
        .delete(
          `https://munoltom.pythonanywhere.com/api/issues/${this.editedItem.id}/`,
          {}
        )
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
      this.issues.splice(this.editedIndex, 1);
      this.closeDeleteDialog();
    },
    closeDeleteDialog() {
      this.deleteIssueDialog = false;
      this.editedIndex = null;
      this.editedItem = null;
    },
    closeAll() {
      console.log(this.expanded);
      this.expanded = [];
    },
    openAll() {
      this.expanded = this.issues;
    },
    copyToClipboard(text) {
      this.$copyText(text).then(() => {
        this.$refs.copiedToClipboardSnackbar.show();
      });
    },
  },
};
</script>
