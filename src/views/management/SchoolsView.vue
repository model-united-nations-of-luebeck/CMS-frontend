<script setup>
import {
  useSchoolsStore,
  getRegistrationStatusTitle,
  getRegistrationStatusColor,
  getHousingIcon,
  getHousingText,
} from "../../stores/schools";

import { ref } from "vue";
import { useDelegatesStore } from "../../stores/delegates";
import ConfirmDialog from "../../components/dialogs/ConfirmDialog.vue";

const schoolsStore = useSchoolsStore();
schoolsStore.getSchools();
const delegatesStore = useDelegatesStore();
delegatesStore.getDelegates();

const generateRandomPassword = function () {
  // Generates a random 24 chars long password with a mix of lowercase, uppercase letters, and numbers
  return (
    Math.random().toString(36).slice(2, 10) +
    Math.random().toString(36).toUpperCase().slice(2, 10) +
    Math.random().toString(36).slice(2, 10)
  );
};

const deleteDialog = ref(null);
const addNewSchoolDialog = ref(false);
const newSchoolName = ref("");
const newSchoolUserName = ref("");
const newSchoolPassword = ref(generateRandomPassword());
const showPassword = ref(false);
const valid = ref(true);

const search = ref("");
const expanded = ref([]);

const headers = [
  { title: "", key: "data-table-expand", sortable: false },
  {
    title: "Name",
    align: "start",
    sortable: true,
    key: "name",
  },

  {
    title: "Delegates",
    align: "center",
    children: [
      {
        title: "requested",
        key: "requested",
        align: "center",
      },
      { title: "confirmed", key: "confirmed", align: "center" },
    ],
  },
  { title: "Pre-Reg Fee", key: "fee_paid", align: "center" },
  {
    title: "Housing ",
    align: "center",
    children: [
      { title: "Delegates", key: "housing_delegates", align: "center" },
      { title: "MUN Directors", key: "housing_mun_directors", align: "center" },
    ],
  },
  { title: "Status", key: "registration_status" },
  {
    title: "Actions",
    key: "actions",
    sortable: false,
  },

  // { text: '', value: 'data-table-select'}
];

const custom_filter = function (value, query, item) {
  // searches all attributes of the item (not only the columns) if they contain the query
  return (
    item != null &&
    query != null &&
    Object.values(item.raw).some((value) =>
      String(value).toLowerCase().includes(query.toLowerCase()),
    )
  );
};

const confirmedDelegatesFromSchool = function (school_id) {
  return delegatesStore.delegates.filter(
    (delegate) => delegate.school === school_id,
  ).length;
};

const createSchool = function () {
  if (newSchoolName.value !== "") {
    schoolsStore
      .createSchool(
        newSchoolName.value,
        newSchoolUserName.value,
        newSchoolPassword.value,
      )
      .then(() => {
        addNewSchoolDialog.value = false;
        newSchoolName.value = "";
        newSchoolUserName.value = "";
        newSchoolPassword.value = generateRandomPassword();
        showPassword.value = false;
        valid.value = true;
      });
  }
};

const deleteSchool = function (school_id) {
  this.deleteDialog = school_id;
};

const confirmedDeleteSchool = function () {
  schoolsStore.deleteSchool(this.deleteDialog);
  this.deleteDialog = false;
};
</script>

