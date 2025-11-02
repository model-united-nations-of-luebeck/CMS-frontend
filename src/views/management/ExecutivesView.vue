<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
const router = useRouter();
const origin = window.location.origin + router.options.history.base;
import { useExecutivesStore } from "../../stores/executives";
import { sortParticipantsByName, sortParticipantsByAge } from "../../stores/participants";
import ConsentDisplay from "../../components/displays/ConsentDisplay.vue";
import BadgePhotoDisplay from "../../components/displays/BadgePhotoDisplay.vue";
import MediaConsentIcon from "../../components/icons/MediaConsentIcon.vue";
import ExtraInformationIcon from "../../components/icons/ExtraInformationIcon.vue";
import BirthdayChip from "../../components/chips/BirthdayChip.vue";
import MobilePhoneIcon from "../../components/icons/MobilePhoneIcon.vue";
import MailIcon from "../../components/icons/MailIcon.vue";
import ParticipantDisplay from "../../components/displays/ParticipantDisplay.vue";
import ConfirmDialog from "../../components/dialogs/ConfirmDialog.vue";
import LinkIcon from "../../components/icons/LinkIcon.vue";
import DownloadJSONIcon from "../../components/icons/DownloadJSONIcon.vue";
import DownloadExcelIcon from "../../components/icons/DownloadExcelIcon.vue";

const executivesStore = useExecutivesStore();
executivesStore.getExecutives();

const deleteDialog = ref(null);
const addNewExecutiveDialog = ref(false);
const newPosition = ref("");

const search = ref("");
const expanded = ref([]);
const selected = ref([]);
const valid = ref(true);

const headers = [
  { title: "", key: "data-table-select", sortable: false },
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
    value: (item) => item.position_name.replace("Assistant ", ""),
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
    align: "center",
    sortable: true,
    key: "age",
    sortRaw: sortParticipantsByAge,
  },
  {
    title: "Icons",
    align: "center",
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

  return searchFields.some((field) => String(field).toLowerCase().includes(query.toLowerCase()));
};

const createExecutive = function () {
  if (newPosition.value !== "") {
    executivesStore.createExecutive(newPosition.value).then(() => {
      addNewExecutiveDialog.value = false;
      newPosition.value = "";
    });
  }
};

const deleteExecutive = function (executive_id) {
  deleteDialog.value = executive_id;
};

const confirmedDeleteExecutive = function () {
  executivesStore.deleteExecutive(deleteDialog.value);
  deleteDialog.value = false;
};
</script>

<template>
  <div class="">
    <v-row>
      <v-col cols="10">
        <v-breadcrumbs :items="[{ title: 'Executives' }]">
          <template v-slot:prepend>
            <v-icon icon="mdi-account-settings" size="small" start disabled></v-icon>
          </template>

          <DownloadExcelIcon
            :items="
              selected.map((executive) => ({
                ...executive,
                mobile: `'${executive.mobile}`,
              }))
            "
            name="executives.xls"
          ></DownloadExcelIcon>
          <DownloadJSONIcon :items="selected" name="executives.json"></DownloadJSONIcon>

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
      <v-col cols="2" style="display: flex">
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
      v-model="selected"
      v-if="executivesStore.executives"
      :headers="headers"
      :items="executivesStore.executives"
      item-key="id"
      items-per-page="-1"
      items-per-page-text="Executives per page"
      hover
      :loading="executivesStore.loading ? 'primary' : false"
      fixed-header
      :search="search"
      :sort-by="[
        { key: 'position_name', order: 'asc' },
        { key: 'name', order: 'asc' },
      ]"
      :multi-sort="true"
      v-model:expanded="expanded"
      hide-default-footer
      :custom-filter="custom_filter"
      item-height="56"
      height="calc(100vh - 160px)"
      show-select
      return-object
    >
      <template v-slot:loading>
        <v-skeleton-loader type="table-row@20"></v-skeleton-loader>
      </template>
      <template v-slot:header[`data-table-select`]="{ allSelected, selectAll, someSelected }">
        <v-checkbox-btn
          :indeterminate="someSelected && !allSelected"
          :model-value="allSelected"
          color="primary"
          @update:model-value="selectAll(!allSelected)"
        ></v-checkbox-btn>
      </template>
      <template
        v-slot:item="{ item, internalItem, toggleExpand, isExpanded, isSelected, toggleSelect }"
      >
        <tr>
          <td>
            <v-checkbox-btn
              :model-value="isSelected(internalItem)"
              color="primary"
              @update:model-value="toggleSelect(internalItem)"
            ></v-checkbox-btn>
          </td>
          <td>
            <v-btn
              @click="toggleExpand(internalItem)"
              variant="plain"
              :icon="isExpanded(internalItem) ? 'mdi-chevron-up' : 'mdi-chevron-down'"
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

          <td class="center">
            <MailIcon :email="item.email"></MailIcon>
          </td>
          <td class="center">
            <MobilePhoneIcon :mobile="item.mobile"></MobilePhoneIcon>
          </td>

          <td class="center">
            <BirthdayChip :birthday="item.birthday"></BirthdayChip>
          </td>

          <td class="center">
            <MediaConsentIcon :media_consent_time="item.media_consent_time"></MediaConsentIcon>

            <ExtraInformationIcon :extras="item.extras"></ExtraInformationIcon>
          </td>

          <td>
            <LinkIcon
              :link="`${origin}${
                router.resolve({
                  name: 'executive-registration',
                  params: { executive_id: item.id },
                }).path
              }`"
            ></LinkIcon>
            <v-btn
              variant="plain"
              icon="mdi-pencil"
              :to="{
                name: 'executive-detail',
                params: { executive_id: item.id },
              }"
            >
            </v-btn>
            <v-btn variant="plain" icon="mdi-delete" @click.stop="deleteExecutive(item.id)">
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
          executivesStore.executives.filter((executive) => executive.id == deleteDialog.value).id,
        )
      "
      @cancel-clicked="deleteDialog.value = false"
    ></ConfirmDialog>

    <v-dialog max-width="500" v-model="addNewExecutiveDialog">
      <template v-slot:default="{ isActive }">
        <v-form v-model="valid">
          <v-card title="Add new Executive">
            <v-card-text>
              <v-text-field
                v-model="newPosition"
                label="Position"
                hint="e.g. 'Assistant Head of School Management'"
                :rules="[
                  (v) => !!v || 'Position is required',
                  (v) => (v && v.length <= 50) || '50 characters maximum',
                ]"
                outlined
                required
              ></v-text-field>
            </v-card-text>

            <v-card-actions>
              <v-spacer></v-spacer>

              <v-btn text="Cancel" @click="isActive.value = false"></v-btn>
              <v-btn text="Create" :disabled="!valid" @click="createExecutive"></v-btn>
            </v-card-actions>
          </v-card>
        </v-form>
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

.center {
  text-align: center;
}

.v-table > .v-table__wrapper > table > tbody > tr > td {
  padding: 0 4px;
}

.v-table > .v-table__wrapper > table > thead > tr > th {
  padding: 0 4px !important;
}
</style>
