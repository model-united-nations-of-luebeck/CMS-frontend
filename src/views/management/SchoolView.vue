<script setup>
import { useSchoolsStore } from "../../stores/schools";
import { useMUNDirectorsStore } from "../../stores/mun_directors";
import { useDelegatesStore } from "../../stores/delegates";
import { useMemberOrganizationsStore } from "../../stores/member_organizations";
import { useForumsStore } from "../../stores/forums";
import { watch } from "vue";
import { useRoute } from "vue-router";
import MemberOrganizationChip from "../../components/chips/MemberOrganizationChip.vue";
import ForumChip from "../../components/chips/ForumChip.vue";

const route = useRoute();
const schoolsStore = useSchoolsStore();

const fetchSchool = () => {
  if (route.params.school_id) {
    schoolsStore.getSchool(route.params.school_id);
  }
};
fetchSchool();

watch(
  () => route.params.school_id,
  () => {
    fetchSchool();
  },
);

const munDirectorsStore = useMUNDirectorsStore();
munDirectorsStore.getMUNDirectors();
const delegatesStore = useDelegatesStore();
delegatesStore.getDelegates();
const memberOrganizationsStore = useMemberOrganizationsStore();
memberOrganizationsStore.getMemberOrganizations();
const forumsStore = useForumsStore();
forumsStore.getForums();
</script>

<template>
  <div class="">
    <v-breadcrumbs
      :items="[
        { title: 'Schools', to: { name: 'schools' } },
        { title: schoolsStore.school.name },
      ]"
    >
      <template v-slot:prepend>
        <v-icon icon="mdi-bank" size="small" start></v-icon>
      </template>
    </v-breadcrumbs>

    <v-card>
      <v-card-title>
        <h2>{{ schoolsStore.school.name }}</h2>
      </v-card-title>
      <v-card-text>
        <h3><v-icon start>mdi-school</v-icon>MUN-Directors</h3>

        <v-table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Mobile Phone</th>
              <th>English Teacher</th>
              <th>Details</th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="director in munDirectorsStore?.mun_directors.filter(
                (d) => d.school === schoolsStore.school.id,
              )"
              :key="director.id"
            >
              <td>{{ director.first_name }} {{ director.last_name }}</td>
              <td>{{ director.email }}</td>
              <td>{{ director.mobile }}</td>
              <td>
                {{ director.is_english_teacher ? "Yes" : "No" }}
              </td>
              <td>
                <v-btn
                  variant="plain"
                  icon="mdi-eye"
                  :to="{
                    name: 'mun-director-detail',
                    params: { mun_director_id: director.id },
                  }"
                >
                </v-btn>
              </td>
            </tr>
          </tbody>
        </v-table>

        <h3><v-icon start>mdi-account-tie</v-icon>Delegates</h3>

        <v-table>
          <thead>
            <tr>
              <th>Role</th>
              <th>Member Organization</th>
              <th>Forum</th>
              <th>Name</th>
              <th>Email</th>
              <th>Mobile Phone</th>
              <th>Details</th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="delegate in delegatesStore?.delegates.filter(
                (d) => d.school === schoolsStore.school.id,
              )"
              :key="delegate.id"
            >
              <td class="text-center no-select">
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
              <td>
                <MemberOrganizationChip
                  :org="
                    memberOrganizationsStore.member_organizations.find(
                      (mo) => mo.id === delegate.represents,
                    )
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
              <td>{{ delegate.first_name }} {{ delegate.last_name }}</td>
              <td>{{ delegate.email }}</td>
              <td>{{ delegate.mobile }}</td>
              <td>
                <v-btn
                  variant="plain"
                  icon="mdi-eye"
                  :to="{
                    name: 'delegate-detail',
                    params: { delegate_id: delegate.id },
                  }"
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
