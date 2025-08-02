<script setup>
import { useIssuesStore } from "../../stores/issues";
import { useForumsStore } from "../../stores/forums";
import { useRouter } from "vue-router";
import { ref } from "vue";
import ConfirmDialog from "../../components/dialogs/ConfirmDialog.vue";

const issuesStore = useIssuesStore();
issuesStore.getIssues();
const forumsStore = useForumsStore();
forumsStore.getForums();

const router = useRouter();

const deleteDialog = ref(null);
const search = ref("");

const headers = [
  { title: "Forum", key: "forum" },
  { title: "Issue Name", key: "name" },

  { title: "Actions", key: "actions" },
];

const deleteIssue = function (issue_id) {
  this.deleteDialog = issue_id;
};

const confirmedDeleteIssue = function () {
  issuesStore.deleteIssue(this.deleteDialog);
  this.deleteDialog = false;
};
</script>

<template>
  <div class="">
    <v-breadcrumbs :items="[{ title: 'Issues' }]">
      <template v-slot:prepend>
        <v-icon
          icon="mdi-format-list-bulleted-type"
          size="small"
          start
          disabled
        ></v-icon>
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
        text="add issue"
        @click="
          router.push({
            name: 'issue-detail',
            params: { issue_id: 'add' },
          })
        "
      ></v-fab>
    </v-breadcrumbs>

    <v-data-table-virtual
      v-if="issuesStore.issues"
      :headers="headers"
      :items="issuesStore.issues"
      item-key="id"
      items-per-page="-1"
      items-per-page-text="Issues per page"
      hover
      :loading="forumsStore.loading ? 'primary' : false"
      sticky
      :search="search"
      :sort-by="[
        { key: 'forum', order: 'asc' },
        { key: 'id', order: 'asc' },
      ]"
    >
      <template v-slot:loading>
        <v-skeleton-loader type="table-row@10"></v-skeleton-loader>
      </template>
      <template v-slot:item="{ item }">
        <tr>
          <td>
            <v-chip prepend-icon="mdi-forum"
              >{{
                forumsStore.forums.find((forum) => forum.id == item.forum)?.name
              }}
            </v-chip>
          </td>
          <td>{{ item.name }}</td>
          <td>
            <v-btn
              variant="plain"
              icon="mdi-pencil"
              :to="{
                name: 'issue-detail',
                params: { issue_id: item.id },
              }"
            >
            </v-btn>
            <v-btn
              variant="plain"
              icon="mdi-delete"
              @click.stop="deleteIssue(item.id)"
            >
            </v-btn>
          </td>
        </tr>
      </template>
    </v-data-table-virtual>

    <ConfirmDialog
      :model="deleteDialog"
      title="Confirm Delete"
      text="Are you sure you want to delete this issue?"
      @ok-clicked="
        confirmedDeleteIssue(
          issuesStore.issues.filter((issue) => issue.id == this.deleteDialog)
            .id,
        )
      "
      @cancel-clicked="deleteDialog = false"
    />

    <v-alert style="margin-top: 20px" title="TODOs" color="info">
      <ul>
        <li>Use nested forum information of issues</li>
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
