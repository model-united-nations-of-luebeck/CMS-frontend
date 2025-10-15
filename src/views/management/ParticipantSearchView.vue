<script setup>
import { ref } from "vue";
import { useParticipantsStore, getAge } from "../../stores/participants";
import MailIcon from "../../components/icons/MailIcon.vue";
import MobilePhoneIcon from "../../components/icons/MobilePhoneIcon.vue";

const search = ref(null);
const participantsStore = useParticipantsStore();
participantsStore.getParticipants();

const transformRole = (role) => {
  const roleDict = {
    delegate: "Delegate",
    mun_director: "MUN-Director",
    staff: "Staff",
    executive: "Executive",
    "student officer": "Student Officer",
    advisor: "Advisor",
  };
  return roleDict[role] || role;
};

const roleIcon = (role) => {
  const roleDict = {
    delegate: "mdi-account-tie",
    mun_director: "mdi-school",
    staff: "mdi-account",
    executive: "mdi-account-settings",
    "student officer": "mdi-account-settings",
    advisor: "mdi-account-star",
  };
  return roleDict[role] || "mdi-account";
};

const genderText = (gender) => {
  const genderMap = {
    m: "Male",
    f: "Female",
    o: "Diverse",
  };
  return genderMap[gender] || "N/A";
};
</script>

<template>
  <div class="">
    <v-sheet max-width="800" style="display: block; margin: 0 auto">
      <v-autocomplete
        v-model="search"
        :items="participantsStore?.participants"
        :item-title="(item) => `${item.first_name} ${item.last_name}`"
        item-value="id"
        label="Search participants"
        placeholder="Search by name or role"
        clearable
        persistent-clear
        class="mb-4"
        rounded="pill"
        variant="outlined"
        prepend-inner-icon="mdi-magnify"
        :custom-filter="
          (itemText, queryText, item) => {
            // allow searching by first name, last name, or role
            const q = queryText.toLowerCase();
            return (
              item.raw?.first_name?.toLowerCase().includes(q) ||
              item.raw?.last_name?.toLowerCase().includes(q) ||
              item.raw?.role?.toLowerCase().includes(q)
            );
          }
        "
      >
        <template v-slot:item="{ props, item }">
          <v-list-item
            v-bind="props"
            tile
            :append-avatar="item.raw.picture"
            :prepend-icon="roleIcon(item.raw.role)"
            :subtitle="transformRole(item.raw.role)"
            :title="`${item.raw.first_name} ${item.raw.last_name}`"
          ></v-list-item>
          <v-divider></v-divider>
        </template>
      </v-autocomplete>

      <template v-if="search">
        <v-card
          v-for="p in [
            participantsStore?.participants.find((p) => p.id === search),
          ]"
          :key="p?.id"
          class="mb-2"
          :title="`${p?.first_name} ${p?.last_name}`"
          :subtitle="transformRole(p?.role)"
        >
          <template v-slot:append>
            <v-icon size="x-large" color="grey" start>{{
              roleIcon(p?.role)
            }}</v-icon>
          </template>
          <v-card-text>
            <v-container>
              <v-row no-gutters>
                <v-col cols="12" sm="6" class="center">
                  <v-img
                    v-if="p?.picture"
                    :src="p?.picture"
                    max-width="300"
                    class="mb-4 ma-4"
                  ></v-img>
                </v-col>
                <v-col cols="12" sm="6">
                  <v-list>
                    <v-list-item>
                      <template v-slot:prepend>
                        <MailIcon :email="p?.email"></MailIcon>
                      </template>
                      <strong> Email:</strong>
                      {{ p?.email }}
                    </v-list-item>
                    <v-list-item>
                      <template v-slot:prepend>
                        <MobilePhoneIcon :mobile="p?.mobile"></MobilePhoneIcon>
                      </template>
                      <strong> Mobile:</strong>
                      {{ p?.mobile }}
                    </v-list-item>
                    <v-list-item :prepend-icon="'mdi-cake'" v-if="p?.birthday">
                      <strong> Birthday:</strong>
                      {{
                        p?.birthday
                          ? new Date(p.birthday).toLocaleDateString()
                          : "N/A"
                      }}
                      ({{ getAge(p?.birthday) }} years old)
                    </v-list-item>
                    <v-list-item :prepend-icon="'mdi-hand-wave'">
                      <strong> Pronouns:</strong> {{ p?.pronouns || "N/A" }}
                    </v-list-item>
                    <v-list-item :prepend-icon="'mdi-human-greeting-variant'">
                      <strong> Gender:</strong> {{ genderText(p?.gender) }}
                    </v-list-item>
                    <v-list-item :prepend-icon="'mdi-information-variant'">
                      <strong> Extras:</strong> {{ p?.extras || "N/A" }}
                    </v-list-item>
                  </v-list>
                </v-col>
              </v-row>
            </v-container>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn
              color="primary"
              :to="{
                name:
                  p?.role == 'mun_director'
                    ? 'mun-director-detail'
                    : p?.role + '-detail',
                params: { [p?.role + '_id']: p?.id },
              }"
              text="View More Details"
              prepend-icon="mdi-arrow-right"
              append-icon="mdi-eye"
              variant="tonal"
            ></v-btn>
            <v-spacer></v-spacer>
          </v-card-actions>
        </v-card>
      </template>
    </v-sheet>
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
