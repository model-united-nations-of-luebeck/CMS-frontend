<script setup>
import { useSchoolsStore } from "../../stores/schools";
import { useDelegatesStore } from "../../stores/delegates";
import { useMemberOrganizationsStore } from "../../stores/member_organizations";
import { useForumsStore } from "../../stores/forums";
import { ref, computed, watch } from "vue";

const schoolsStore = useSchoolsStore();
schoolsStore.getSchools();
const delegatesStore = useDelegatesStore();
delegatesStore.getDelegates();
const memberOrganizationsStore = useMemberOrganizationsStore();
memberOrganizationsStore.getMemberOrganizations();
const forumsStore = useForumsStore();
forumsStore.getForums();

const props = defineProps({
  modelValue: { type: Boolean, required: true },
  organization: Number,
});

const emit = defineEmits(["update:modelValue"]);

const expansion = ref([0]);

watch(
  // Check if multiple schools are assigned to the organization, then open expansion panel
  () =>
    delegatesStore.delegates
      ?.filter((delegate) => delegate.represents === props.organization)
      .map((delegate) => delegate.school)
      .filter((school, i, arr) => arr.indexOf(school) === i).length > 1,
  (newVal) => {
    if (newVal) {
      expansion.value = [0]; // Open the first panel if multiple schools are assigned
    } else {
      expansion.value = []; // Close all panels if only one school is assigned
    }
  },
  { immediate: true },
);

// Create a writable computed proxy
const localModel = computed({
  get: () => props.modelValue,
  set: (value) => emit("update:modelValue", value),
});
</script>

<template>
  <v-dialog max-width="800" v-model="localModel">
    <v-card title="Delegation School Assignment">
      <v-card-text>
        <div v-if="props.organization">
          <p>
            Handle the assignment of all
            {{
              delegatesStore.delegates.filter(
                (delegate) => delegate.represents === props.organization,
              ).length
            }}
            delegates of the
            <b>{{
              memberOrganizationsStore.member_organizations.find(
                (org) => org.id === props.organization,
              )?.official_name
            }}</b>
            to a school.
          </p>
          <br />

          <v-row class="mb-2" justify="space-around" align="center">
            <v-col cols="5">
              <v-btn
                color="error"
                variant="outlined"
                prepend-icon="mdi-cancel"
                :disabled="
                  delegatesStore.delegates
                    .filter((delegate) => delegate.represents === props.organization)
                    .every((delegate) => delegate.school == null)
                "
                @click="
                  delegatesStore.delegates
                    .filter((delegate) => delegate.represents === props.organization)
                    .forEach((delegate) => {
                      delegatesStore.assignSchool(delegate.id, null);
                    })
                "
              >
                Unassign all delegates
              </v-btn>
            </v-col>
            <v-col cols="7">
              <span
                v-if="
                  delegatesStore.delegates
                    .filter((delegate) => delegate.represents === props.organization)
                    .map((delegate) => delegate.school)
                    .filter((school, i, arr) => arr.indexOf(school) === i).length > 1
                "
                class="text-warning"
              >
                Delegates are assigned to different schools or unassigned. Please conduct individual
                assignments.
              </span>
              <v-select
                v-else
                variant="outlined"
                prepend-inner-icon="mdi-bank"
                hide-details
                item-title="name"
                item-value="id"
                :model-value="
                  delegatesStore.delegates.find((d) => d.represents === props.organization)?.school
                "
                :items="schoolsStore.schools"
                label="Assigned school"
                placeholder="Select a school to assign all delegates to"
                density="compact"
                @update:model-value="
                  (val) =>
                    delegatesStore.delegates
                      .filter((delegate) => delegate.represents === props.organization)
                      .forEach((delegate) => {
                        delegatesStore.assignSchool(delegate.id, val);
                      })
                "
              >
                <template v-slot:item="{ props, item }">
                  <v-list-item v-bind="props">
                    <v-list-item-subtitle>
                      <span
                        :style="{
                          color:
                            item.raw.requested <=
                            delegatesStore.delegates.filter(
                              (delegate) => delegate.school == item.id,
                            ).length
                              ? 'green'
                              : 'red',
                        }"
                      >
                        {{
                          item.raw.requested
                            ? `Requested: ${item.raw.requested} / Assigned: ${
                                delegatesStore.delegates.filter(
                                  (delegate) => delegate.school == item.id,
                                ).length
                              }`
                            : ""
                        }}
                      </span>
                    </v-list-item-subtitle>
                  </v-list-item>
                  <v-divider></v-divider>
                </template>
              </v-select>
            </v-col>
          </v-row>

          <v-expansion-panels elevation="1" v-model="expansion">
            <v-expansion-panel>
              <v-expansion-panel-title>
                <v-icon start>mdi-gesture-double-tap</v-icon>

                Individual Delegate Assignment
              </v-expansion-panel-title>
              <v-expansion-panel-text>
                <v-row
                  v-for="delegate in delegatesStore.delegates
                    .filter((d) => d.represents === props.organization)
                    .sort((a, b) => a.forum > b.forum)"
                  :key="delegate.id"
                  class="mb-2"
                  justify="space-around"
                  align="center"
                >
                  <v-col cols="2">
                    <v-icon start>mdi-forum</v-icon>
                    <b>{{
                      forumsStore.forums.find((f) => f.id === delegate.forum)?.abbreviation ||
                      "No forum assigned"
                    }}</b>
                  </v-col>
                  <v-col cols="3">
                    <v-btn
                      color="error"
                      variant="outlined"
                      prepend-icon="mdi-cancel"
                      size="small"
                      :disabled="!delegate.school"
                      @click="delegatesStore.assignSchool(delegate.id, null)"
                    >
                      Unassign
                    </v-btn>
                  </v-col>
                  <v-col cols="6">
                    <v-select
                      variant="outlined"
                      prepend-inner-icon="mdi-bank"
                      hide-details
                      :model-value="delegate.school"
                      :items="schoolsStore.schools"
                      item-title="name"
                      item-value="id"
                      label="School"
                      density="compact"
                      @update:model-value="(val) => delegatesStore.assignSchool(delegate.id, val)"
                    >
                      <template v-slot:item="{ props, item }">
                        <v-list-item v-bind="props">
                          <v-list-item-subtitle>
                            <span
                              :style="{
                                color:
                                  item.raw.requested <=
                                  delegatesStore.delegates.filter(
                                    (delegate) => delegate.school == item.id,
                                  ).length
                                    ? 'green'
                                    : 'red',
                              }"
                            >
                              {{
                                item.raw.requested
                                  ? `Requested: ${item.raw.requested} / Assigned: ${
                                      delegatesStore.delegates.filter(
                                        (delegate) => delegate.school == item.id,
                                      ).length
                                    }`
                                  : ""
                              }}
                            </span>
                          </v-list-item-subtitle>
                        </v-list-item>
                        <v-divider></v-divider>
                      </template>
                    </v-select>
                  </v-col>
                </v-row>
              </v-expansion-panel-text>
            </v-expansion-panel>
          </v-expansion-panels>
        </div>
      </v-card-text>

      <v-card-actions>
        <v-spacer></v-spacer>

        <v-btn text="Close" @click="localModel = false"></v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<style scoped>
h4 {
  margin: 8px 0px;
}
</style>
