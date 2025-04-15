<script setup>
import { ref } from "vue";
import { useExecutivesStore } from "../../stores/executives";
import {
  sortParticipantsByName,
  sortParticipantsByAge,
} from "../../stores/participants";
import ConsentDisplay from "../../components/displays/ConsentDisplay.vue";
import BadgePhotoDisplay from "../../components/displays/BadgePhotoDisplay.vue";
import MediaConsentIcon from "../../components/icons/MediaConsentIcon.vue";
import ExtraInformationIcon from "../../components/icons/ExtraInformationIcon.vue";
import BirthdayChip from "../../components/chips/BirthdayChip.vue";
import MobilePhoneIcon from "../../components/icons/MobilePhoneIcon.vue";
import MailIcon from "../../components/icons/MailIcon.vue";
import ParticipantDisplay from "../../components/displays/ParticipantDisplay.vue";
import ConfirmDialog from "../../components/dialogs/ConfirmDialog.vue";

const executivesStore = useExecutivesStore();
executivesStore.getExecutives();

const deleteDialog = ref(null);
const addNewExecutiveDialog = ref(false);
const newFirstName = ref("");
const newLastName = ref("");
const newPosition = ref("");

const search = ref("");
const expanded = ref([]);

const headers = [
  { title: "", key: "data-table-expand", sortable: false },
  {
    title: "Name",
    align: "start",
    sortable: true,
    key: "name",
    sortRaw: sortParticipantsByName,
  },
  {
    title: "Position",
    align: "start",
    sortable: true,
    key: "position_name",
    sortRaw(a, b) {
      if (a && b && a.position_name && b.position_name) {
        const getComparablePosition = (position) =>
          position.startsWith("Assistant")
            ? position.replace("Assistant", "").trim()
            : position;

        return (
          getComparablePosition(a.position_name) <
          getComparablePosition(b.position_name)
        );
      }
      return 0;
    },
  },
  {
    title: "School",
    align: "start",
    sortable: true,
    key: "school_name",
  },
  {
    title: "E-Mail",
    align: "center",
    key: "email",
    sortable: false,
  },
  {
    title: "Mobile",
    align: "center",
    key: "mobile",
    sortable: false,
  },
  {
    title: "Age",
    align: "start",
    sortable: true,
    key: "age",
    sortRaw: sortParticipantsByAge,
  },
  {
    title: "Icons",
    align: "start",
    key: "icons",
    sortable: false,
  },
  {
    title: "Actions",
    key: "actions",
    sortable: false,
  },

  // { text: "", value: "data-table-select" },
];

const custom_filter = function (value, query, item) {
  // searches all attributes of the item (not only the columns) and related objects if they contain the query
  if (!item || !query) return false;

  const searchFields = [...Object.values(item.raw)];

  return searchFields.some((field) =>
    String(field).toLowerCase().includes(query.toLowerCase()),
  );
};

const createExecutive = function () {
  if (
    newFirstName.value !== "" &&
    newLastName.value !== "" &&
    newPosition.value !== ""
  ) {
    executivesStore
      .createExecutive(newFirstName.value, newLastName.value, newPosition.value)
      .then(() => {
        addNewExecutiveDialog.value = false;
        newFirstName.value = "";
        newLastName.value = "";
        newPosition.value = "";
      });
  }
};

const deleteExecutive = function (executive_id) {
  this.deleteDialog = executive_id;
};

const confirmedDeleteExecutive = function () {
  executivesStore.deleteExecutive(this.deleteDialog);
  this.deleteDialog = false;
};
</script>

