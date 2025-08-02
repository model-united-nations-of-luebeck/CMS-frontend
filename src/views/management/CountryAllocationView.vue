<script setup>
import { useForumsStore } from "../../stores/forums";
import { usePlenariesStore } from "../../stores/plenaries";
import { useMemberOrganizationsStore } from "../../stores/member_organizations";
import { useDelegatesStore } from "../../stores/delegates";
import { useSchoolsStore } from "../../stores/schools";
import { toast } from "vue3-toastify";
import "vue3-toastify/dist/index.css";
import AssignSchoolDialog from "../../components/dialogs/AssignSchoolDialog.vue";
import { ref } from "vue";

const forumsStore = useForumsStore();
forumsStore.getForums();
const plenariesStore = usePlenariesStore();
plenariesStore.getPlenaries();
const memberOrganizationsStore = useMemberOrganizationsStore();
memberOrganizationsStore.getMemberOrganizations();
const delegatesStore = useDelegatesStore();
delegatesStore.getDelegates();
const schoolsStore = useSchoolsStore();
schoolsStore.getSchools();

const assignSchoolDialog = ref(false);
const candidateDelegate = ref(null);

const getDelegates = (forum_id, org_id) => {
  return delegatesStore.delegates.filter(
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
    delegatesStore.deleteDelegate(delegate.id);
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

const openAssignSchoolDialog = (forum_id, org_id) => {
  if (forum_id === "all") {
    candidateDelegate.value = delegatesStore.delegates.filter(
      (delegate) => delegate.represents == org_id,
    );
  } else {
    candidateDelegate.value = delegatesStore.delegates.find(
      (delegate) => delegate.forum == forum_id && delegate.represents == org_id,
    );
  }

  if (candidateDelegate.value) {
    assignSchoolDialog.value = true;
  } else {
    toast.error(
      "This delegate does not exist (yet). Please create it first before assigning a school.",
      {
        position: toast.POSITION.BOTTOM_CENTER,
      },
    );
  }
};

const assignSchool = function (event, school_id) {
  if (candidateDelegate.value) {
    if (Array.isArray(candidateDelegate.value)) {
      candidateDelegate.value.forEach((delegate) => {
        delegatesStore.assignSchool(delegate.id, school_id);
      });
    } else {
      delegatesStore.assignSchool(candidateDelegate.value.id, school_id);
    }
  }
  assignSchoolDialog.value = false;
  candidateDelegate.value = null;
};

const unassignAllDelegates = function (org_id) {
  delegatesStore.delegates
    .filter((delegate) => delegate.represents == org_id)
    .forEach((delegate) => {
      delegatesStore.assignSchool(delegate.id, null);
    });
};

const getTooltip = (forum_id, org_id) => {
  const delegate = delegatesStore.delegates.find(
    (delegate) => delegate.forum == forum_id && delegate.represents == org_id,
  );
  if (delegate && delegate.school) {
    return `Assigned to ${
      schoolsStore.schools.find((school) => school.id == delegate.school).name
    }`;
  } else {
    return "Not assigned yet, right-click to assign a school";
  }
};
</script>

<template>
  <div class="">
    <v-table density="comfortable" fixed-header height="90vh" hover>
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
          <th class="text-center">TOGGLE ALL</th>
          <th class="text-center">Schools</th>
        </tr>
      </thead>
      <tbody>
        <tr
          v-for="org in memberOrganizationsStore.member_organizations.filter(
            (org) => org.active,
          )"
          :key="org.id"
        >
          <td>
            <b v-tooltip:end="org.official_name">{{ org.name }}</b> ({{
              getDelegatesCountPerMemberOrganization(org.id)
            }})
          </td>
          <td
            v-for="forum in forumsStore.forums"
            :key="forum.id"
            class="text-center"
          >
            <v-btn
              density="compact"
              icon
              :variant="
                getDelegates(forum.id, org.id)[0]?.school ? 'outlined' : 'tonal'
              "
              v-tooltip:bottom="getTooltip(forum.id, org.id)"
              :color="
                getDelegates(forum.id, org.id).length > 0
                  ? 'primary'
                  : 'secondary'
              "
              @click.prevent="toggleDelegate(forum.id, org.id)"
              @click.right.prevent="openAssignSchoolDialog(forum.id, org.id)"
              >{{ getDelegates(forum.id, org.id).length }}</v-btn
            >
          </td>
          <td class="text-center">
            <v-btn
              density="compact"
              variant="tonal"
              color="primary"
              v-tooltip="'Check all forums'"
              @click="createDelegatesInAllForums(org.id)"
              @click.right.prevent="openAssignSchoolDialog('all', org.id)"
            >
              <v-icon>mdi-checkbox-multiple-marked-outline</v-icon>
            </v-btn>
            /
            <v-btn
              density="compact"
              variant="tonal"
              color="primary"
              v-tooltip="'Uncheck all forums'"
              @click="deleteDelegatesInAllForums(org.id)"
              @click.right.prevent="unassignAllDelegates(org.id)"
            >
              <v-icon>mdi-checkbox-multiple-blank-outline</v-icon>
            </v-btn>
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
      :model="assignSchoolDialog"
      title="Assign School to Delegate(s)"
      text="Please select a school to assign to the selected delegate(s)"
      @ok-clicked="($event, school_id) => assignSchool($event, school_id)"
      @cancel-clicked="assignSchoolDialog = false"
    ></AssignSchoolDialog>
  </div>
</template>

<style scoped>
.school-names {
  display: block;
}
</style>
