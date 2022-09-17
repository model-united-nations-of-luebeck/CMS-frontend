<template>
  <div>
    <v-container>
      <!-- Floating action button -->
      <v-btn @click="openNewForumDialog" fab right bottom fixed color="primary"
        ><v-icon>mdi-message-plus</v-icon></v-btn
      >
      <!-- Dialog for creating new forums -->
      <forum-dialog ref="newForumDialog"></forum-dialog>

      <!-- Header with actions -->
      <v-card-title>
        Forums

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
          v-if="this.expanded.length < this.forums.length"
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
            text="download data of selected forums as JSON"
            position="top"
        /></v-btn>
        <v-btn icon color="primary" v-if="this.selected.length != 0"
          ><download-csv :data="selected">
            <tooltipped-icon
              icon="mdi-file-delimited"
              text="download data of selected forums as CSV"
              position="top"
            /> </download-csv
        ></v-btn>
        <v-btn icon color="primary" v-if="this.selected.length != 0"
          ><download-excel :data="selected">
            <tooltipped-icon
              icon="mdi-microsoft-excel"
              text="download data of selected forums as Excel file (xls)"
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

      <!-- Table with forums -->
      <v-data-table
        :headers="headers"
        :items="forums"
        class="elevation-1"
        show-select
        v-model="selected"
        :search="search"
        :itemsPerPage="-1"
        :footer-props="{
          showFirstLastPage: true,
          itemsPerPageOptions: [5, 15, -1],
          itemsPerPageText: 'Forums per page:',
          showCurrentPage: true,
        }"
      >
        <template v-slot:[`footer.page-text`]="props"
          >Forums {{ props.pageStart }} - {{ props.pageStop }} of
          {{ props.itemsLength }}</template
        >
        <template v-slot:top>
          <!-- delete forum dialog -->
          <v-dialog v-model="deleteForumDialog" max-width="500px">
            <v-card>
              <v-card-title>Delete forum?</v-card-title>
              <v-card-text
                >Are you sure you want to delete this forum?
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
          <b>{{ item.name }}</b>
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
        <template v-slot:[`item.actions`]="{ item }">
          <v-btn
            small
            icon
            :to="{ name: 'ForumDetails', params: { id: item.id } }"
          >
            <v-icon small color="primary">
              mdi-pencil
            </v-icon>
          </v-btn>
          <v-btn small icon @click="deleteForum(item)">
            <v-icon small color="red">
              mdi-delete
            </v-icon>
          </v-btn>
        </template>
        <template v-slot:no-data>
          <span>No forums available!</span>
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
import ForumDialog from "./ForumDialog.vue";
import TooltippedIcon from "../generic/TooltippedIcon.vue";
import ToastMessage from "../generic/ToastMessage.vue";
export default {
  components: { ForumDialog, TooltippedIcon, ToastMessage },
  name: "Forums",

  data: () => ({
    forums: [],
    search: "",
    expanded: [],
    selected: [],
    editedIndex: null,
    editedItem: { first_name: "", last_name: "" },
    newForumDialog: false,
    deleteForumDialog: false,
    headers: [
      {
        text: "Name",
        align: "start",
        sortable: true,
        value: "name",
        groupable: false,
      },
      { text: "Abbreviation", value: "abbreviation", sortable: true },
      { text: "Subtitle", value: "subtitle", sortable: true },
      { text: "Email", value: "email", groupable: false },
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
      .get("https://munoltom.pythonanywhere.com/api/forums/")
      .then((response) => {
        this.forums = response.data;
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
    openNewForumDialog() {
      this.$refs.newForumDialog.open();
    },
    deleteForum(item) {
      this.editedIndex = this.forums.indexOf(item);
      this.editedItem = Object.assign({}, item);
      this.deleteForumDialog = true;
    },

    async deleteItemConfirm() {
      await this.$http
        .delete(
          `https://munoltom.pythonanywhere.com/api/forums/${this.editedItem.id}/`,
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
      this.forums.splice(this.editedIndex, 1);
      this.closeDeleteDialog();
    },
    closeDeleteDialog() {
      this.deleteForumDialog = false;
      this.editedIndex = null;
      this.editedItem = null;
    },
    closeAll() {
      console.log(this.expanded);
      this.expanded = [];
    },
    openAll() {
      this.expanded = this.forums;
    },
    copyToClipboard(text) {
      this.$copyText(text).then(() => {
        this.$refs.copiedToClipboardSnackbar.show();
      });
    },
  },
};
</script>