<template>
  <div class="">
    <v-row>
      <v-col cols="10">
        <v-breadcrumbs :items="[{ title: 'Schools' }]">
          <template v-slot:prepend>
            <v-icon icon="mdi-bank" size="small" start disabled></v-icon>
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
      <v-col cols="2" style="display: flex">
        <v-fab
          color="primary"
          rounded
          style="justify-content: end"
          prepend-icon="mdi-plus"
          text="add new school"
          @click="addNewSchoolDialog = true"
        ></v-fab>
      </v-col>
    </v-row>

    <v-data-table-virtual
      v-if="schoolsStore.schools"
      :headers="headers"
      :items="schoolsStore.schools"
      item-key="id"
      items-per-page="-1"
      items-per-page-text="Schools per page"
      hover
      :loading="schoolsStore.loading ? 'primary' : false"
      sticky
      :search="search"
      :sort-by="[{ key: 'name', order: 'asc' }]"
      v-model:expanded="expanded"
      hide-default-footer
      :custom-filter="custom_filter"
    >
      <template v-slot:loading>
        <v-skeleton-loader type="table-row@10"></v-skeleton-loader>
      </template>
      <template v-slot:item="{ item, internalItem, toggleExpand, isExpanded }">
        <tr
          :class="{ school_canceled: item.registration_status === 'CANCELED' }"
        >
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
            <b>{{ item.name }}</b
            ><br />
            <span v-if="item.city"> ({{ item.city }})</span>
            <span v-if="item.country"
              >, <i>{{ item.country }}</i></span
            >
          </td>

          <td class="center">
            <v-icon
              icon="mdi-account-outline"
              v-tooltip:start="'Number of delegate positions requested'"
            >
            </v-icon>

            <span v-if="item.requested">{{
              String(item.requested).padStart(4, "&nbsp;")
            }}</span>
          </td>
          <td class="center">
            <v-icon
              color="success"
              icon="mdi-account"
              v-tooltip:start="'Number of delegate positions confirmed'"
            >
            </v-icon>

            {{
              String(confirmedDelegatesFromSchool(item.id)).padStart(
                4,
                "&nbsp;",
              )
            }}
          </td>
          <td class="center">
            <v-icon
              v-if="!item.fee_paid"
              color="warning"
              icon="mdi-currency-eur"
              v-tooltip="'Pre-Registration fee not paid yet'"
            >
            </v-icon>

            <v-icon
              v-if="item.fee_paid"
              color="success"
              icon="mdi-check"
              v-tooltip="'Pre-Registration fee already paid'"
            >
            </v-icon>
          </td>
          <td>
            <v-chip :prepend-icon="getHousingIcon(item.housing_delegates)">{{
              getHousingText(item.housing_delegates)
            }}</v-chip>
          </td>
          <td>
            <v-chip
              :prepend-icon="getHousingIcon(item.housing_mun_directors)"
              >{{ getHousingText(item.housing_mun_directors) }}</v-chip
            >
          </td>
          <td>
            <v-chip
              :color="getRegistrationStatusColor(item.registration_status)"
              >{{
                getRegistrationStatusTitle(item.registration_status)
              }}</v-chip
            >
          </td>
          <td>
            <v-btn
              variant="plain"
              icon="mdi-pencil"
              :to="{
                name: 'school-detail',
                params: { school_id: item.id },
              }"
            >
            </v-btn>

            <span
              v-tooltip="{
                text: 'Only school without assigned delegates can be deleted.',
                location: 'start',
                disabled: !delegatesStore.delegates.some(
                  (delegate) => delegate.school === item.id,
                ),
              }"
            >
              <v-btn
                variant="plain"
                icon="mdi-delete"
                :disabled="
                  delegatesStore.delegates.some(
                    (delegate) => delegate.school === item.id,
                  )
                "
                @click.stop="deleteSchool(item.id)"
              >
              </v-btn>
            </span>
          </td>
        </tr>
      </template>

      <template v-slot:expanded-row="{ columns, item }">
        <tr>
          <td :colspan="columns.length">
            <v-row style="padding: 20px">
              <v-col sm="3">
                <p><b>Address:</b></p>
                <p>{{ item.street }}</p>
                <p>{{ item.zipcode }}, {{ item.city }}</p>
                <p>{{ item.country }}</p>
              </v-col>
              <v-col sm="3">
                <p><b>Arrival:</b></p>
                <p>{{ item.arrival }}</p>
              </v-col>
              <v-col sm="3">
                <p><b>Departure:</b></p>
                <p>{{ item.departure }}</p>
              </v-col>
              <v-col sm="3">
                <p><b>Internal comment:</b></p>
                <p>{{ item.comment }}</p>
              </v-col>
            </v-row>
          </td>
        </tr>
      </template>
    </v-data-table-virtual>

    <ConfirmDialog
      v-model:model="deleteDialog"
      title="Confirm Delete"
      text="Are you sure you want to delete this school?"
      @ok-clicked="
        confirmedDeleteSchool(
          schoolsStore.schools.filter(
            (school) => school.id == this.deleteDialog,
          ).id,
        )
      "
      @cancel-clicked="deleteDialog = false"
    ></ConfirmDialog>

    <v-dialog max-width="500" v-model="addNewSchoolDialog">
      <template v-slot:default="{ isActive }">
        <v-form v-model="valid" validate-on="input">
          <v-card title="Add new school">
            <v-card-text>
              <v-text-field
                v-model="newSchoolName"
                label="School name"
                outlined
                prepend-inner-icon="mdi-bank"
                :rules="[
                  (v) => !!v || 'School name is required',
                  (v) =>
                    v.length <= 50 || 'Name must be less than 50 characters',
                ]"
                :hint="`Full name of the school, e.g. 'Thomas-Mann-Schule'`"
                required
                autofocus="autofocus"
              ></v-text-field>
              <v-text-field
                v-model="newSchoolUserName"
                label="Username"
                :rules="[
                  (v) => !!v || 'Username is required',
                  (v) =>
                    v.length <= 150 ||
                    'Username must be less than 150 characters',
                  (v) =>
                    /^[a-zA-Z0-9@.+_-]+$/.test(v) ||
                    'Username can only contain letters, digits, and @/./+/-/_',
                ]"
                outlined
                prepend-inner-icon="mdi-account"
                required
              ></v-text-field>
              <v-text-field
                v-model="newSchoolPassword"
                label="Password"
                required
                :rules="[
                  (v) => !!v || 'Password is required',
                  (v) =>
                    v.length >= 8 || 'Password must be at least 8 characters',
                  (v) =>
                    !/^\d+$/.test(v) || 'Password must not be entirely numeric',
                ]"
                :hint="`Please save a copy of the password, as it will not be shown again.`"
                prepend-inner-icon="mdi-lock"
                :append-inner-icon="!showPassword ? 'mdi-eye' : 'mdi-eye-off'"
                :type="showPassword ? 'text' : 'password'"
                @click:append-inner="showPassword = !showPassword"
                counter
                outlined
              ></v-text-field>
            </v-card-text>

            <v-card-actions>
              <v-spacer></v-spacer>

              <v-btn text="Cancel" @click="isActive.value = false"></v-btn>
              <v-btn
                text="Create"
                :disabled="!valid"
                @click="createSchool"
              ></v-btn>
            </v-card-actions>
          </v-card>
        </v-form>
      </template>
    </v-dialog>
  </div>
</template>

<style>
.school_canceled {
  color: lightgray;
}

.center {
  text-align: center;
}

.v-table > .v-table__wrapper > table > tbody > tr > td {
  padding: 0 4px;
}
</style>
