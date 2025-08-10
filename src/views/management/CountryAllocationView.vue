<script setup>
import { useForumsStore } from "../../stores/forums";
import { useMemberOrganizationsStore } from "../../stores/member_organizations";
import { useDelegatesStore } from "../../stores/delegates";
import { useSchoolsStore } from "../../stores/schools";
import { toast } from "vue3-toastify";
import "vue3-toastify/dist/index.css";
import AssignSchoolDialog from "../../components/dialogs/AssignSchoolDialog.vue";
import { ref } from "vue";

const forumsStore = useForumsStore();
forumsStore.getForums();
const memberOrganizationsStore = useMemberOrganizationsStore();
memberOrganizationsStore.getMemberOrganizations();
const delegatesStore = useDelegatesStore();
delegatesStore.getDelegates();
const schoolsStore = useSchoolsStore();
schoolsStore.getSchools();

const assignSchoolDialog = ref(false);
const candidateOrgId = ref(null);

const getDelegateInstances = (forum_id, org_id) => {
  return delegatesStore.delegates.find(
    (delegate) => delegate.forum == forum_id && delegate.represents == org_id,
  );
};

const getDelegatesCountPerForum = (forum_id) => {
  return delegatesStore.delegates.filter(
    (delegate) => delegate.forum == forum_id,
  ).length;
};

const getDelegatesCountPerMemberOrganization = (org_id) => {
  return delegatesStore.delegates.filter(
    (delegate) => delegate.represents == org_id,
  ).length;
};

const getSchoolsPerMemberOrganization = (org_id) => {
  return schoolsStore.schools.filter(
    (school) =>
      delegatesStore.delegates
        .filter((delegate) => delegate.represents == org_id)
        .map((delegate) => delegate.school)
        .indexOf(school.id) > -1,
  );
};

const toggleDelegate = (forum_id, org_id) => {
  // creates delegate if it doesn't exist, deletes it if it does
  const delegate = delegatesStore.delegates.find(
    (delegate) => delegate.forum == forum_id && delegate.represents == org_id,
  );
  if (delegate) {
    if (delegate.school) {
      toast.error(
        "You cannot delete a delegate that has an assigned school. Please unassign the school first.",
        {
          position: toast.POSITION.BOTTOM_CENTER,
          timeout: 5000,
        },
      );
    } else {
      delegatesStore.deleteDelegate(delegate.id);
    }
  } else {
    delegatesStore.createDelegate(forum_id, org_id);
  }
};

const createDelegatesInAllForums = (org_id) => {
  // creates a delegate for each forum if it doesn't already exist
  forumsStore.forums.forEach((forum) => {
    if (
      delegatesStore.delegates.find(
        (delegate) =>
          delegate.forum == forum.id && delegate.represents == org_id,
      ) == undefined
    ) {
      delegatesStore.createDelegate(forum.id, org_id);
    }
  });
};

const deleteDelegatesInAllForums = (org_id) => {
  // deletes all delegates of a member organization from each forum if it exists
  forumsStore.forums.forEach((forum) => {
    const delegate = delegatesStore.delegates.find(
      (delegate) => delegate.forum == forum.id && delegate.represents == org_id,
    );
    if (delegate) {
      delegatesStore.deleteDelegate(delegate.id);
    }
  });
};

const openAssignSchoolDialog = (org_id) => {
  // if there is at least one delegate from this organization, open the assign school dialog
  if (
    delegatesStore.delegates.some((delegate) => delegate.represents == org_id)
  ) {
    candidateOrgId.value = org_id;
    assignSchoolDialog.value = true;
  } else {
    toast.error(
      "There is no delegate from this organization (yet). Please create one first before assigning a school.",
      {
        position: toast.POSITION.BOTTOM_CENTER,
      },
    );
  }
};
</script>

<template>
  <div class="">
    <v-progress-linear
      v-if="
        forumsStore.loading ||
        memberOrganizationsStore.loading ||
        delegatesStore.loading ||
        schoolsStore.loading
      "
      indeterminate
      color="primary"
      height="4"
    ></v-progress-linear>

    <v-table
      v-if="
        forumsStore.forums &&
        memberOrganizationsStore.member_organizations &&
        delegatesStore.delegates &&
        schoolsStore.schools
      "
      density="comfortable"
      fixed-header
      height="90vh"
      hover
    >
      <thead>
        <tr>
          <th class="text-left">
            {{ delegatesStore.delegates.length }} Delegates from
            {{ schoolsStore.schools.length }} Schools representing <br />
            {{
              memberOrganizationsStore.member_organizations.filter(
                (org) => org.active,
              ).length
            }}
            Member Organizations in {{ forumsStore.forums.length }} Forums
          </th>
          <th class="text-center">TOGGLE ALL</th>
          <th
            v-for="forum in forumsStore.forums"
            :key="forum.id"
            class="text-center"
            v-tooltip:bottom="forum.name"
          >
            {{ forum.abbreviation }} <br />({{
              getDelegatesCountPerForum(forum.id)
            }})
          </th>

          <th class="text-center">Schools</th>
        </tr>
      </thead>
      <tbody>
        <tr
          v-for="org in memberOrganizationsStore.member_organizations
            .filter((org) => org.active)
            .sort((a, b) => a.name.localeCompare(b.name))"
          :key="org.id"
        >
          <td @click.right.prevent="openAssignSchoolDialog(org.id)">
            <span
              :style="{
                fontWeight:
                  getDelegatesCountPerMemberOrganization(org.id) > 0
                    ? 'bold'
                    : 'normal',
                color: delegatesStore.delegates.some(
                  (delegate) =>
                    delegate.represents == org.id && delegate.school == null,
                )
                  ? 'red'
                  : 'black',
              }"
            >
              {{ org.name }}
            </span>
            ({{ getDelegatesCountPerMemberOrganization(org.id) }})
          </td>

          <td class="text-center">
            <v-btn
              density="compact"
              icon
              variant="plain"
              color="primary"
              @click="createDelegatesInAllForums(org.id)"
            >
              <v-icon size="small">mdi-plus-circle-multiple</v-icon>
            </v-btn>
            |
            <v-btn
              density="compact"
              icon
              variant="plain"
              color="primary"
              @click="deleteDelegatesInAllForums(org.id)"
            >
              <v-icon size="small">mdi-minus-circle-multiple</v-icon>
            </v-btn>
          </td>

          <td
            v-for="forum in forumsStore.forums"
            :key="forum.id"
            class="text-center"
          >
            <template
              v-for="delegate in [getDelegateInstances(forum.id, org.id)]"
              :key="delegate?.id"
            >
              <v-btn
                density="compact"
                icon
                :variant="delegate?.school ? 'outlined' : 'tonal'"
                :color="delegate ? 'primary' : 'secondary'"
                @click.prevent="toggleDelegate(forum.id, org.id)"
                >{{ delegate ? 1 : 0 }}</v-btn
              >
            </template>
          </td>

          <td>
            <span
              v-for="school in getSchoolsPerMemberOrganization(org.id)"
              :key="school.id"
              class="school-names"
              >{{ school.name }}</span
            >
          </td>
        </tr>
      </tbody>
    </v-table>

    <AssignSchoolDialog
      v-model="assignSchoolDialog"
      :organization="candidateOrgId"
    ></AssignSchoolDialog>
  </div>
</template>

<style scoped>
.school-names {
  display: block;
}
</style>
