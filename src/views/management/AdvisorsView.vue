<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
const router = useRouter();
const origin = window.location.origin;
import { useAdvisorsStore } from "../../stores/advisors";
import { sortParticipantsByName } from "../../stores/participants";
import ConsentDisplay from "../../components/displays/ConsentDisplay.vue";
import BadgePhotoDisplay from "../../components/displays/BadgePhotoDisplay.vue";
import CarIcon from "../../components/icons/CarIcon.vue";
import MediaConsentIcon from "../../components/icons/MediaConsentIcon.vue";
import ExtraInformationIcon from "../../components/icons/ExtraInformationIcon.vue";
import MobilePhoneIcon from "../../components/icons/MobilePhoneIcon.vue";
import MailIcon from "../../components/icons/MailIcon.vue";
import ParticipantDisplay from "../../components/displays/ParticipantDisplay.vue";
import ConfirmDialog from "../../components/dialogs/ConfirmDialog.vue";
import LinkIcon from "../../components/icons/LinkIcon.vue";

const advisorsStore = useAdvisorsStore();
advisorsStore.getAdvisors();

const deleteDialog = ref(null);
const search = ref("");
const expanded = ref([]);

const headers = [
  { title: "", key: "data-table-expand", sortable: false },
  {
    title: "Name",
    align: "start",
    sortable: true,
    key: "name",
    sortRaw: sortParticipantsByName,
  },
  {
    title: "Position",
    align: "start",
    sortable: true,
    key: "position_name",
  },
  {
    title: "E-Mail",
    align: "center",
    key: "email",
    sortable: false,
  },
  {
    title: "Mobile",
    align: "center",
    key: "mobile",
    sortable: false,
  },
  {
    title: "Availability",
    align: "center",
    key: "availability",
    sortable: false,
  },
  {
    title: "Experience",
    align: "center",
    key: "experience",
    sortable: false,
  },
  {
    title: "Help",
    align: "center",
    key: "help",
    sortable: false,
  },
  {
    title: "Icons",
    align: "start",
    key: "icons",
    sortable: false,
  },
  {
    title: "Actions",
    key: "actions",
    sortable: false,
  },

  // { text: "", value: "data-table-select" },
];

const custom_filter = function (value, query, item) {
  // searches all attributes of the item (not only the columns) and related objects if they contain the query
  if (!item || !query) return false;

  const searchFields = [...Object.values(item.raw)];

  return searchFields.some((field) =>
    String(field).toLowerCase().includes(query.toLowerCase()),
  );
};

const deleteAdvisor = function (advisor_id) {
  deleteDialog.value = advisor_id;
};

const confirmedDeleteAdvisor = function () {
  advisorsStore.deleteAdvisor(deleteDialog.value);
  deleteDialog.value = false;
};
</script>

