<script setup>
import { useForumsStore } from "../../stores/forums";
import { usePlenariesStore } from "../../stores/plenaries";
import { useDelegatesStore } from "../../stores/delegates";
import { useIssuesStore } from "../../stores/issues";
import { useRouter } from "vue-router";
import { ref } from "vue";
import { toast } from "vue3-toastify";
import "vue3-toastify/dist/index.css";
import ConfirmDialog from "../../components/dialogs/ConfirmDialog.vue";
// import RoomChip from "../../components/chips/RoomChip.vue";

const forumsStore = useForumsStore();
forumsStore.getForums();
const plenariesStore = usePlenariesStore();
plenariesStore.getPlenaries();
const router = useRouter();
const delegatesStore = useDelegatesStore();
delegatesStore.getDelegates();
const issuesStore = useIssuesStore();
issuesStore.getIssues();

const deleteDialog = ref(null);
const deleteDialogPlenary = ref(null);
const search = ref("");

const headers = [
  { title: "Abbreviation", key: "abbreviation" },
  { title: "Name", key: "name" },
  { title: "Subtitle", key: "subtitle" },
  { title: "Plenary", key: "plenary" },
  { title: "Email", key: "email" },
  // { title: "Room", key: "" },
  { title: "Actions", key: "actions" },
];

const plenary_headers = [
  { title: "Abbreviation", key: "abbreviation" },
  { title: "Name", key: "name" },
  // { title: "Location", key: "" },
  { title: "Size", key: "" },
  { title: "Actions", key: "actions" },
];

const deleteForum = function (forum_id) {
  deleteDialog.value = forum_id;
};

const confirmedDeleteForum = function () {
  forumsStore.deleteForum(deleteDialog.value);
  deleteDialog.value = false;
};

const deletePlenary = function (plenary_id) {
  deleteDialogPlenary.value = plenary_id;
};

const confirmedDeletePlenary = function () {
  plenariesStore.deletePlenary(deleteDialogPlenary.value);
  deleteDialogPlenary.value = false;
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

    <v-data-table
      v-if="forumsStore.forums"
      :headers="headers"
      :items="forumsStore.forums"
      item-key="id"
      items-per-page="-1"
      items-per-page-text="Forums per page"
      hover
      :loading="forumsStore.loading ? 'primary' : false"
      fixed-header
      hide-default-footer=""
      :search="search"
      :sort-by="[{ key: 'id', order: 'asc' }]"
      item-height="56"
    >
      <template v-slot:loading>
        <v-skeleton-loader type="table-row@20"></v-skeleton-loader>
      </template>
      <template v-slot:item="{ item }">
        <tr>
          <td>
            <v-chip v-if="item.abbreviation" prepend-icon="mdi-forum"
              >{{ item.abbreviation }}
            </v-chip>
          </td>
          <td>{{ item.name }}</td>
          <td>
            <i>{{ item.subtitle }}</i>
          </td>
          <td>
            <v-chip v-if="item.plenary" prepend-icon="mdi-account-group">{{
              plenariesStore.plenaries.find(
                (plenary) => plenary.id == item.plenary,
              )?.abbreviation
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
          <!-- <td>
            <RoomChip v-if="item.room" :room="item.room" />
          </td> -->

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
            <span
              v-tooltip="{
                text: 'Only forums without assigned delegates and issues can be deleted.',
                location: 'start',
                disabled: !(
                  delegatesStore.delegates.some(
                    (delegate) => delegate.forum === item.id,
                  ) ||
                  issuesStore.issues.some((issue) => issue.forum === item.id)
                ),
              }"
            >
              <v-btn
                variant="plain"
                icon="mdi-delete"
                :disabled="
                  delegatesStore.delegates.some(
                    (delegate) => delegate.forum === item.id,
                  ) ||
                  issuesStore.issues.some((issue) => issue.forum === item.id)
                "
                @click.stop="deleteForum(item.id)"
              >
              </v-btn>
            </span>
          </td>
        </tr>
      </template>
    </v-data-table>

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
    <v-data-table
      :headers="plenary_headers"
      :items="plenariesStore.plenaries"
      item-key="id"
      items-per-page="-1"
      items-per-page-text="Plenaries per page"
      hover
      :loading="plenariesStore.loading ? 'primary' : false"
      fixed-header
      hide-default-footer
      :search="search"
    >
      <template v-slot:loading>
        <v-skeleton-loader type="table-row@20"></v-skeleton-loader>
      </template>
      <template v-slot:item="{ item }">
        <tr>
          <td>
            <v-chip v-if="item.abbreviation" prepend-icon="mdi-account-group"
              >{{ item.abbreviation }}
            </v-chip>
          </td>
          <td>{{ item.name }}</td>
          <!-- <td>{{ item.location }}</td> -->
          <td>
            {{
              delegatesStore.delegates.filter((delegate) =>
                forumsStore.forums.some(
                  (forum) =>
                    forum.plenary === item.id && forum.id === delegate.forum,
                ),
              ).length
            }}
            Delegates
          </td>
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
    </v-data-table>

    <!-- Forums Delete Dialog -->
    <ConfirmDialog
      :model="deleteDialog"
      title="Confirm Delete"
      text="Are you sure you want to delete this forum?"
      @ok-clicked="
        confirmedDeleteForum(
          forumsStore.forums.filter((forum) => forum.id == deleteDialog.value)
            .id,
        )
      "
      @cancel-clicked="deleteDialog.value = false"
    ></ConfirmDialog>

    <!-- Plenaries Delete Dialog -->
    <ConfirmDialog
      :model="deleteDialogPlenary"
      title="Confirm Delete"
      text="Are you sure you want to delete this plenary?"
      @ok-clicked="
        confirmedDeletePlenary(
          plenariesStore.plenaries.filter(
            (plenary) => plenary.id == deleteDialogPlenary.value,
          ).id,
        )
      "
      @cancel-clicked="deleteDialogPlenary.value = false"
    ></ConfirmDialog>
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
