<script setup>
import { useForumsStore } from "../../stores/forums";
import { usePlenariesStore } from "../../stores/plenaries";
import { useRouter } from "vue-router";
import { ref } from "vue";
import { toast } from "vue3-toastify";
import "vue3-toastify/dist/index.css";
import ConfirmDialog from "../../components/dialogs/ConfirmDialog.vue";

const forumsStore = useForumsStore();
forumsStore.getForums();
const plenariesStore = usePlenariesStore();
plenariesStore.getPlenaries();
const router = useRouter();

const deleteDialog = ref(null);
const deleteDialogPlenary = ref(null);
const search = ref("");

const headers = [
  { title: "Abbreviation", key: "abbreviation" },
  { title: "Name", key: "name" },
  { title: "Subtitle", key: "subtitle" },
  { title: "Plenary", key: "plenary" },
  { title: "Email", key: "email" },
  { title: "Room", key: "" },
  { title: "Actions", key: "actions" },
];

const plenary_headers = [
  { title: "Abbreviation", key: "abbreviation" },
  { title: "Name", key: "name" },
  { title: "Location", key: "" },
  { title: "Size", key: "" },
  { title: "Actions", key: "actions" },
];

const deleteForum = function (forum_id) {
  this.deleteDialog = forum_id;
};

const confirmedDeleteForum = function () {
  forumsStore.deleteForum(this.deleteDialog);
  this.deleteDialog = false;
};

const deletePlenary = function (plenary_id) {
  this.deleteDialogPlenary = plenary_id;
};

const confirmedDeletePlenary = function () {
  plenariesStore.deletePlenary(this.deleteDialogPlenary);
  this.deleteDialogPlenary = false;
};
</script>

<template>
  <div class="">
    <v-breadcrumbs :items="[{ title: 'Forums' }]">
      <template v-slot:prepend>
        <v-icon icon="mdi-forum" size="small" start disabled></v-icon>
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
        text="add forum"
        @click="
          router.push({
            name: 'forum-detail',
            params: { forum_id: 'add' },
          })
        "
      ></v-fab>
    </v-breadcrumbs>

    <v-data-table-virtual
      :headers="headers"
      :items="forumsStore.forums"
      item-key="id"
      items-per-page="-1"
      items-per-page-text="Forums per page"
      hover
      :loading="forumsStore.loading ? 'primary' : false"
      sticky
      :search="search"
      :sort-by="[
        { key: 'plenary', order: 'asc' },
        { key: 'abbreviation', order: 'asc' },
      ]"
    >
      <template v-slot:loading>
        <v-skeleton-loader type="table-row@10"></v-skeleton-loader>
      </template>
      <template v-slot:item="{ item }">
        <tr>
          <td>
            <v-chip>{{ item.abbreviation }} </v-chip>
          </td>
          <td>{{ item.name }}</td>
          <td>
            <i>{{ item.subtitle }}</i>
          </td>
          <td>
            <v-chip v-if="item.plenary" prepend-icon="mdi-account-group">{{
              plenariesStore.plenaries.find(
                (plenary) => plenary.id == item.plenary,
              )?.name
            }}</v-chip>
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
              >mdi-email</v-icon
            >
          </td>
          <td><a href="">Room 1.29</a></td>

          <td>
            <v-btn
              variant="plain"
              icon="mdi-pencil"
              :to="{
                name: 'forum-detail',
                params: { forum_id: item.id },
              }"
            >
            </v-btn>
            <v-btn
              variant="plain"
              icon="mdi-delete"
              @click.stop="deleteForum(item.id)"
            >
            </v-btn>
          </td>
        </tr>
      </template>
    </v-data-table-virtual>

    <h2 style="display: flex; margin-top: 50px">
      <v-icon start size="small">mdi-account-group</v-icon>Plenary Sessions
      <v-spacer></v-spacer>
      <v-fab
        color="primary"
        rounded
        prepend-icon="mdi-plus"
        text="add plenary"
        @click="
          router.push({
            name: 'plenary-detail',
            params: { plenary_id: 'add' },
          })
        "
      ></v-fab>
    </h2>

    <!-- Plenary Sessions -->
    <v-data-table-virtual
      :headers="plenary_headers"
      :items="plenariesStore.plenaries"
      item-key="id"
      items-per-page="-1"
      items-per-page-text="Plenaries per page"
      hover
      :loading="plenariesStore.loading ? 'primary' : false"
      sticky
      :search="search"
    >
      <template v-slot:loading>
        <v-skeleton-loader type="table-row@10"></v-skeleton-loader>
      </template>
      <template v-slot:item="{ item }">
        <tr>
          <td>
            <v-chip v-if="item.abbreviation">{{ item.abbreviation }} </v-chip>
          </td>
          <td>{{ item.name }}</td>
          <td>{{ item.location }}</td>
          <td>132 Delegates</td>
          <td>
            <v-btn
              variant="plain"
              icon="mdi-pencil"
              :to="{
                name: 'plenary-detail',
                params: { plenary_id: item.id },
              }"
            >
            </v-btn>

            <span
              v-tooltip="{
                text: 'Only plenary sessions without assigned forums can be deleted.',
                location: 'start',
                disabled: !forumsStore.forums.some(
                  (forum) => forum.plenary === item.id,
                ),
              }"
            >
              <v-btn
                variant="plain"
                icon="mdi-delete"
                :disabled="
                  forumsStore.forums.some((forum) => forum.plenary === item.id)
                "
                @click.stop="deletePlenary(item.id)"
              >
              </v-btn>
            </span>
          </td>
        </tr>
      </template>
    </v-data-table-virtual>

    <!-- Forums Delete Dialog -->
    <ConfirmDialog
      :model="deleteDialog"
      title="Confirm Delete"
      text="Are you sure you want to delete this forum?"
      @ok-clicked="
        confirmedDeleteForum(
          forumsStore.forums.filter((forum) => forum.id == this.deleteDialog)
            .id,
        )
      "
      @cancel-clicked="deleteDialog = false"
    ></ConfirmDialog>

    <!-- Plenaries Delete Dialog -->
    <ConfirmDialog
      :model="deleteDialogPlenary"
      title="Confirm Delete"
      text="Are you sure you want to delete this plenary?"
      @ok-clicked="
        confirmedDeletePlenary(
          plenariesStore.plenaries.filter(
            (plenary) => plenary.id == this.deleteDialogPlenary,
          ).id,
        )
      "
      @cancel-clicked="deleteDialogPlenary = false"
    ></ConfirmDialog>

    <v-alert style="margin-top: 20px" title="TODOs" color="info">
      <ul>
        <li>Link rooms</li>
        <li>Add abbreviation to plenary</li>
        <li>Make lunches not required for plenaries</li>
        <li>Add rules to detail forms, e.g. email, lengths</li>
        <li>
          Grayout delete button of forums which have assigned delegates or
          issues as they would also be deleted. Explain this in a tooltip
        </li>
      </ul>
    </v-alert>
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
