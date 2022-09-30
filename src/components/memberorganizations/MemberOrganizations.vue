<template>
  <div>
    <v-container>
      <!-- Floating action button -->
      <v-btn
        @click="openNewMemberOrganizationDialog"
        fab
        right
        bottom
        fixed
        color="primary"
        ><v-icon>mdi-flag-variant-plus</v-icon></v-btn
      >
      <!-- Dialog for creating new member organizations -->
      <member-organization-dialog
        ref="newMemberOrganizationDialog"
      ></member-organization-dialog>

      <!-- Header with actions -->
      <v-card-title>
        Member Organizations

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
          v-if="this.expanded.length < this.memberOrganizations.length"
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
            text="download data of selected member organizations as JSON"
            position="top"
        /></v-btn>
        <v-btn icon color="primary" v-if="this.selected.length != 0"
          ><download-csv :data="selected">
            <tooltipped-icon
              icon="mdi-file-delimited"
              text="download data of selected member organizations as CSV"
              position="top"
            /> </download-csv
        ></v-btn>
        <v-btn icon color="primary" v-if="this.selected.length != 0"
          ><download-excel :data="selected">
            <tooltipped-icon
              icon="mdi-microsoft-excel"
              text="download data of selected member organizations as Excel file (xls)"
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

      <!-- Table with member organizations -->
      <v-data-table
        :headers="headers"
        :items="memberOrganizations"
        class="elevation-1"
        show-select
        v-model="selected"
        :search="search"
        :itemsPerPage="-1"
        :footer-props="{
          showFirstLastPage: true,
          itemsPerPageOptions: [5, 15, -1],
          itemsPerPageText: 'Member Organizations per page:',
          showCurrentPage: true,
        }"
      >
        <template v-slot:[`footer.page-text`]="props"
          >Member Organizations {{ props.pageStart }} - {{ props.pageStop }} of
          {{ props.itemsLength }}</template
        >
        <template v-slot:top>
          <!-- delete member organization dialog -->
          <v-dialog v-model="deleteMemberOrganizationDialog" max-width="500px">
            <v-card>
              <v-card-title>Delete member organization?</v-card-title>
              <v-card-text
                >Are you sure you want to delete this member organization?
                Instead, please consider deactivating it if you currently don't
                need it. Only delete organizations if they are outdated or
                incorrect.
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
        <template v-slot:[`item.flag`]="{ item }">
          <v-avatar size="40">
            <v-img
              :src="item.flag"
              avatar
              :class="{ grayscale: !item.active }"
            ></v-img>
          </v-avatar>
        </template>
        <template v-slot:[`item.name`]="{ item }">
          <div class="mo-title">{{ item.name }}</div>
          <div class="mo-subtitle">{{ item.official_name }}</div>
        </template>
        <template v-slot:[`item.placard_name`]="{ item }">
          <v-chip v-if="item.active">
            <v-icon left>
              mdi-tag
            </v-icon>
            {{ item.placard_name }}
          </v-chip>
        </template>
        <template v-slot:[`item.status`]="{ item }">
          <v-chip>
            <v-icon left>
              mdi-shield-star-outline
            </v-icon>
            {{ item.status }}
          </v-chip>
        </template>
        <template v-slot:[`item.active`]="{ item }">
          <v-switch v-model="item.active"></v-switch>
        </template>

        <template v-slot:[`item.actions`]="{ item }">
          <v-btn icon @click="deleteMemberOrganization(item)">
            <v-icon color="red">
              mdi-delete
            </v-icon>
          </v-btn>
        </template>
        <template v-slot:no-data>
          <span>No member organizations available!</span>
        </template>
      </v-data-table>

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
import TooltippedIcon from "../generic/TooltippedIcon.vue";
import ToastMessage from "../generic/ToastMessage.vue";
import MemberOrganizationDialog from "./MemberOrganizationDialog.vue";
export default {
  name: "MemberOrganizations",
  components: { TooltippedIcon, ToastMessage, MemberOrganizationDialog },
  data: () => ({
    memberOrganizations: [],
    search: "",
    deleteMemberOrganizationDialog: false,
    editedIndex: null,
    editedItem: null,
    expanded: [],
    selected: [],
    headers: [
      {
        text: "",
        value: "flag",
        sortable: false,
        groupable: false,
        align: "center",
      },
      {
        text: "Name",
        align: "start",
        sortable: true,
        value: "name",
        groupable: false,
      },
      { text: "Placard Name", value: "placard_name", sortable: true },
      { text: "Status", value: "status", sortable: true },
      { text: "Active", value: "active", sortable: true },
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
    this.$http
      .get("https://munoltom.pythonanywhere.com/api/member-organizations/")
      .then((response) => {
        this.memberOrganizations = response.data;
      })
      .catch((error) => alert(error));
  },
  methods: {
    openNewMemberOrganizationDialog() {
      this.$refs.newMemberOrganizationDialog.open();
    },
    deleteMemberOrganization(item) {
      this.editedIndex = this.memberOrganizations.indexOf(item);
      this.editedItem = Object.assign({}, item);
      this.deleteMemberOrganizationDialog = true;
    },

    async deleteItemConfirm() {
      await this.$http
        .delete(
          `https://munoltom.pythonanywhere.com/api/member-organizations/${this.editedItem.id}/`,
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
      this.memberOrganizations.splice(this.editedIndex, 1);
      this.closeDeleteDialog();
    },
    closeDeleteDialog() {
      this.deleteMemberOrganizationDialog = false;
      this.editedIndex = null;
      this.editedItem = null;
    },
    closeAll() {
      this.expanded = [];
    },
    openAll() {
      this.expanded = this.memberOrganizations;
    },
  },
  computed: {
    download() {
      // downloads selected items as JSON
      const json_encoded = JSON.stringify(this.selected, null, 4);
      const blob = new Blob([json_encoded], { type: "application/json" });
      return window.URL.createObjectURL(blob);
    },
  },
};
</script>

<style scoped>
.grayscale {
  filter: gray; /* IE6-9 */
  -webkit-filter: grayscale(1); /* Google Chrome, Safari 6+ & Opera 15+ */
  filter: grayscale(1); /* Microsoft Edge and Firefox 35+ */
}

.v-btn {
  margin: 10px 0px;
}

.v-navigation-drawer__content {
  display: grid;
  align-content: space-between;
}

.mo-title {
  font-size: 1.1em;
  font-weight: 420;
}

.mo-subtitle {
  font-size: 0.87em;
  line-height: 1.1em;
  color: rgba(0, 0, 0, 0.75);
}
</style>
