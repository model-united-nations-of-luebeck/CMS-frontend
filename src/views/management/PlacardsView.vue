<script setup>
import { ref, inject } from "vue";
const http = inject("backend_instance");
import axios from "axios";
const pdfs_http = axios.create({
  ...http.defaults,
  baseURL: http.defaults.baseURL.replace(/\/?api\/?$/, "/pdfs/"),
});
import { useForumsStore } from "../../stores/forums";
import { usePlenariesStore } from "../../stores/plenaries";
import { useDelegatesStore } from "../../stores/delegates";
import { useMemberOrganizationsStore } from "../../stores/member_organizations";
const forumsStore = useForumsStore();
forumsStore.getForums();
const plenariesStore = usePlenariesStore();
plenariesStore.getPlenaries();
const delegatesStore = useDelegatesStore();
delegatesStore.getDelegates();
const memberOrganizationsStore = useMemberOrganizationsStore();
memberOrganizationsStore.getMemberOrganizations();

const selectedForums = ref([]);
const selectedPlenaries = ref([]);
const voting_rights = ref("vote");
const forum_divider = ref(false);

const valid = ref(true);
const name = ref("");
const position = ref("");
const page_size = ref("A3");

const rules = {
  name: [
    (v) => !!v || "Please enter the name.",
    (v) => v.length <= 50 || "The name is too long. Please shorten it.",
    (v) => /^[^0-9]*$/.test(v) || "Please enter a valid name without numbers.",
  ],
  position: [(v) => v.length <= 50 || "The position is too long. Please shorten it."],
};

async function printCustomPlacard() {
  const form = new FormData();
  form.append("name", name.value);
  form.append("position", position.value);
  form.append("page_size", page_size.value);

  const response = await pdfs_http.post("custom_placard", form, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
    responseType: "blob",
  });

  const url = URL.createObjectURL(new Blob([response.data], { type: "application/pdf" }));
  window.open(url, "_blank");
}

async function printPlacard(url, page_size = null) {
  const form = new FormData();
  if (page_size) {
    form.append("page_size", page_size);
  }

  const response = await pdfs_http.post(url, form, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
    responseType: "blob",
  });

  const url_placard = URL.createObjectURL(new Blob([response.data], { type: "application/pdf" }));
  window.open(url_placard, "_blank");
}

async function printForumPlacards() {
  const form = new FormData();
  form.append("forum_ids", selectedForums.value.join(","));
  form.append("voting_rights", voting_rights.value);
  form.append("page_size", page_size.value);
  form.append("forum_divider", forum_divider.value);

  const response = await pdfs_http.post(`delegate_placards_forum`, form, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
    responseType: "blob",
  });

  const url = URL.createObjectURL(new Blob([response.data], { type: "application/pdf" }));
  window.open(url, "_blank");
}

async function printPlenaryPlacards() {
  const form = new FormData();
  form.append("plenary_ids", selectedPlenaries.value.join(","));
  form.append("voting_rights", voting_rights.value);
  form.append("page_size", page_size.value);

  const response = await pdfs_http.post(`delegate_placards_plenary`, form, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
    responseType: "blob",
  });

  const url = URL.createObjectURL(new Blob([response.data], { type: "application/pdf" }));
  window.open(url, "_blank");
}
</script>