<template>
  <div class="">
    <v-row>
      <v-col cols="11">
        <v-breadcrumbs :items="[{ title: 'Executives' }]">
          <template v-slot:prepend>
            <v-icon
              icon="mdi-account-settings"
              size="small"
              start
              disabled
            ></v-icon>
          </template>
          <v-spacer></v-spacer>
          <v-text-field
            label="Filter"
            prepend-inner-icon="mdi-magnify"
            variant="underlined"
            color="primary"
            single-line
            hide-details
            clearable
            v-model="search"
            id="search"
          ></v-text-field>
          <v-spacer></v-spacer>
        </v-breadcrumbs>
      </v-col>
      <v-col cols="1" style="display: flex">
        <v-fab
          color="primary"
          rounded
          style="justify-content: end"
          prepend-icon="mdi-plus"
          text="add new executive"
          @click="addNewExecutiveDialog = true"
        ></v-fab>
      </v-col>
    </v-row>

    <v-data-table-virtual
      :headers="headers"
      :items="executivesStore.executives"
      item-key="id"
      items-per-page="-1"
      items-per-page-text="Executives per page"
      hover
      :loading="executivesStore.loading ? 'primary' : false"
      sticky
      :search="search"
      :sort-by="[
        { key: 'position_name', order: 'desc' },
        { key: 'name', order: 'desc' },
      ]"
      :multi-sort="true"
      v-model:expanded="expanded"
      hide-default-footer
      :custom-filter="custom_filter"
    >
      <template v-slot:loading>
        <v-skeleton-loader type="table-row@10"></v-skeleton-loader>
      </template>
      <template v-slot:item="{ item, internalItem, toggleExpand, isExpanded }">
        <tr>
          <td>
            <v-btn
              @click="toggleExpand(internalItem)"
              variant="plain"
              :icon="
                isExpanded(internalItem) ? 'mdi-chevron-up' : 'mdi-chevron-down'
              "
            ></v-btn>
          </td>
          <td>
            <ParticipantDisplay
              :first_name="item.first_name"
              :last_name="item.last_name"
              :pronouns="item.pronouns"
              :gender="item.gender"
            >
            </ParticipantDisplay>
          </td>

          <td>
            <v-chip>{{ item.position_name }}</v-chip>
          </td>

          <td>
            <v-chip variant="text">{{ item.school_name }}</v-chip>
          </td>

          <td>
            <MailIcon
              :email="item.email"
              :email_verified="item.email_verified"
            ></MailIcon>
          </td>
          <td>
            <MobilePhoneIcon :mobile="item.mobile"></MobilePhoneIcon>
          </td>

          <td>
            <BirthdayChip :birthday="item.birthday"></BirthdayChip>
          </td>

          <td>
            <MediaConsentIcon
              :media_consent_time="item.media_consent_time"
            ></MediaConsentIcon>

            <ExtraInformationIcon :extras="item.extras"></ExtraInformationIcon>
          </td>

          <td>
            <v-btn
              variant="plain"
              icon="mdi-pencil"
              :to="{
                name: 'executive-detail',
                params: { executive_id: item.id },
              }"
            >
            </v-btn>
            <v-btn
              variant="plain"
              icon="mdi-delete"
              @click.stop="deleteExecutive(item.id)"
            >
            </v-btn>
          </td>
        </tr>
      </template>

      <template v-slot:expanded-row="{ columns, item }">
        <tr>
          <td :colspan="columns.length">
            <div style="display: flex; gap: 16px">
              <div style="flex: 1">
                <BadgePhotoDisplay :picture="item.picture"></BadgePhotoDisplay>
              </div>
              <div style="flex: 2; padding: 16px">
                <ConsentDisplay
                  :data_consent_time="item.data_consent_time"
                  :data_consent_ip="item.data_consent_ip"
                  :media_consent_time="item.media_consent_time"
                  :media_consent_ip="item.media_consent_ip"
                ></ConsentDisplay>
              </div>
            </div>
          </td>
        </tr>
      </template>
    </v-data-table-virtual>

    <ConfirmDialog
      :model="deleteDialog"
      title="Confirm Delete"
      text="Are you sure you want to delete this Executive?"
      @ok-clicked="
        confirmedDeleteExecutive(
          executivesStore.executives.filter(
            (executive) => executive.id == this.deleteDialog,
          ).id,
        )
      "
      @cancel-clicked="deleteDialog = false"
    ></ConfirmDialog>

    <v-dialog max-width="500" v-model="addNewExecutiveDialog">
      <template v-slot:default="{ isActive }">
        <v-card title="Add new Executive">
          <v-card-text>
            <v-text-field
              v-model="newFirstName"
              label="First name"
              outlined
              autofocus="autofocus"
            ></v-text-field>
            <v-text-field
              v-model="newLastName"
              label="Last name"
              outlined
            ></v-text-field>
            <v-text-field
              v-model="newPosition"
              label="Position"
              outlined
            ></v-text-field>
          </v-card-text>

          <v-card-actions>
            <v-spacer></v-spacer>

            <v-btn text="Cancel" @click="isActive.value = false"></v-btn>
            <v-btn text="Create" @click="createExecutive"></v-btn>
          </v-card-actions>
        </v-card>
      </template>
    </v-dialog>
  </div>
</template>

<style>
.hidden {
  visibility: hidden;
}

h3 {
  margin-top: 8px;
}
</style>

<!-- TODO:
 - add selectable rows to export selected data as JSON, CSV, or EXCEL
-->
