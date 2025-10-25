<script setup>
import { watch } from "vue";
import { useMemberOrganizationsStore } from "../../stores/member_organizations";
import { useForumsStore } from "../../stores/forums";
import { useDelegatesStore } from "../../stores/delegates";
import { useSchoolsStore } from "../../stores/schools";
import { useRoute } from "vue-router";
import ForumChip from "../../components/chips/ForumChip.vue";
import SchoolChip from "../../components/chips/SchoolChip.vue";

const route = useRoute();
const memberOrganizationsStore = useMemberOrganizationsStore();

const fetchMemberOrganization = () => {
  if (route.params.member_organization_id != "add") {
    if (route.params.member_organization_id) {
      memberOrganizationsStore.getMemberOrganization(
        route.params.member_organization_id,
      );
    }
  } else {
    memberOrganizationsStore.initializeMemberOrganization();
  }
};

fetchMemberOrganization();

watch(
  () => route.params.member_organization_id,
  () => {
    fetchMemberOrganization();
  },
);

const forumsStore = useForumsStore();
forumsStore.getForums();
const delegatesStore = useDelegatesStore();
delegatesStore.getDelegates();
const schoolsStore = useSchoolsStore();
schoolsStore.getSchools();
</script>

<template>
  <div class="">
    <v-breadcrumbs
      :items="[
        { title: 'Member Organizations', to: { name: 'member-organizations' } },
        { title: memberOrganizationsStore.member_organization.name },
      ]"
    >
      <template v-slot:prepend>
        <v-icon icon="mdi-flag-variant" size="small" start></v-icon>
      </template>

      <v-spacer></v-spacer>
      <v-btn
        prepend-icon="mdi-pencil"
        variant="tonal"
        :to="{
          name: 'member-organization-detail',
          params: {
            member_organization_id:
              memberOrganizationsStore.member_organization.id,
          },
        }"
      >
        Edit Member Organization
      </v-btn>
    </v-breadcrumbs>

    <v-card
      v-if="
        memberOrganizationsStore.member_organization &&
        forumsStore.forums &&
        delegatesStore.delegates &&
        schoolsStore.schools
      "
    >
      <v-card-title>
        {{ memberOrganizationsStore.member_organization.name }}
      </v-card-title>
      <v-card-subtitle>
        {{ memberOrganizationsStore.member_organization.official_name }}
      </v-card-subtitle>
      <v-card-text>
        <h2><v-icon start>mdi-account-tie</v-icon>Delegates</h2>
        <v-table>
          <thead>
            <tr>
              <th>Role</th>
              <th>Name</th>
              <th>Email</th>
              <th>Mobile Phone</th>
              <th>School</th>
              <th>Forum</th>
              <th>Details</th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="delegate in delegatesStore.delegates
                .filter(
                  (d) =>
                    d.represents ===
                    memberOrganizationsStore.member_organization.id,
                )
                .sort((a, b) => a.forum.localeCompare(b.forum))"
              :key="delegate.id"
            >
              <td>
                <v-icon
                  v-tooltip:right-center="
                    delegate.ambassador ? 'Ambassador' : 'Delegate'
                  "
                  :color="delegate.ambassador ? 'primary' : 'auto'"
                  >{{
                    delegate.ambassador ? "mdi-account-star" : "mdi-account"
                  }}</v-icon
                >
              </td>
              <td>{{ delegate.first_name }} {{ delegate.last_name }}</td>
              <td>{{ delegate.email }}</td>
              <td>{{ delegate.mobile }}</td>
              <td>
                <SchoolChip
                  :school="
                    schoolsStore.schools.find((s) => s.id === delegate.school)
                  "
                />
              </td>
              <td>
                <ForumChip
                  :forum="
                    forumsStore.forums.find((f) => f.id === delegate.forum)
                  "
                />
              </td>
              <td>
                <v-btn
                  :to="{
                    name: 'delegate-detail',
                    params: { delegate_id: delegate.id },
                  }"
                  variant="plain"
                  icon="mdi-eye"
                >
                </v-btn>
              </td>
            </tr>
          </tbody>
        </v-table>
      </v-card-text>
    </v-card>
  </div>
</template>

<style>
.grayscale {
  filter: gray; /* IE6-9 */
  -webkit-filter: grayscale(1); /* Google Chrome, Safari 6+ & Opera 15+ */
  filter: grayscale(1); /* Microsoft Edge and Firefox 35+ */
}
</style>
