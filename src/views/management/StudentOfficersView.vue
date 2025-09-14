<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
const router = useRouter();
const origin = window.location.origin;
import { useStudentOfficersStore } from "../../stores/student_officers";
import { useForumsStore } from "../../stores/forums";
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
import ForumChip from "../../components/chips/ForumChip.vue";
import ConfirmDialog from "../../components/dialogs/ConfirmDialog.vue";
import LinkIcon from "../../components/icons/LinkIcon.vue";

const forumsStore = useForumsStore();
forumsStore.getForums();
const studentOfficersStore = useStudentOfficersStore();
studentOfficersStore.getStudentOfficers();

const deleteDialog = ref(null);
const addNewStudentOfficerDialog = ref(false);
const newPositionName = ref("");
const newSchoolName = ref("");
const newForumID = ref(null);

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
    title: "Forum",
    align: "start",
    sortable: true,
    key: "forum",
    value: (item) => {
      const forum = forumsStore.forums.find((forum) => forum.id === item.forum);
      return forum ? forum.abbreviation : "";
    },
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

  const forum = forumsStore.forums.find((forum) => forum.id === item.raw.forum);

  const searchFields = [
    ...Object.values(item.raw),
    forum?.name,
    forum?.abbreviation,
    forum?.subtitle,
  ];

  return searchFields.some((field) =>
    String(field).toLowerCase().includes(query.toLowerCase()),
  );
};

const createStudentOfficer = function () {
  if (
    newPositionName.value !== "" &&
    newSchoolName.value !== "" &&
    newForumID.value !== null
  ) {
    studentOfficersStore
      .createStudentOfficer(
        newPositionName.value,
        newSchoolName.value,
        newForumID.value,
      )
      .then(() => {
        addNewStudentOfficerDialog.value = false;
        newPositionName.value = "";
        newSchoolName.value = "";
        newForumID.value = null;
      });
  }
};

const deleteStudentOfficer = function (student_officer_id) {
  deleteDialog.value = student_officer_id;
};

const confirmedDeleteStudentOfficer = function () {
  studentOfficersStore.deleteStudentOfficer(deleteDialog.value);
  deleteDialog.value = false;
};
</script>

<template>
  <div class="">
    <v-row>
      <v-col cols="9">
        <v-breadcrumbs :items="[{ title: 'Student Officers' }]">
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
      <v-col cols="3" style="display: flex">
        <v-fab
          color="primary"
          rounded
          style="justify-content: end"
          prepend-icon="mdi-plus"
          text="add new Student Officer"
          @click="addNewStudentOfficerDialog = true"
        ></v-fab>
      </v-col>
    </v-row>

    <v-data-table-virtual
      v-if="studentOfficersStore.student_officers"
      :headers="headers"
      :items="studentOfficersStore.student_officers"
      item-key="id"
      items-per-page="-1"
      items-per-page-text="Student Officers per page"
      hover
      :loading="studentOfficersStore.loading ? 'primary' : false"
      fixed-header
      :search="search"
      :sort-by="[
        { key: 'forum', order: 'asc' },
        { key: 'name', order: 'asc' },
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
            <v-chip
              v-if="item.position_name.length > 30"
              v-tooltip:bottom="item.position_name"
            >
              {{ item.position_name.slice(0, 30) }} ...
            </v-chip>
            <v-chip v-else>
              {{ item.position_name }}
            </v-chip>
          </td>

          <td>
            <v-chip
              v-if="item.school_name.length > 40"
              v-tooltip:bottom="item.school_name"
              variant="text"
              >{{ item.school_name.slice(0, 40) }} ...</v-chip
            >
            <v-chip v-else variant="text">{{ item.school_name }}</v-chip>
          </td>

          <td>
            <ForumChip
              :forum="
                forumsStore.forums.find((forum) => forum.id === item.forum)
              "
            ></ForumChip>
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
                  name: 'student-officer-registration',
                  params: { student_officer_id: item.id },
                }).path
              }`"
            ></LinkIcon>
            <v-btn
              variant="plain"
              icon="mdi-pencil"
              :to="{
                name: 'student-officer-detail',
                params: { student_officer_id: item.id },
              }"
            >
            </v-btn>
            <v-btn
              variant="plain"
              icon="mdi-delete"
              @click.stop="deleteStudentOfficer(item.id)"
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
      text="Are you sure you want to delete this Student Officer?"
      @ok-clicked="
        confirmedDeleteStudentOfficer(
          studentOfficersStore.student_officers.filter(
            (student_officer) => student_officer.id == deleteDialog.value,
          ).id,
        )
      "
      @cancel-clicked="deleteDialog.value = false"
    ></ConfirmDialog>

    <v-dialog max-width="500" v-model="addNewStudentOfficerDialog">
      <template v-slot:default="{ isActive }">
        <v-form v-model="valid">
          <v-card title="Add new Student Officer">
            <v-card-text>
              <v-text-field
                v-model="newPositionName"
                label="Position"
                hint="Full position name, e.g. 'Vice-Chairman of the First Committee', 'Chairwoman of the Human Rights Council' or 'President of the General Assembly'"
                :rules="[
                  (v) => !!v || 'Position is required',
                  (v) => (v && v.length <= 100) || '100 characters maximum',
                ]"
                outlined
                required
              ></v-text-field>
              <v-text-field
                v-model="newSchoolName"
                label="School name"
                hint="Name of the school the student officer attends."
                :rules="[
                  (v) => !!v || 'School name is required',
                  (v) => (v && v.length <= 50) || '50 characters maximum',
                ]"
                outlined
                required
              ></v-text-field>
              <v-select
                v-model="newForumID"
                :items="forumsStore.forums"
                :item-title="(forum) => forum.name"
                :item-value="(forum) => forum.id"
                :rules="[(v) => !!v || 'Forum is required']"
                label="Select Forum"
                hint="Select which forum this Student Officer is chairing"
                outlined
                required
              ></v-select>
            </v-card-text>

            <v-card-actions>
              <v-spacer></v-spacer>

              <v-btn text="Cancel" @click="isActive.value = false"></v-btn>
              <v-btn
                text="Create"
                :disabled="!valid"
                @click="createStudentOfficer"
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
