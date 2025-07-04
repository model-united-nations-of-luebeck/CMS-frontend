<script setup>
import { useMemberOrganizationsStore } from "../../stores/member_organizations";
import { useRouter } from "vue-router";
import { ref } from "vue";
import { toast } from "vue3-toastify";
import "vue3-toastify/dist/index.css";
import ConfirmDialog from "../../components/dialogs/ConfirmDialog.vue";

const memberOrganizationsStore = useMemberOrganizationsStore();
memberOrganizationsStore.getMemberOrganizations();
const router = useRouter();

const deleteDialog = ref(null);
const search = ref("");

const headers = [
  { title: "Flag", key: "flag", sortable: false },
  { title: "Name", key: "name" },
  { title: "Official Name", key: "official_name" },
  { title: "Placard Name", key: "placard_name" },
  { title: "Status", key: "status" },
  { title: "Active", key: "active" },
  { title: "Actions", key: "actions" },
];

const toggleActive = function (member_organization_id) {
  console.log("toggleActive" + member_organization_id);
  memberOrganizationsStore.toggleActive(member_organization_id);
};

const deleteMemberOrganization = function (member_organization_id) {
  console.log("deleteMemberOrganization" + member_organization_id);
  this.deleteDialog = member_organization_id;
};

const confirmedDeleteMemberOrganization = function () {
  console.log("confirmedDeleteMemberOrganization" + this.deleteDialog);
  memberOrganizationsStore
    .deleteMemberOrganization(this.deleteDialog)
    .then(() => {
      this.deleteDialog = false;
      toast.success("Member Organization was deleted successfully", {
        position: toast.POSITION.BOTTOM_CENTER,
        style: "width: auto",
      });
    })
    .catch(() => {
      this.deleteDialog = false;
      toast.error("Deleting Member Organization failed", {
        position: toast.POSITION.BOTTOM_CENTER,
      });
    });
};
</script>

<template>
  <div class="">
    <v-breadcrumbs :items="[{ title: 'Member Organizations' }]">
      <template v-slot:prepend>
        <v-icon icon="mdi-flag-variant" size="small" start disabled></v-icon>
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
      <v-fab
        color="primary"
        rounded
        prepend-icon="mdi-plus"
        text="add member organization"
        @click="
          router.push({
            name: 'member-organization-detail',
            params: { member_organization_id: 'add' },
          })
        "
      ></v-fab>
    </v-breadcrumbs>

    <v-data-table-virtual
      :headers="headers"
      :items="memberOrganizationsStore.member_organizations"
      item-key="id"
      items-per-page="-1"
      items-per-page-text="Member organizations per page"
      hover
      :loading="memberOrganizationsStore.loading ? 'primary' : false"
      height="80vh"
      sticky
      :search="search"
    >
      <template v-slot:loading>
        <v-skeleton-loader type="table-row@10"></v-skeleton-loader>
      </template>
      <template v-slot:item="{ item }">
        <!--
          Work around for making rows clickable, but interferes with switch clicks
          <tr
          @click="
            router.push({
              name: 'member-organization-detail',
              params: { member_organization_id: item.id }
            })
          "
          style="cursor: pointer"
        > -->

        <tr>
          <td>
            <v-avatar
              v-if="item.flag"
              :class="{ grayscale: !item.active }"
              :image="item.flag"
            ></v-avatar>
            <!-- <v-skeleton-loader type="avatar"></v-skeleton-loader> -->
          </td>
          <td>
            <span v-if="item.name.length > 30" v-tooltip:bottom="item.name"
              >{{ item.name.slice(0, 30) }} ...</span
            >
            <span v-else>{{ item.name }}</span>
          </td>
          <td>
            <span
              v-if="item.official_name.length > 40"
              v-tooltip:bottom="item.official_name"
              >{{ item.official_name.slice(0, 40) }} ...</span
            >
            <span v-else>{{ item.official_name }}</span>
          </td>
          <td>
            <v-chip v-if="item.active">
              <v-icon start> mdi-tag </v-icon>
              {{ item.placard_name }}
            </v-chip>
          </td>
          <td>
            <v-chip>
              <v-icon start> mdi-shield-star-outline </v-icon>
              {{ item.status }}
            </v-chip>

            <!-- possible values, maybe color coding
        (MEMBER_STATE, 'member state'),
        (OBSERVER_STATE, 'observer state'),
        (FORMER_MEMBER, 'former member state'),
        (NON_GOVERNMENTAL_ORGANIZATION, 'non-governmental organization'),
        (INTER_GOVERNMENTAL_ORGANIZATION, 'inter-governmental organization'),
        (UN_SUB_BODY, 'UN sub-body'), -->
          </td>
          <td>
            <v-switch
              v-model="item.active"
              style="display: flex"
              color="primary"
              @update:modelValue="toggleActive(item.id)"
            ></v-switch>
          </td>
          <td>
            <v-btn
              variant="plain"
              icon="mdi-pencil"
              :to="{
                name: 'member-organization-detail',
                params: { member_organization_id: item.id },
              }"
            >
            </v-btn>
            <v-btn
              variant="plain"
              icon="mdi-delete"
              @click.stop="deleteMemberOrganization(item.id)"
            >
            </v-btn>
          </td>
        </tr>
      </template>
    </v-data-table-virtual>

    <ConfirmDialog
      :model="deleteDialog"
      title="Confirm Delete"
      text="Are you sure you want to delete this member organization?"
      @ok-clicked="
        confirmedDeleteMemberOrganization(
          memberOrganizationsStore.member_organizations.filter(
            (org) => org.id == this.deleteDialog,
          ).id,
        )
      "
      @cancel-clicked="deleteDialog = false"
    ></ConfirmDialog>
  </div>
</template>

<style>
.grayscale {
  filter: gray; /* IE6-9 */
  -webkit-filter: grayscale(1); /* Google Chrome, Safari 6+ & Opera 15+ */
  filter: grayscale(1); /* Microsoft Edge and Firefox 35+ */
}

.fab-bottom-right {
  position: fixed;
  top: 75px;
  right: 25px;
}
#search {
  width: 300px;
}
</style>
