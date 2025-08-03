<script setup>
import { ref } from "vue";
import { useForumsStore } from "../../stores/forums";
import { usePlenariesStore } from "../../stores/plenaries";
import { useRoute, useRouter } from "vue-router";

const route = useRoute();
const router = useRouter();
const forumsStore = useForumsStore();
const plenariesStore = usePlenariesStore();
plenariesStore.getPlenaries();
const valid = ref(true);

// initialize plenary choices
const plenary_choices = [
  { title: "None", value: null },
  ...plenariesStore.plenaries.map((plenary) => ({
    title: plenary.name,
    subtitle: plenary.abbreviation,
    value: plenary.id,
  })),
];

if (route.params.forum_id != "add") {
  forumsStore.getForum(route.params.forum_id);
} else {
  forumsStore.initializeForum();
}

const updateForum = (forum_id) => {
  if (forum_id == undefined) {
    // create new forum
    forumsStore.createForum();
  } else {
    // update existing forum
    forumsStore.updateForum(forum_id);
  }
  // go back to forums view
  router.push({ name: "forums" });
};
</script>

<template>
  <div class="">
    <v-breadcrumbs
      :items="[
        { title: 'Forums', to: { name: 'forums' } },
        { title: forumsStore.forum.abbreviation },
      ]"
    >
      <template v-slot:prepend>
        <v-icon icon="mdi-forum" size="small" start></v-icon>
      </template>
    </v-breadcrumbs>

    <v-form v-model="valid">
      <v-container>
        <v-row>
          <v-col cols="6">
            <v-text-field
              label="Name"
              prepend-icon="mdi-label"
              v-model="forumsStore.forum.name"
              :loading="forumsStore.loading"
              hint="e.g. 'First Committee', 'Economic and Social Council'"
              :rules="[
                (v) => !!v || 'Name is required',
                (v) => (v && v.length <= 50) || '50 characters maximum',
              ]"
              required
            >
            </v-text-field>
          </v-col>
        </v-row>
        <v-row>
          <v-col cols="6">
            <v-text-field
              label="Explanatory Subtitle"
              prepend-icon="mdi-subtitles"
              v-model="forumsStore.forum.subtitle"
              :loading="forumsStore.loading"
              hint="e.g. 'Disarmament and International Security'"
              :rules="[(v) => v.length <= 75 || '75 characters maximum']"
            >
            </v-text-field>
          </v-col>
        </v-row>
        <v-row>
          <v-col cols="6">
            <v-text-field
              label="Abbreviated Forum Name"
              prepend-icon="mdi-alphabetical-variant"
              v-model="forumsStore.forum.abbreviation"
              :loading="forumsStore.loading"
              hint="e.g. 'GA1', 'ECOSOC'"
              :rules="[(v) => v.length <= 10 || '10 characters maximum']"
            >
            </v-text-field>
          </v-col>
        </v-row>

        <v-row>
          <v-col cols="6">
            <v-text-field
              label="E-Mail"
              prepend-icon="mdi-email"
              v-model="forumsStore.forum.email"
              :loading="forumsStore.loading"
              hint="Email might be displayed on website"
              :rules="[
                (v) =>
                  /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(v) ||
                  'E-Mail must be valid',
              ]"
            >
            </v-text-field>
          </v-col>
        </v-row>
        <!-- <v-row>
          <v-col cols="6">
            <v-text-field
              label="Room"
              prepend-icon="mdi-map-marker"
              v-model="forumsStore.forum.room"
              :loading="forumsStore.loading"
              hint="Select a Room within the conference venue"
            >
            </v-text-field>
          </v-col>
        </v-row> -->
        <v-row>
          <v-col cols="6">
            <v-select
              label="Plenary"
              :items="plenary_choices"
              v-model="forumsStore.forum.plenary"
              prepend-icon="mdi-account-group"
              hint="Select a Plenary if this forum is part of it, otherwise choose none."
            ></v-select>
          </v-col>
        </v-row>
        <v-row class="justify-center">
          <v-btn
            id="submit-btn"
            color="primary"
            prepend-icon="mdi-send"
            :disabled="!valid"
            @click="updateForum(forumsStore.forum.id)"
            >{{
              route.params.forum_id == "add" ? "add" : "update"
            }}
            forum</v-btn
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