<template>
  <div class="">
    <v-row>
      <v-col cols="10">
        <v-breadcrumbs :items="[{ title: 'Advisors' }]">
          <template v-slot:prepend>
            <v-icon
              icon="mdi-account-star"
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
        </v-breadcrumbs>
      </v-col>
      <v-col cols="2" style="display: flex">
        <router-link
          :to="{
            name: 'advisor-registration',
            params: { advisor_id: 'add' },
          }"
          target="_blank"
          rel="noopener noreferrer"
        >
          <v-fab
            color="primary"
            rounded
            style="justify-content: end"
            prepend-icon="mdi-plus"
            text="add new advisor"
          >
          </v-fab>
        </router-link>
      </v-col>
    </v-row>

    <v-data-table-virtual
      v-if="advisorsStore.advisors"
      :headers="headers"
      :items="advisorsStore.advisors"
      item-key="id"
      items-per-page="-1"
      items-per-page-text="Advisors per page"
      hover
      :loading="advisorsStore.loading ? 'primary' : false"
      fixed-header
      :search="search"
      :sort-by="[{ key: 'name', order: 'desc' }]"
      :multi-sort="true"
      v-model:expanded="expanded"
      hide-default-footer
      :custom-filter="custom_filter"
      item-height="56"
      height="calc(100vh - 160px)"
    >
      <template v-slot:loading>
        <v-skeleton-loader type="table-row@20"></v-skeleton-loader>
      </template>
      <template v-slot:item="{ item, internalItem, toggleExpand, isExpanded }">
        <tr>
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
            <ParticipantDisplay
              :first_name="item.first_name"
              :last_name="item.last_name"
              :pronouns="item.pronouns"
              :gender="item.gender"
            >
            </ParticipantDisplay>
          </td>

          <td>
            <v-chip variant="outlined"> Conference Advisor </v-chip>
          </td>
          <td class="center">
            <MailIcon :email="item.email"></MailIcon>
          </td>

          <td class="center">
            <MobilePhoneIcon :mobile="item.mobile"></MobilePhoneIcon>
          </td>

          <td class="center">
            <v-icon
              v-if="item.availability"
              @click.stop="toggleExpand(internalItem)"
              color="primary"
              :title="'Click to show information in expanded row'"
              >mdi-hours-24</v-icon
            >
          </td>

          <td class="center">
            <v-icon
              v-if="item.experience"
              @click.stop="toggleExpand(internalItem)"
              color="primary"
              :title="'Click to show information in expanded row'"
              >mdi-card-account-details-star</v-icon
            >
          </td>

          <td class="center">
            <v-icon
              v-if="item.help.length > 0"
              @click.stop="toggleExpand(internalItem)"
              color="primary"
              :title="'Click to show information in expanded row'"
              >mdi-handshake</v-icon
            >
          </td>

          <td>
            <CarIcon :car="item.car"></CarIcon>
            <MediaConsentIcon
              :media_consent_time="item.media_consent_time"
            ></MediaConsentIcon>

            <ExtraInformationIcon :extras="item.extras"></ExtraInformationIcon>
          </td>

          <td>
            <LinkIcon
              :link="`${origin}${
                router.resolve({
                  name: 'advisor-registration',
                  params: { advisor_id: item.id },
                }).path
              }`"
            ></LinkIcon>
            <v-btn
              variant="plain"
              icon="mdi-pencil"
              :to="{
                name: 'advisor-detail',
                params: { advisor_id: item.id },
              }"
            >
            </v-btn>
            <v-btn
              variant="plain"
              icon="mdi-delete"
              @click.stop="deleteAdvisor(item.id)"
            >
            </v-btn>
          </td>
        </tr>
      </template>

      <template v-slot:expanded-row="{ columns, item }">
        <tr>
          <td :colspan="columns.length">
            <div style="flex: 1; padding: 16px 0px">
              <v-row>
                <v-col cols="12">
                  <v-icon color="primary" start>mdi-hours-24</v-icon>
                  <span
                    ><b>Availability: </b>
                    {{ item.availability || "Not provided" }}</span
                  >
                </v-col>
                <v-col cols="12">
                  <v-icon color="primary" start
                    >mdi-card-account-details-star</v-icon
                  >
                  <span
                    ><b>Experience: </b
                    >{{ item.experience || "Not provided" }}</span
                  >
                </v-col>
                <v-col cols="12">
                  <v-icon color="primary" start>mdi-handshake</v-icon>
                  <span>
                    <b>Help Areas: </b>
                    <span
                      v-if="item.help.length > 0"
                      style="display: inline-flex; flex-wrap: wrap; gap: 8px"
                    >
                      <v-chip
                        v-for="(helpItem, index) in item.help"
                        :key="index"
                        color="primary"
                        text-color="white"
                      >
                        {{ helpItem }}
                      </v-chip>
                    </span>

                    <span v-else> Not provided </span>
                  </span>
                </v-col>
              </v-row>
            </div>

            <v-divider></v-divider>

            <div style="display: flex; gap: 16px">
              <div style="flex: 1">
                <BadgePhotoDisplay :picture="item.picture"></BadgePhotoDisplay>
              </div>

              <div style="flex: 2; padding: 16px">
                <ConsentDisplay
                  :data_consent_time="item.data_consent_time"
                  :data_consent_ip="item.data_consent_ip"
                  :media_consent_time="item.media_consent_time"
                  :media_consent_ip="item.media_consent_ip"
                ></ConsentDisplay>
              </div>
            </div>
          </td>
        </tr>
      </template>
    </v-data-table-virtual>

    <ConfirmDialog
      :model="deleteDialog"
      title="Confirm Delete"
      text="Are you sure you want to delete this Advisor?"
      @ok-clicked="
        confirmedDeleteAdvisor(
          advisorsStore.advisors.filter(
            (advisor) => advisor.id == deleteDialog.value,
          ).id,
        )
      "
      @cancel-clicked="deleteDialog.value = false"
    ></ConfirmDialog>
  </div>
</template>

<style>
.hidden {
  visibility: hidden;
}

h3 {
  margin-top: 8px;
}

.center {
  text-align: center;
}

.v-table > .v-table__wrapper > table > tbody > tr > td {
  padding: 0 4px;
}
</style>
