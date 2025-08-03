<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
const router = useRouter();
const origin = window.location.origin;
import { useDelegatesStore } from "../../stores/delegates";
import { useSchoolsStore } from "../../stores/schools";
import { useForumsStore } from "../../stores/forums";
import { useMemberOrganizationsStore } from "../../stores/member_organizations";
import {
  sortParticipantsByName,
  sortParticipantsByAge,
} from "../../stores/participants";
import ConsentDisplay from "../../components/displays/ConsentDisplay.vue";
import BadgePhotoDisplay from "../../components/displays/BadgePhotoDisplay.vue";
import FirstTimerIcon from "../../components/icons/FirstTimerIcon.vue";
import MediaConsentIcon from "../../components/icons/MediaConsentIcon.vue";
import ExtraInformationIcon from "../../components/icons/ExtraInformationIcon.vue";
import AmbassadorIcon from "../../components/icons/AmbassadorIcon.vue";
import BirthdayChip from "../../components/chips/BirthdayChip.vue";
import MobilePhoneIcon from "../../components/icons/MobilePhoneIcon.vue";
import MailIcon from "../../components/icons/MailIcon.vue";
import SchoolChip from "../../components/chips/SchoolChip.vue";
import ForumChip from "../../components/chips/ForumChip.vue";
import MemberOrganizationChip from "../../components/chips/MemberOrganizationChip.vue";
import ParticipantDisplay from "../../components/displays/ParticipantDisplay.vue";
import LinkIcon from "../../components/icons/LinkIcon.vue";

const schoolsStore = useSchoolsStore();
schoolsStore.getSchools();
const forumsStore = useForumsStore();
forumsStore.getForums();
const memberOrganizationsStore = useMemberOrganizationsStore();
memberOrganizationsStore.getMemberOrganizations();
const delegatesStore = useDelegatesStore();
delegatesStore.getDelegates();

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
    title: "Member Organization",
    align: "start",
    sortable: true,
    key: "member_organization",
    sortRaw(a, b) {
      if (a && b && a.represents && b.represents) {
        const org_a = memberOrganizationsStore.member_organizations.find(
          (org) => org.id === a.represents,
        );
        const org_b = memberOrganizationsStore.member_organizations.find(
          (org) => org.id === b.represents,
        );
        return org_a.placard_name < org_b.placard_name;
      }
      return 0;
    },
  },
  {
    title: "Forum",
    align: "start",
    sortable: true,
    key: "forum",
    sortRaw(a, b) {
      if (a && b && a.forum && b.forum) {
        const forum_a = forumsStore.forums.find(
          (forum) => forum.id === a.forum,
        );
        const forum_b = forumsStore.forums.find(
          (forum) => forum.id === b.forum,
        );
        return forum_a.abbreviation < forum_b.abbreviation;
      }
      return 0;
    },
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
  const memberOrganization = memberOrganizationsStore.member_organizations.find(
    (org) => org.id === item.raw.represents,
  );
  const forum = forumsStore.forums.find((forum) => forum.id === item.raw.forum);

  const searchFields = [
    ...Object.values(item.raw),
    school?.name,
    memberOrganization?.official_name,
    memberOrganization?.placard_name,
    memberOrganization?.name,
    memberOrganization?.status,
    forum?.name,
    forum?.abbreviation,
    forum?.subtitle,
  ];

  return searchFields.some((field) =>
    String(field).toLowerCase().includes(query.toLowerCase()),
  );
};
</script>

<template>
  <div class="">
    <v-row>
      <v-col cols="11">
        <v-breadcrumbs :items="[{ title: 'Delegates' }]">
          <template v-slot:prepend>
            <v-icon icon="mdi-account-tie" size="small" start disabled></v-icon>
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
      v-if="delegatesStore.delegates"
      :headers="headers"
      :items="delegatesStore.delegates"
      item-key="id"
      items-per-page="-1"
      items-per-page-text="Delegates per page"
      hover
      :loading="delegatesStore.loading ? 'primary' : false"
      fixed-header
      :search="search"
      :sort-by="[
        { key: 'member_organization', order: 'desc' },
        { key: 'forum', order: 'desc' },
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
            <MemberOrganizationChip
              :org="
                memberOrganizationsStore.member_organizations.find(
                  (org) => org.id === item.represents,
                )
              "
            ></MemberOrganizationChip>
          </td>

          <td>
            <ForumChip
              :forum="
                forumsStore.forums.find((forum) => forum.id === item.forum)
              "
            ></ForumChip>
          </td>

          <td>
            <SchoolChip
              :school="
                schoolsStore.schools.find((school) => school.id === item.school)
              "
            ></SchoolChip>
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

          <td>
            <AmbassadorIcon :ambassador="item.ambassador"></AmbassadorIcon>

            <FirstTimerIcon :first_timer="item.first_timer"></FirstTimerIcon>
            <MediaConsentIcon
              :media_consent_time="item.media_consent_time"
            ></MediaConsentIcon>

            <ExtraInformationIcon :extras="item.extras"></ExtraInformationIcon>
          </td>

          <td class="center">
            <LinkIcon
              :link="`${origin}${
                router.resolve({
                  name: 'final-registration-delegate',
                  params: { delegate_id: item.id },
                }).path
              }`"
            ></LinkIcon>
            <v-btn
              variant="plain"
              icon="mdi-pencil"
              :to="{
                name: 'delegate-detail',
                params: { delegate_id: item.id },
              }"
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
