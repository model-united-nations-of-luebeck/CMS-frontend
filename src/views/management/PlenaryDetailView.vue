<script setup>
import { ref, watch } from "vue";
import { usePlenariesStore } from "../../stores/plenaries";
import { useRoute, useRouter } from "vue-router";

const route = useRoute();
const router = useRouter();
const plenariesStore = usePlenariesStore();
const valid = ref(true);

const fetchPlenary = () => {
  if (route.params.plenary_id != "add") {
    if (route.params.plenary_id) {
      plenariesStore.getPlenary(route.params.plenary_id);
    }
  } else {
    plenariesStore.initializePlenary();
  }
};

fetchPlenary();

watch(
  () => route.params.plenary_id,
  () => {
    fetchPlenary();
  },
);

const updatePlenary = (plenary_id) => {
  if (plenary_id == undefined) {
    // create new plenary
    plenariesStore.createPlenary();
  } else {
    // update existing plenary
    plenariesStore.updatePlenary(plenary_id);
  }
  // go back to forums view
  router.push({ name: "forums" });
};
</script>

<template>
  <div class="">
    <v-breadcrumbs
      :items="[
        { title: 'Plenaries', to: { name: 'forums' } },
        { title: plenariesStore.plenary.name },
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
              v-model="plenariesStore.plenary.name"
              :loading="plenariesStore.loading"
              :rules="[
                (v) => !!v || 'Name is required',
                (v) => v.length <= 50 || 'Name must be less than 50 characters',
              ]"
              required
              hint="e.g. 'General Assembly' or 'Economic and Social Council'"
            >
            </v-text-field>
          </v-col>
        </v-row>
        <v-row>
          <v-col cols="6">
            <v-text-field
              label="Abbreviation"
              prepend-icon="mdi-alphabetical-variant"
              v-model="plenariesStore.plenary.abbreviation"
              :loading="plenariesStore.loading"
              hint="e.g. 'GA' or 'ECOSOC'"
              :rules="[
                (v) =>
                  v.length <= 10 ||
                  'Abbreviation must be less than 10 characters',
              ]"
            >
            </v-text-field>
          </v-col>
        </v-row>
        <!-- <v-row>
          <v-col cols="6">
            <v-text-field
              label="Location"
              prepend-icon="mdi-map-marker"
              v-model="plenariesStore.plenary.location"
              :loading="plenariesStore.loading"
              hint="Select a conference venue where this plenary takes place'"
            >
            </v-text-field>
          </v-col>
        </v-row> -->
        <v-row class="justify-center">
          <v-btn
            id="submit-btn"
            color="primary"
            :disabled="!valid"
            prepend-icon="mdi-send"
            @click="updatePlenary(plenariesStore.plenary.id)"
            >{{
              route.params.plenary_id == "add" ? "add" : "update"
            }}
            plenary</v-btn
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
