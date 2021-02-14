<template>
  <div>
    <v-container>
      <v-list avatar subtitle>
        <v-list-item-group color="primary">
          <v-list-item
            v-for="organization in this.filteredMemberOrganizations"
            :key="organization.id"
          >
            <v-list-item-avatar v-if="organization.flag">
              <v-img
                :src="organization.flag"
                :class="{ grayscale: !organization.active }"
              ></v-img>
            </v-list-item-avatar>
            <v-list-item-content>
              <v-list-item-title>{{ organization.name }}</v-list-item-title>
              <v-list-item-subtitle>{{
                organization.official_name
              }}</v-list-item-subtitle>
            </v-list-item-content>
            <v-list-item-content style="display: inline;">
              <v-chip v-if="organization.active">
                <v-icon left>
                  mdi-tag
                </v-icon>
                {{ organization.placard_name }}
              </v-chip>
            </v-list-item-content>
            <v-spacer />
            <v-list-item-content style="display: inline;">
              <v-chip>
                <v-icon left>
                  mdi-shield-star-outline
                </v-icon>
                {{ organization.status }}
              </v-chip>
            </v-list-item-content>
            <v-list-item-action>
              <v-switch v-model="organization.active"></v-switch>
            </v-list-item-action>
          </v-list-item>
        </v-list-item-group>
      </v-list>
    </v-container>

    <v-navigation-drawer
      right
      fixed
      expand-on-hover
      width="250px"
      v-model="drawer"
      style="padding-top: 64px; z-index: 5;"
      class="elevation-4"
    >
      <v-list>
        <v-list-item>
          <v-list-item-action>
            <v-icon>mdi-magnify</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-text-field
              v-model="search"
              flat
              hide-details
              label="Search"
              solo-inverted
            ></v-text-field>
          </v-list-item-content>
        </v-list-item>
        <v-list-item>
          <v-list-item-action>
            <v-icon>mdi-filter</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <template v-for="(orga, index) in getStatusOptions()">
              <v-checkbox
                hide-details
                v-model="selectedStatus"
                :label="orga"
                :value="orga"
                :key="index"
              ></v-checkbox>
            </template>
            <v-btn color="primary" small @click="selectedStatus = []"
              >deselect all</v-btn
            >
            <v-btn
              color="primary"
              small
              @click="selectedStatus = getStatusOptions()"
              >select all</v-btn
            >
          </v-list-item-content>
        </v-list-item>
      </v-list>

      <v-list>
        <v-list-item link>
          <v-list-item-action>
            <v-icon>mdi-printer</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title>Print</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
        <v-list-item link>
          <v-list-item-action>
            <v-icon>mdi-export</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title>Export</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>
  </div>
</template>

<script>
export default {
  name: "MemberOrganizations",

  data: () => ({
    memberOrganizations: [],
    search: "",
    selectedStatus: [],
    drawer: "",
  }),
  async mounted() {
    try {
      const { data } = await this.$http.get(
        "https://munoltom.pythonanywhere.com/api/member-organizations/",
      );
      this.memberOrganizations = data;
      this.selectedStatus = this.getStatusOptions();
    } catch (error) {
      alert(error);
    }
  },
  methods: {
    getStatusOptions() {
      //returns an unique array of all available status options of the fetched member organizations
      return this.memberOrganizations
        .map((member) => member.status)
        .filter((v, i, a) => a.indexOf(v) === i);
    },
  },
  computed: {
    filteredMemberOrganizations() {
      return this.memberOrganizations.filter((organization) => {
        return (
          (organization.name
            .toLowerCase()
            .includes(this.search.toLowerCase()) ||
            organization.official_name
              .toLowerCase()
              .includes(this.search.toLowerCase()) ||
            organization.placard_name
              .toLowerCase()
              .includes(this.search.toLowerCase())) &&
          this.selectedStatus.includes(organization.status)
        );
      });
    },
  },
};
</script>

<style>
.grayscale {
  filter: gray; /* IE6-9 */
  -webkit-filter: grayscale(1); /* Google Chrome, Safari 6+ & Opera 15+ */
  filter: grayscale(1); /* Microsoft Edge and Firefox 35+ */
}

.v-btn {
  margin: 10px 0px;
}

.v-navigation-drawer__content {
  display: grid;
  align-content: space-between;
}
</style>
