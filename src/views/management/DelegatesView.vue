<script setup>
import { ref } from "vue";
import { useDelegatesStore } from "../../stores/delegates";
import { useSchoolsStore } from "../../stores/schools";
import { useForumsStore } from "../../stores/forums";
import { useMemberOrganizationsStore } from "../../stores/member_organizations";
import { getAge, getAgeColor } from "../../stores/participants";

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
    sortRaw(a, b) {
      if (a && b && a.first_name && b.first_name) {
        return a.first_name < b.first_name;
      }
      return 0;
    },
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
    align: "start",
    sortable: true,
    key: "age",
    sortRaw(a, b) {
      if (a && b && a.birthday && b.birthday) {
        const age_a = getAge(a.birthday);
        const age_b = getAge(b.birthday);
        return age_a - age_b;
      }
      return 0;
    },
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
      :headers="headers"
      :items="delegatesStore.delegates"
      item-key="id"
      items-per-page="-1"
      items-per-page-text="Delegates per page"
      hover
      :loading="delegatesStore.loading ? 'primary' : false"
      sticky
      :search="search"
      :sort-by="[{ key: 'name', order: 'desc' }]"
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
            <b
              v-if="item.pronouns"
              v-tooltip:bottom="`${item.gender} (${item.pronouns})`"
              >{{ item.first_name }} {{ item.last_name }}</b
            >
            <b v-else v-tooltip:bottom="`${item.gender}`"
              >{{ item.first_name }} {{ item.last_name }}</b
            >
          </td>

          <td>
            <v-chip
              v-tooltip:bottom="
                memberOrganizationsStore.member_organizations.find(
                  (org) => org.id === item.represents,
                )?.official_name
              "
              :to="{
                name: 'member-organization-detail',
                params: { member_organization_id: item.represents },
              }"
            >
              <template v-slot:prepend>
                <v-avatar
                  start
                  v-if="
                    memberOrganizationsStore.member_organizations.find(
                      (org) => org.id === item.represents,
                    )?.flag
                  "
                  :image="
                    memberOrganizationsStore.member_organizations.find(
                      (org) => org.id === item.represents,
                    )?.flag
                  "
                ></v-avatar>
              </template>
              {{
                memberOrganizationsStore.member_organizations.find(
                  (org) => org.id === item.represents,
                )?.placard_name
              }}
            </v-chip>
          </td>

          <td>
            <v-chip
              v-tooltip:bottom="
                forumsStore.forums.find((forum) => forum.id === item.forum)
                  ?.name
              "
              :to="{
                name: 'forum-detail',
                params: { forum_id: item.forum },
              }"
            >
              {{
                forumsStore.forums.find((forum) => forum.id === item.forum)
                  ?.abbreviation
              }}
            </v-chip>
          </td>

          <td>
            <v-chip
              variant="text"
              :to="{
                name: 'school-detail',
                params: { school_id: item.school },
              }"
            >
              {{
                schoolsStore.schools.find((school) => school.id === item.school)
                  ?.name
              }}
            </v-chip>
          </td>

          <td>
            <v-icon
              v-if="item.email"
              v-tooltip:bottom-center="
                `${item.email}  (Click to copy e-mail to your clipboard)`
              "
              v-clipboard:copy="item.email"
              v-clipboard:success="
                () => {
                  toast.success('E-mail was copied successfully', {
                    position: toast.POSITION.BOTTOM_CENTER,
                    style: 'width: auto',
                  });
                }
              "
              v-clipboard:error="
                (e) =>
                  toast.error('Copying E-mail failed' + e.text, {
                    position: toast.POSITION.BOTTOM_CENTER,
                  })
              "
              :color="item.email_verified ? 'success' : 'error'"
              >{{
                item.email_verified ? "mdi-email-check" : "mdi-email"
              }}</v-icon
            >
          </td>
          <td>
            <v-icon
              v-if="item.mobile"
              v-tooltip:bottom-center="
                `${item.mobile}  (Click to copy mobile phone number to your clipboard)`
              "
              v-clipboard:copy="item.mobile"
              v-clipboard:success="
                () => {
                  toast.success('Mobile phone number was copied successfully', {
                    position: toast.POSITION.BOTTOM_CENTER,
                    style: 'width: auto',
                  });
                }
              "
              v-clipboard:error="
                (e) =>
                  toast.error('Copying mobile phone number failed' + e.text, {
                    position: toast.POSITION.BOTTOM_CENTER,
                  })
              "
            >
              mdi-phone
            </v-icon>
          </td>

          <td>
            <v-chip
              v-if="item.birthday"
              variant="tonal"
              :color="getAgeColor(item.birthday)"
            >
              {{ getAge(item.birthday) }}
            </v-chip>
          </td>

          <td>
            <v-icon
              :class="{ hidden: !item.ambassador }"
              color="#ebbe4d"
              icon="mdi-shield-star-outline"
              v-tooltip:bottom="'Ambassador of delegation'"
            ></v-icon>

            <v-icon
              :class="{ hidden: !item.first_timer }"
              color="primary"
              icon="mdi-account-question"
              v-tooltip:bottom="'First timer'"
            ></v-icon>

            <v-icon
              v-if="item.media_consent_time"
              icon="mdi-camera"
              color="success"
              v-tooltip:bottom="'Media consent given'"
            ></v-icon>
            <v-icon
              v-else
              icon="mdi-camera-off"
              color="error"
              v-tooltip:bottom="'Media consent not given'"
            ></v-icon>

            <v-icon
              :class="{ hidden: !item.extras }"
              color="primary"
              icon="mdi-information-variant"
              v-tooltip:bottom="`${item.extras}`"
            ></v-icon>
          </td>

          <td>
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
                <div v-if="item.picture">
                  <v-img :src="item.picture" height="250px">
                    <template v-slot:placeholder>
                      <div
                        class="d-flex align-center justify-center fill-height"
                      >
                        <v-progress-circular
                          color="grey-lighten-4"
                          indeterminate
                        ></v-progress-circular>
                      </div>
                    </template>
                  </v-img>
                </div>
                <div v-else>No badge photo uploaded yet.</div>
              </div>
              <div style="flex: 2; padding: 16px">
                <h2>Consent Information</h2>

                <h3>Data consent</h3>
                <div v-if="item.data_consent_time">
                  <p>
                    <b>Time:</b>
                    {{ new Date(item.data_consent_time).toLocaleString() }}
                  </p>
                  <p><b>IP-Address:</b> {{ item.data_consent_ip }}</p>
                </div>
                <div v-else>
                  <p>Data consent not given yet</p>
                </div>
                <br />
                <h3>Media consent</h3>
                <div v-if="item.media_consent_time">
                  <p>
                    <b>Time:</b>
                    {{ new Date(item.media_consent_time).toLocaleString() }}
                  </p>
                  <p><b>IP-Address:</b> {{ item.media_consent_ip }}</p>
                </div>
                <div v-else>
                  <p>Media consent not given</p>
                </div>
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
</style>

<!-- TODO:
 - add selectable rows to export selected data as JSON, CSV, or EXCEL
-->
