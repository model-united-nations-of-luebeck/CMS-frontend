<script setup>
import { ref } from "vue";
import { useMUNDirectorsStore } from "../../stores/mun_directors";
import { useSchoolsStore } from "../../stores/schools";
import { sortParticipantsByName } from "../../stores/participants";
import ConsentDisplay from "../../components/displays/ConsentDisplay.vue";
import BadgePhotoDisplay from "../../components/displays/BadgePhotoDisplay.vue";
import MediaConsentIcon from "../../components/icons/MediaConsentIcon.vue";
import ExtraInformationIcon from "../../components/icons/ExtraInformationIcon.vue";
import MobilePhoneIcon from "../../components/icons/MobilePhoneIcon.vue";
import MailIcon from "../../components/icons/MailIcon.vue";
import EnglishTeacherIcon from "../../components/icons/EnglishTeacherIcon.vue";
import SchoolChip from "../../components/chips/SchoolChip.vue";
import ParticipantDisplay from "../../components/displays/ParticipantDisplay.vue";
import ConfirmDialog from "../../components/dialogs/ConfirmDialog.vue";

const schoolsStore = useSchoolsStore();
schoolsStore.getSchools();
const munDirectorsStore = useMUNDirectorsStore();
munDirectorsStore.getMUNDirectors();

const deleteDialog = ref(null);
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
    title: "School",
    align: "start",
    sortable: true,
    key: "school",
    sortRaw(a, b) {
      if (a && b && a.school && b.school) {
        const school_a = schoolsStore.schools.find(
          (school) => school.id === a.school,
        );
        const school_b = schoolsStore.schools.find(
          (school) => school.id === b.school,
        );
        return school_a.name < school_b.name;
      }
      return 0;
    },
  },
  {
    title: "English Teacher",
    align: "center",
    key: "english_teacher",
    sortable: true,
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

  const school = schoolsStore.schools.find(
    (school) => school.id === item.raw.school,
  );

  const searchFields = [
    ...Object.values(item.raw),
    school?.name,
    school?.city,
    school?.country,
  ];

  return searchFields.some((field) =>
    String(field).toLowerCase().includes(query.toLowerCase()),
  );
};

const deleteMUNDirector = function (mun_director_id) {
  this.deleteDialog = mun_director_id;
};

const confirmedDeleteMUNDirector = function () {
  munDirectorsStore.deleteMUNDirector(this.deleteDialog);
  this.deleteDialog = false;
};
</script>

<template>
  <div class="">
    <v-row>
      <v-col cols="11">
        <v-breadcrumbs :items="[{ title: 'MUN-Directors' }]">
          <template v-slot:prepend>
            <v-icon icon="mdi-school" size="small" start disabled></v-icon>
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
      <v-col cols="1" style="display: flex"> </v-col>
    </v-row>

    <v-data-table-virtual
      :headers="headers"
      :items="munDirectorsStore.mun_directors"
      item-key="id"
      items-per-page="-1"
      items-per-page-text="MUN-Directors per page"
      hover
      :loading="munDirectorsStore.loading ? 'primary' : false"
      sticky
      :search="search"
      :sort-by="[
        { key: 'school', order: 'desc' },
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
            <SchoolChip
              :school="
                schoolsStore.schools.find((school) => school.id === item.school)
              "
            ></SchoolChip>
          </td>
          <td>
            <EnglishTeacherIcon
              :english_teacher="item.english_teacher"
            ></EnglishTeacherIcon>
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
                name: 'mun-director-detail',
                params: { mun_director_id: item.id },
              }"
            >
            </v-btn>
            <v-btn
              variant="plain"
              icon="mdi-delete"
              @click.stop="deleteMUNDirector(item.id)"
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
      text="Are you sure you want to delete this MUN-Director?"
      @ok-clicked="
        confirmedDeleteMUNDirector(
          munDirectorsStore.mun_directors.filter(
            (mun_director) => mun_director.id == this.deleteDialog,
          ).id,
        )
      "
      @cancel-clicked="deleteDialog = false"
    />
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
