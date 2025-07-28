<script setup>
import { ref } from "vue";
import { useIssuesStore } from "../../stores/issues";
import { useForumsStore } from "../../stores/forums";
import { useRoute, useRouter } from "vue-router";

const route = useRoute();
const router = useRouter();
const issuesStore = useIssuesStore();
const forumsStore = useForumsStore();
forumsStore.getForums();
const valid = ref(true);

// initialize forum choices
const forum_choices = forumsStore.forums;

// select which information should be displayed in the v-select
const forumItemProps = (forum) => {
  return {
    title: forum.name,
    subtitle: forum.subtitle,
    value: forum.id,
  };
};

if (route.params.issue_id != "add") {
  issuesStore.getIssue(route.params.issue_id);
} else {
  issuesStore.initializeIssue();
}

const updateIssue = (issue_id) => {
  if (issue_id == undefined) {
    // create new issue
    issuesStore.createIssue();
  } else {
    // update existing issue
    issuesStore.updateIssue(issue_id);
  }
  // go back to issues view
  router.push({ name: "issues" });
};
</script>

<template>
  <div class="">
    <v-breadcrumbs
      :items="[
        { title: 'Issues', to: { name: 'issues' } },
        { title: issuesStore.issue.name },
      ]"
    >
      <template v-slot:prepend>
        <v-icon
          icon="mdi-format-list-bulleted-type"
          size="small"
          start
        ></v-icon>
      </template>
    </v-breadcrumbs>

    <v-form v-model="valid">
      <v-container>
        <v-row>
          <v-col cols="6">
            <v-text-field
              label="Issue Name"
              prepend-icon="mdi-label"
              v-model="issuesStore.issue.name"
              :loading="issuesStore.loading"
              hint="Official Issue title as on the Agenda"
              :rules="[
                (v) => !!v || 'Issue Name is required',
                (v) => (v && v.length <= 256) || '256 characters maximum',
              ]"
              required
            >
            </v-text-field>
          </v-col>
        </v-row>
        <v-row>
          <v-col cols="6">
            <v-select
              label="Forum"
              :items="forum_choices"
              :item-props="forumItemProps"
              v-model="issuesStore.issue.forum"
              prepend-icon="mdi-forum"
              hint="Select the forum in which this issue is debated"
              :rules="[(v) => !!v || 'Forum is required']"
              required
            ></v-select>
          </v-col>
        </v-row>
        <v-row class="justify-center">
          <v-btn
            id="submit-btn"
            color="primary"
            prepend-icon="mdi-send"
            @click="updateIssue(issuesStore.issue.id)"
            >{{
              route.params.issue_id == "add" ? "add" : "update"
            }}
            issue</v-btn
          >
        </v-row>
      </v-container>
    </v-form>
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
