<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
const router = useRouter();
const origin = window.location.origin;
import { useStaffsStore } from "../../stores/staffs";
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
import LinkIcon from "../../components/icons/LinkIcon.vue";

const staffsStore = useStaffsStore();
staffsStore.getStaffs();

const deleteDialog = ref(null);
const addNewStaffDialog = ref(false);
const newPosition = ref("");

const search = ref("");
const expanded = ref([]);
const valid = ref(true);

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

  return searchFields.some((field) =>
    String(field).toLowerCase().includes(query.toLowerCase()),
  );
};

const createStaff = function () {
  if (newPosition.value !== "") {
    staffsStore.createStaff(newPosition.value).then(() => {
      addNewStaffDialog.value = false;
      newPosition.value = "";
    });
  }
};

const deleteStaff = function (staff_id) {
  deleteDialog.value = staff_id;
};

const confirmedDeleteStaff = function () {
  staffsStore.deleteStaff(deleteDialog.value);
  deleteDialog.value = false;
};
</script>

<template>
  <div class="">
    <v-row>
      <v-col cols="10">
        <v-breadcrumbs :items="[{ title: 'Staffs' }]">
          <template v-slot:prepend>
            <v-icon icon="mdi-account" size="small" start disabled></v-icon>
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
      <v-col cols="2" style="display: flex">
        <v-fab
          color="primary"
          rounded
          style="justify-content: end"
          prepend-icon="mdi-plus"
          text="add new staff"
          @click="addNewStaffDialog = true"
        ></v-fab>
      </v-col>
    </v-row>

    <v-data-table-virtual
      v-if="staffsStore.staffs"
      :headers="headers"
      :items="staffsStore.staffs"
      item-key="id"
      items-per-page="-1"
      items-per-page-text="Staffs per page"
      hover
      :loading="staffsStore.loading ? 'primary' : false"
      fixed-header
      :search="search"
      :sort-by="[
        { key: 'position_name', order: 'asc' },
        { key: 'name', order: 'desc' },
      ]"
      :multi-sort="true"
      v-model:expanded="expanded"
      hide-default-footer
      :custom-filter="custom_filter"
      item-height="56"
      height="calc(100vh - 160px)"
    >
      <template v-slot:loading>
        <v-skeleton-loader type="table-row@20"></v-skeleton-loader>
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
            <MediaConsentIcon
              :media_consent_time="item.media_consent_time"
            ></MediaConsentIcon>

            <ExtraInformationIcon :extras="item.extras"></ExtraInformationIcon>
          </td>

          <td>
            <LinkIcon
              :link="`${origin}${
                router.resolve({
                  name: 'staff-registration',
                  params: { staff_id: item.id },
                }).path
              }`"
            ></LinkIcon>
            <v-btn
              variant="plain"
              icon="mdi-pencil"
              :to="{
                name: 'staff-detail',
                params: { staff_id: item.id },
              }"
            >
            </v-btn>
            <v-btn
              variant="plain"
              icon="mdi-delete"
              @click.stop="deleteStaff(item.id)"
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
      text="Are you sure you want to delete this Staff?"
      @ok-clicked="
        confirmedDeleteStaff(
          staffsStore.staffs.filter((staff) => staff.id == deleteDialog.value)
            .id,
        )
      "
      @cancel-clicked="deleteDialog.value = false"
    ></ConfirmDialog>

    <v-dialog max-width="500" v-model="addNewStaffDialog">
      <template v-slot:default="{ isActive }">
        <v-form v-model="valid">
          <v-card title="Add new Staff">
            <v-card-text>
              <v-text-field
                v-model="newPosition"
                label="Position"
                hint="e.g. 'Ad Staff' or 'IT Staff'"
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
              <v-btn
                text="Create"
                :disabled="!valid"
                @click="createStaff"
              ></v-btn>
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
</style>