<template>
  <div id="container">
    <v-breadcrumbs
      :items="[{ title: 'Printing', to: { name: 'printing' } }, { title: 'Placards' }]"
    >
      <template v-slot:prepend>
        <v-icon icon="mdi-tag" start disabled></v-icon>
      </template>
    </v-breadcrumbs>

    <v-alert border="start" color="primary" variant="tonal">
      Delegates receive placards with their member organization name whereas Student Officers and
      Executives with their position name and actual names. The placards are used to identify
      participants from far away and are placed on the tables in front of the participants or raised
      in the air when a participant wants to speak.
    </v-alert>

    <v-container style="width: 100vw; display: inline">
      <v-row>
        <v-col cols="12" md="6">
          <v-card title="Delegates" class="h-100">
            <v-card-text>
              Delegates representing a member organization with limited voting rights (NGOs, IGOs,
              observer states, UN-sub bodies) usually receive placards with a different color than
              those representing member states. For forums, usually A4 placards are sufficient,
              whereas for plenaries, A3 placards are recommended to ensure better visibility. You
              can select the forums and plenaries for which you want to print placards.

              <v-input class="mt-4">
                <v-btn-toggle v-model="voting_rights" color="primary" variant="outlined">
                  <v-btn value="vote" stacked>
                    <v-icon start color="success">mdi-vote</v-icon>
                    member states
                  </v-btn>

                  <v-btn value="novote" stacked>
                    <v-icon start color="error">mdi-vote</v-icon>
                    non-member states
                  </v-btn>
                </v-btn-toggle>

                <v-btn-toggle v-model="page_size" color="primary" variant="outlined" class="ml-10">
                  <v-btn value="A4" stacked>
                    <v-icon start>mdi-view-grid-outline</v-icon>
                    DIN A4
                  </v-btn>

                  <v-btn value="A3" stacked>
                    <v-icon start>mdi-tag</v-icon>
                    DIN A3
                  </v-btn>
                </v-btn-toggle>
              </v-input>

              <h3 class="d-flex" style="display: flex; justify-content: space-between">
                Forums

                <span class="">
                  <v-btn
                    class="mr-2"
                    size="small"
                    variant="tonal"
                    color="primary"
                    prepend-icon="mdi-checkbox-multiple-marked"
                    @click="selectedForums = forumsStore.forums.map((forum) => forum.id)"
                  >
                    Select all forums
                  </v-btn>

                  <v-btn
                    class="mr-2"
                    size="small"
                    variant="tonal"
                    color="primary"
                    prepend-icon="mdi-checkbox-multiple-blank-outline"
                    @click="selectedForums = []"
                  >
                    Deselect all forums
                  </v-btn>
                </span>
              </h3>

              In forums each delegate receives a placard with the placard name of their represented
              member organization. The placards name might be a short version of the member
              organization official name. Placards are sorted by forum and then alphabetically by
              member organization official name.
              <v-list lines="one" v-model:selected="selectedForums" select-strategy="leaf">
                <v-list-item
                  density="compact"
                  v-for="forum in forumsStore.forums"
                  :key="forum.id"
                  :title="`${forum.name} (${forum.abbreviation})`"
                  :subtitle="forum.subtitle"
                  :value="forum.id"
                  color="primary"
                >
                  <template v-slot:prepend="{ isSelected, select }">
                    <v-list-item-action start>
                      <v-checkbox-btn
                        :model-value="isSelected"
                        @update:model-value="select"
                      ></v-checkbox-btn>
                    </v-list-item-action>
                  </template>

                  <template v-slot:append>
                    <v-icon end>mdi-account-tie</v-icon>

                    {{
                      delegatesStore.delegates.filter((delegate) => delegate.forum === forum.id)
                        .length
                    }}
                    <v-badge
                      location="center right"
                      color="success"
                      :content="
                        delegatesStore.delegates.filter(
                          (delegate) =>
                            delegate.forum === forum.id &&
                            ['member state', 'former member state'].includes(
                              memberOrganizationsStore.member_organizations.find(
                                (org) => org.id === delegate.represents,
                              )?.status,
                            ),
                        ).length
                      "
                    >
                      <v-icon start color="success">mdi-vote</v-icon>
                    </v-badge>

                    <v-badge
                      location="center right"
                      color="error"
                      :content="
                        delegatesStore.delegates.filter(
                          (delegate) =>
                            delegate.forum === forum.id &&
                            !['member state', 'former member state'].includes(
                              memberOrganizationsStore.member_organizations.find(
                                (org) => org.id === delegate.represents,
                              )?.status,
                            ),
                        ).length
                      "
                    >
                      <v-icon start color="error">mdi-vote</v-icon>
                    </v-badge>
                  </template>
                </v-list-item>
              </v-list>

              <v-switch v-model="forum_divider" color="primary">
                <template v-slot:label>
                  <span>Add divider pages indicating the next forum section of placards</span>
                </template>
              </v-switch>
              <v-row no-gutters class="justify-center">
                <v-btn
                  id="submit-btn"
                  color="primary"
                  prepend-icon="mdi-printer"
                  :disabled="selectedForums.length === 0"
                  @click="printForumPlacards"
                  >Print forum placards</v-btn
                >
              </v-row>

              <h3 class="mt-10">Plenaries</h3>

              <v-list lines="one" v-model:selected="selectedPlenaries" select-strategy="leaf">
                <v-list-item
                  density="compact"
                  v-for="plenary in plenariesStore.plenaries"
                  :key="plenary.id"
                  :title="`${plenary.name} (${plenary.abbreviation})`"
                  :value="plenary.id"
                  color="primary"
                >
                  <template v-slot:prepend="{ isSelected, select }">
                    <v-list-item-action start>
                      <v-checkbox-btn
                        :model-value="isSelected"
                        @update:model-value="select"
                      ></v-checkbox-btn>
                    </v-list-item-action>
                  </template>

                  <template v-slot:append>
                    <v-icon end>mdi-account-tie</v-icon>

                    {{
                      new Set(
                        delegatesStore.delegates
                          .filter((delegate) =>
                            forumsStore.forums.some(
                              (forum) =>
                                forum.plenary === plenary.id && forum.id === delegate.forum,
                            ),
                          )
                          .map((delegate) => delegate.represents)
                          .filter((represents) => represents != null),
                      ).size
                    }}
                    <v-badge
                      location="center right"
                      color="success"
                      :content="
                        new Set(
                          delegatesStore.delegates
                            .filter(
                              (delegate) =>
                                forumsStore.forums.some(
                                  (forum) =>
                                    forum.plenary === plenary.id && forum.id === delegate.forum,
                                ) &&
                                ['member state', 'former member state'].includes(
                                  memberOrganizationsStore.member_organizations.find(
                                    (org) => org.id === delegate.represents,
                                  )?.status,
                                ),
                            )
                            .map((delegate) => delegate.represents)
                            .filter((represents) => represents != null),
                        ).size
                      "
                    >
                      <v-icon start color="success">mdi-vote</v-icon>
                    </v-badge>

                    <v-badge
                      location="center right"
                      color="error"
                      :content="
                        new Set(
                          delegatesStore.delegates
                            .filter(
                              (delegate) =>
                                forumsStore.forums.some(
                                  (forum) =>
                                    forum.plenary === plenary.id && forum.id === delegate.forum,
                                ) &&
                                !['member state', 'former member state'].includes(
                                  memberOrganizationsStore.member_organizations.find(
                                    (org) => org.id === delegate.represents,
                                  )?.status,
                                ),
                            )
                            .map((delegate) => delegate.represents)
                            .filter((represents) => represents != null),
                        ).size
                      "
                    >
                      <v-icon start color="error">mdi-vote</v-icon>
                    </v-badge>
                  </template>
                </v-list-item>
              </v-list>

              <v-row no-gutters class="justify-center">
                <v-btn
                  id="submit-btn"
                  color="primary"
                  prepend-icon="mdi-printer"
                  :disabled="selectedPlenaries.length === 0"
                  @click="printPlenaryPlacards"
                  >Print plenary placards</v-btn
                >
              </v-row>
            </v-card-text>
          </v-card>
        </v-col>
        <v-col cols="12" md="6">
          <v-card title="Others" class="h-100" style="overflow-y: scroll">
            <v-card-text>
              Student officers and executives receive placards with their position and name. These
              placards are used to identify the student officers and executives during the
              conference sessions and are usually placed on the tables in front of them in their
              forum, a plenary or a ceremony.

              <v-list lines="two">
                <v-list-item
                  title="Student Officers"
                  prepend-icon="mdi-account-settings"
                  subtitle="Sorted by forum"
                >
                  <template v-slot:append>
                    <v-btn
                      @click="printPlacard('student_officer_placards')"
                      target="_blank"
                      variant="tonal"
                      color="primary"
                      title="Print Student Officer Placards"
                      prepend-icon="mdi-printer"
                      class="mr-10"
                    >
                      DIN A4
                    </v-btn>

                    <v-btn
                      @click="printPlacard('student_officer_placards', 'A3')"
                      target="_blank"
                      variant="flat"
                      color="primary"
                      title="Print Student Officer Placards"
                      prepend-icon="mdi-printer"
                    >
                      DIN A3
                    </v-btn>
                  </template>
                </v-list-item>

                <v-list-item
                  title="Executives"
                  prepend-icon="mdi-account-settings"
                  subtitle="Sorted by position"
                >
                  <template v-slot:append>
                    <v-btn
                      @click="printPlacard('executive_placards')"
                      target="_blank"
                      variant="tonal"
                      color="primary"
                      title="Print Executive Placards"
                      prepend-icon="mdi-printer"
                      class="mr-10"
                    >
                      DIN A4
                    </v-btn>

                    <v-btn
                      @click="printPlacard('executive_placards', 'A3')"
                      target="_blank"
                      variant="flat"
                      color="primary"
                      title="Print Executive Placards"
                      prepend-icon="mdi-printer"
                    >
                      DIN A3
                    </v-btn>
                  </template>
                </v-list-item>
              </v-list>

              <h3 class="mt-10">Openings and Closing Ceremony</h3>

              For the opening and closing ceremony, each represented member organization receives a
              placard with the organization's name. These placards are used to organize the seating
              arrangement and to identify the member organizations during the ceremonies. They are
              not intended for regular conference sessions but can be used for delegation photos and
              to mark the seats of the delegations during the ceremonies.

              <v-list lines="two">
                <v-list-item
                  title="Opening and Closing Ceremony"
                  prepend-icon="mdi-account-group"
                  subtitle="Sorted by member organization's official names"
                >
                  <template v-slot:append>
                    <v-btn
                      @click="printPlacard('delegate_placards_ceremony')"
                      target="_blank"
                      variant="tonal"
                      color="primary"
                      title="Print Ceremony Placards"
                      prepend-icon="mdi-printer"
                      class="mr-10"
                    >
                      DIN A4
                    </v-btn>

                    <v-btn
                      @click="printPlacard('delegate_placards_ceremony', 'A3')"
                      target="_blank"
                      variant="flat"
                      color="primary"
                      title="Print Ceremony Placards"
                      prepend-icon="mdi-printer"
                    >
                      DIN A3
                    </v-btn>
                  </template>
                </v-list-item>
              </v-list>

              <h3 class="mt-10">Custom Placard</h3>

              On special occasions, custom placards can be generated, for example for guests,
              sponsors etc. If you leave the position field empty, only the name will be printed on
              the placard as for delegates. If you enter a position, an organizer style placard will
              be generated.

              <v-form v-model="valid" validate-on="blur" @submit.prevent="printCustomPlacard">
                <v-container fluid>
                  <v-col md="6">
                    <v-row no-gutters>
                      <v-text-field
                        label="Position"
                        hint="Position name"
                        prepend-icon="mdi-account-tie"
                        color="primary"
                        v-model="position"
                        :rules="rules.position"
                        density="compact"
                      >
                      </v-text-field>
                    </v-row>
                    <v-row no-gutters="">
                      <v-text-field
                        label="Name"
                        hint="Given and family name"
                        prepend-icon="mdi-account"
                        color="primary"
                        v-model="name"
                        :rules="rules.name"
                        density="compact"
                      >
                      </v-text-field>
                    </v-row>
                    <v-row no-gutters>
                      <v-input
                        prepend-icon="mdi-book-open-page-variant"
                        hint="Select a page size"
                        label="Page size"
                      >
                        <v-btn-toggle
                          v-model="page_size"
                          color="primary"
                          variant="outlined"
                          density="compact"
                          divided
                        >
                          <v-btn value="A4">
                            <v-icon start>mdi-view-grid-outline</v-icon>
                            DIN A4
                          </v-btn>

                          <v-btn value="A3">
                            <v-icon start>mdi-tag</v-icon>
                            DIN A3
                          </v-btn>
                        </v-btn-toggle>
                      </v-input>
                    </v-row>

                    <v-row no-gutters class="justify-center">
                      <v-btn
                        id="submit-btn"
                        color="primary"
                        prepend-icon="mdi-printer"
                        :disabled="!valid"
                        @click="printCustomPlacard"
                        >Print custom placard</v-btn
                      >
                    </v-row>
                  </v-col>
                </v-container>
              </v-form>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
    </v-container>

    <p></p>
  </div>
</template>

<style>
.v-badge {
  margin: 0px 20px;
}
</style>
