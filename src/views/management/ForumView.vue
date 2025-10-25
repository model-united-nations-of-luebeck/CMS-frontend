<script setup>
import { watch } from "vue";
import { useForumsStore } from "../../stores/forums";
import { useStudentOfficersStore } from "../../stores/student_officers";
import { useMemberOrganizationsStore } from "../../stores/member_organizations";
import { useDelegatesStore } from "../../stores/delegates";
import { useSchoolsStore } from "../../stores/schools";
import { useRoute } from "vue-router";
import MemberOrganizationChip from "../../components/chips/MemberOrganizationChip.vue";
import SchoolChip from "../../components/chips/SchoolChip.vue";

const route = useRoute();
const forumsStore = useForumsStore();

const fetchForum = () => {
  if (route.params.forum_id != "add") {
    if (route.params.forum_id) {
      forumsStore.getForum(route.params.forum_id);
    }
  } else {
    forumsStore.initializeForum();
  }
};

fetchForum();

watch(
  () => route.params.forum_id,
  () => {
    fetchForum();
  },
);

const studentOfficersStore = useStudentOfficersStore();
studentOfficersStore.getStudentOfficers();
const memberOrganizationsStore = useMemberOrganizationsStore();
memberOrganizationsStore.getMemberOrganizations();
const delegatesStore = useDelegatesStore();
delegatesStore.getDelegates();
const schoolsStore = useSchoolsStore();
schoolsStore.getSchools();
</script>

<template>
  <div class="">
    <v-breadcrumbs
      :items="[
        { title: 'Forums', to: { name: 'forums' } },
        { title: forumsStore.forum?.abbreviation },
      ]"
    >
      <template v-slot:prepend>
        <v-icon icon="mdi-forum" size="small" start></v-icon>
      </template>

      <v-spacer></v-spacer>
      <v-btn
        prepend-icon="mdi-pencil"
        variant="tonal"
        :to="{
          name: 'forum-detail',
          params: { forum_id: forumsStore.forum.id },
        }"
      >
        Edit Forum
      </v-btn>
    </v-breadcrumbs>

    <v-card
      v-if="
        forumsStore.forum.id &&
        studentOfficersStore.student_officers &&
        memberOrganizationsStore.member_organizations &&
        delegatesStore.delegates
      "
    >
      <v-card-title>
        {{ forumsStore.forum.name }} ({{ forumsStore.forum.abbreviation }})
      </v-card-title>
      <v-card-subtitle v-if="forumsStore.forum.subtitle">
        <i>{{ forumsStore.forum.subtitle }}</i>
      </v-card-subtitle>
      <v-card-text>
        <h2><v-icon start>mdi-account-settings</v-icon>Student Officers</h2>
        <v-table>
          <thead>
            <tr>
              <th>Position</th>
              <th>Name</th>
              <th>Email</th>
              <th>Mobile Phone</th>
              <th>School</th>
              <th>Details</th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="officer in studentOfficersStore.student_officers.filter(
                (o) => o.forum == forumsStore.forum.id,
              )"
              :key="officer.id"
            >
              <td>{{ officer.position_name }}</td>
              <td>{{ officer.first_name }} {{ officer.last_name }}</td>
              <td>{{ officer.email }}</td>
              <td>{{ officer.mobile }}</td>
              <td>{{ officer.school_name }}</td>
              <td>
                <v-btn
                  :to="{
                    name: 'student-officer-detail',
                    params: { student_officer_id: officer.id },
                  }"
                  variant="plain"
                  icon="mdi-eye"
                >
                </v-btn>
              </td>
            </tr>
          </tbody>
        </v-table>

        <h2><v-icon start>mdi-account-tie</v-icon>Delegates</h2>

        <v-table>
          <thead>
            <tr>
              <th>Member Organization</th>
              <th>Name</th>
              <th>School</th>
              <th>Email</th>
              <th>Mobile Phone</th>
              <th>Details</th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="delegate in delegatesStore.delegates
                .filter((d) => d.forum == forumsStore.forum.id)
                .sort((a, b) => {
                  const orgA =
                    memberOrganizationsStore.member_organizations.find(
                      (org) => org.id === a.represents,
                    )?.name;
                  const orgB =
                    memberOrganizationsStore.member_organizations.find(
                      (org) => org.id === b.represents,
                    )?.name;
                  return orgA.localeCompare(orgB);
                })"
              :key="delegate.id"
            >
              <td>
                <MemberOrganizationChip
                  :org="
                    memberOrganizationsStore.member_organizations.find(
                      (org) => org.id === delegate.represents,
                    )
                  "
                />
              </td>
              <td>{{ delegate.first_name }} {{ delegate.last_name }}</td>
              <td>
                <SchoolChip
                  :school="
                    schoolsStore.schools.find((s) => s.id === delegate.school)
                  "
                />
              </td>
              <td>{{ delegate.email }}</td>
              <td>{{ delegate.mobile }}</td>
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
.fab-bottom-right {
  position: fixed;
  top: 75px;
  right: 25px;
}
#search {
  width: 300px;
}
</style>
