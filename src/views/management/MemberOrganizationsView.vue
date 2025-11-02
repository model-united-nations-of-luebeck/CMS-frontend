<script setup>
import { useMemberOrganizationsStore } from "../../stores/member_organizations";
import { useRouter } from "vue-router";
import { ref, watch } from "vue";
import { toast } from "vue3-toastify";
import "vue3-toastify/dist/index.css";
import ConfirmDialog from "../../components/dialogs/ConfirmDialog.vue";
import { useDelegatesStore } from "../../stores/delegates";
import Fuse from "fuse.js";
import DownloadJSONIcon from "../../components/icons/DownloadJSONIcon.vue";
import DownloadExcelIcon from "../../components/icons/DownloadExcelIcon.vue";

const memberOrganizationsStore = useMemberOrganizationsStore();
memberOrganizationsStore.getMemberOrganizations();
const delegatesStore = useDelegatesStore();
delegatesStore.getDelegates();
const router = useRouter();

const deleteDialog = ref(null);
const search = ref("");
const selected = ref([]);

const headers = [
  { title: "", key: "data-table-select", sortable: false },
  { title: "Flag", key: "flag", sortable: false },
  { title: "Name", key: "name" },
  { title: "Official Name", key: "official_name" },
  { title: "Placard Name", key: "placard_name" },
  { title: "Status", key: "status" },
  { title: "Active", key: "active" },
  { title: "Actions", key: "actions" },
];

const toggleActive = function (member_organization_id) {
  memberOrganizationsStore.toggleActive(member_organization_id);
};

const deleteMemberOrganization = function (member_organization_id) {
  deleteDialog.value = member_organization_id;
};

const confirmedDeleteMemberOrganization = function () {
  memberOrganizationsStore
    .deleteMemberOrganization(deleteDialog.value)
    .then(() => {
      deleteDialog.value = false;
      toast.success("Member Organization was deleted successfully", {
        position: toast.POSITION.BOTTOM_CENTER,
        style: "width: auto",
      });
    })
    .catch(() => {
      deleteDialog.value = false;
      toast.error("Deleting Member Organization failed. Please ask admin for help.", {
        position: toast.POSITION.BOTTOM_CENTER,
      });
    });
};

let fuse = null;
watch(
  () => memberOrganizationsStore.member_organizations,
  (newMemberOrganizations) => {
    fuse = new Fuse(newMemberOrganizations, {
      keys: ["name", "official_name", "placard_name", "status", "active"],
      threshold: 0.3,
      useExtendedSearch: true,
    });
  },
  { immediate: true },
);

const customFilter = (value, query, item) => {
  if (!query || !fuse) return true;

  if (query.toLowerCase() === "active") query = "=true";
  else if (query.toLowerCase() === "inactive") query = "=false";

  // Cache results for current query
  if (!customFilter.cache || customFilter.cache.query !== query) {
    const results = fuse.search(query);
    customFilter.cache = {
      query,
      // Map from id (or key) → score
      map: new Map(results.map((r) => [r.item.id ?? r.item.key, r.score ?? 0])),
    };
  }

  const key = item?.id ?? item?.key;
  const score = customFilter.cache.map.get(key);
  if (score === undefined) return false;

  return score;
};
customFilter.cache = { query: "", map: new Map() };
</script>

<template>
  <div class="">
    <v-breadcrumbs :items="[{ title: 'Member Organizations' }]">
      <template v-slot:prepend>
        <v-icon icon="mdi-flag-variant" size="small" start disabled></v-icon>
      </template>

      <DownloadExcelIcon :items="selected" name="organizations.xls"></DownloadExcelIcon>
      <DownloadJSONIcon :items="selected" name="organizations.json"></DownloadJSONIcon>

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
      v-model="selected"
      v-if="memberOrganizationsStore.member_organizations"
      :headers="headers"
      :items="memberOrganizationsStore.member_organizations"
      item-key="id"
      items-per-page="-1"
      items-per-page-text="Member organizations per page"
      hover
      :loading="memberOrganizationsStore.loading ? 'primary' : false"
      height="calc(100vh - 160px)"
      fixed-header
      :search="search"
      :custom-filter="customFilter"
      item-height="56"
      :sort-by="[{ key: 'name', order: 'asc' }]"
      show-select
      return-object
    >
      <template v-slot:loading>
        <v-skeleton-loader type="table-row@20"></v-skeleton-loader>
      </template>
      <template v-slot:header[`data-table-select`]="{ allSelected, selectAll, someSelected }">
        <v-checkbox-btn
          :indeterminate="someSelected && !allSelected"
          :model-value="allSelected"
          color="primary"
          @update:model-value="selectAll(!allSelected)"
        ></v-checkbox-btn>
      </template>
      <template v-slot:item="{ item, internalItem, isSelected, toggleSelect }">
        <tr>
          <td>
            <v-checkbox-btn
              :model-value="isSelected(internalItem)"
              color="primary"
              @update:model-value="toggleSelect(internalItem)"
            ></v-checkbox-btn>
          </td>
          <td>
            <v-avatar
              v-if="item.flag"
              :class="{ grayscale: !item.active }"
              :image="item.flag"
            ></v-avatar>
          </td>
          <td>
            <b
              ><router-link
                :to="{
                  name: 'member-organization-view',
                  params: { member_organization_id: item.id },
                }"
              >
                <span v-if="item.name.length > 30" v-tooltip:bottom="item.name"
                  >{{ item.name.slice(0, 30) }} ...</span
                >
                <span v-else>{{ item.name }}</span>
              </router-link></b
            >
          </td>
          <td>
            <span v-if="item.official_name.length > 40" v-tooltip:bottom="item.official_name"
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
            <span
              v-tooltip="{
                text: 'Only member organizations without delegates representing them can be set (in)active.',
                location: 'start',
                disabled: !delegatesStore.delegates.some(
                  (delegate) => delegate.represents === item.id,
                ),
              }"
            >
              <v-switch
                v-model="item.active"
                style="display: flex"
                color="primary"
                :disabled="
                  delegatesStore.delegates.some((delegate) => delegate.represents === item.id)
                "
                @update:modelValue="toggleActive(item.id)"
              ></v-switch>
            </span>
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
            <span
              v-tooltip="{
                text: 'Only member organizations without delegates representing them can be deleted.',
                location: 'start',
                disabled: !delegatesStore.delegates.some(
                  (delegate) => delegate.represents === item.id,
                ),
              }"
            >
              <v-btn
                variant="plain"
                icon="mdi-delete"
                :disabled="
                  delegatesStore.delegates.some((delegate) => delegate.represents === item.id)
                "
                @click.stop="deleteMemberOrganization(item.id)"
              >
              </v-btn>
            </span>
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
            (org) => org.id == deleteDialog.value,
          ).id,
        )
      "
      @cancel-clicked="deleteDialog.value = false"
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
b > a {
  color: inherit;
  text-decoration: none;
}

.v-table > .v-table__wrapper > table > tbody > tr > td {
  padding: 0 4px;
}

.v-table > .v-table__wrapper > table > thead > tr > th {
  padding: 0 4px !important;
}
</style>
