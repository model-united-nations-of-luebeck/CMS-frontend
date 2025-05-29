<script setup>
import { useRoute } from "vue-router";
import { toast } from "vue3-toastify";
import "vue3-toastify/dist/index.css";
import { useSchoolsStore } from "../../stores/schools";
import { useMUNDirectorsStore } from "../../stores/mun_directors";
import { useDelegatesStore } from "../../stores/delegates";
import { useMemberOrganizationsStore } from "../../stores/member_organizations";
import { useForumsStore } from "../../stores/forums";
import { useDisplay } from "vuetify";
const { mobile } = useDisplay();

const route = useRoute();

const schoolsStore = useSchoolsStore();
schoolsStore.getSchool(route.params.school_id);
const munDirectorsStore = useMUNDirectorsStore();
munDirectorsStore.getMUNDirectors();
const delegatesStore = useDelegatesStore();
delegatesStore.getDelegates();
const forumsStore = useForumsStore();
forumsStore.getForums();
const memberOrganizationsStore = useMemberOrganizationsStore();
memberOrganizationsStore.getMemberOrganizations();

const onCopy = () => {
  toast.success("Registration link was copied successfully", {
    position: toast.POSITION.BOTTOM_CENTER,
    style: "width: auto",
  });
};

const onError = (e) => {
  toast.error("Copying registration link failed" + e.text, {
    position: toast.POSITION.BOTTOM_CENTER,
  });
};

const deleteMUNDirector = (director_id) => {
  munDirectorsStore.deleteMUNDirector(director_id);
};

const addMUNDirector = () => {
  munDirectorsStore.createEmptyMUNDirectorForSchool(route.params.school_id);
};

/**
 * Retrieves unique member organizations from the delegates of the school specified via route parameter.
 *
 * @returns {Array} An array of member organizations.
 */
const getUniqueMemberOrganizationsFromSchool = () => {
  // Filter delegates based on the school ID and retrieve the represents property.
  const representsList = delegatesStore.delegates
    .filter((delegate) => delegate.school == route.params.school_id)
    .map((delegate) => delegate.represents);

  // Remove duplicate represents values using Set and convert it back to an array.
  const uniqueRepresentsList = [...new Set(representsList)];

  // Find the member organizations that match the represents values.
  const memberOrganizations = uniqueRepresentsList.map((represents) => {
    return memberOrganizationsStore.member_organizations.find(
      (org) => org.id === represents,
    );
  });

  return memberOrganizations;
};
</script>

<template>
  <div class="final-registration">
    <v-sheet
      id="sheet"
      :elevation="mobile ? 0 : 2"
      :rounded="mobile ? false : 'lg'"
    >
      <v-btn
        variant="plain"
        prepend-icon="mdi-arrow-left"
        :to="`/registration/${route.params.school_id}`"
        >Back to registration overview</v-btn
      >

      <h1 class="py-6">Final Registration</h1>

      <p>
        Dear MUN-Director, <br />

        Country Allocations have been done. We can confirm that you can bring
        <b>{{
          delegatesStore.delegates.filter(
            (delegate) => delegate.school == route.params.school_id,
          ).length
        }}</b>
        students. Your school is representing the following member
        organisations:
        <b>{{
          getUniqueMemberOrganizationsFromSchool()
            .map((org) => org.official_name)
            .join(", ")
            .replace(
              /,([^,]*)$/,
              " and$1",
            ) /* Gets a set of all unique member organizations which are represented by the delegates of a school. The official names of these member organizations are listed separated by commas, but the last comma is replaced with 'and' */
        }}</b
        >. In the final registration we ask you, your fellow MUN-Directors as
        well as your students to fill in forms. This data is required to
        organize the conference. For each participant you have an unique
        registration link. Forward this to the delegate/colleague, so that they
        can provide their information. Once they've done it, their information
        shows up here. Please don't hesitate contacting the Conference Managers
        in case you have any questions
        <a href="mailto:conferencemanager@munol.org"
          >conferencemanager@munol.org</a
        >.
      </p>

      <h2>MUN-Directors</h2>

      <v-table hover>
        <thead>
          <tr>
            <th class="text-left">Name</th>
            <th class="text-left">Registration Link</th>
            <th class="text-left">Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="director in munDirectorsStore.mun_directors.filter(
              (director) => director.school == route.params.school_id,
            )"
            :key="director.id"
          >
            <td>
              <v-icon start>mdi-account</v-icon>{{ director.first_name }}
              {{ director.last_name }}
            </td>
            <td>
              <Router-Link
                class="link"
                target="_blank"
                :to="{
                  name: 'final-registration-mun-director',
                  params: { mun_director_id: director.id },
                }"
                >{{
                  this.$router.resolve({
                    name: "final-registration-mun-director",
                    params: { mun_director_id: director.id },
                  }).href
                }}</Router-Link
              >

              <v-btn
                v-tooltip:bottom-center="
                  'Click to copy registration link into your clipboard'
                "
                rounded
                variant="tonal"
                density="comfortable"
                prepend-icon="mdi-content-copy"
                v-clipboard:copy="
                  `${
                    this.$router.resolve({
                      name: 'final-registration-mun-director',
                      params: { mun_director_id: director.id },
                    }).href
                  }`
                "
                v-clipboard:success="onCopy"
                v-clipboard:error="onError"
              >
                Copy link
              </v-btn>
            </td>
            <td>
              <v-btn
                v-tooltip:bottom-center="'Click to remove this MUN-Director'"
                density="comfortable"
                rounded
                variant="outlined"
                prepend-icon="mdi-account-minus"
                color="red"
                @click="deleteMUNDirector(director.id)"
              >
                Remove this MUN-Director
              </v-btn>
            </td>
          </tr>
        </tbody>

        <tfoot>
          <tr>
            <td></td>
            <td></td>
            <td>
              <v-btn
                v-tooltip:bottom-center="'Click to add another MUN-Director'"
                rounded
                density="comfortable"
                color="green"
                prepend-icon="mdi-account-plus"
                @click="addMUNDirector"
                >Add additional MUN-Director</v-btn
              >
            </td>
          </tr>
        </tfoot>
      </v-table>

      <h2>Delegates</h2>

      <div
        class="delegation"
        v-for="org in getUniqueMemberOrganizationsFromSchool()"
        :key="org.id"
      >
        <v-container>
          <v-row justify="space-between">
            <v-col cols="4">
              <h3>
                <v-avatar :image="org.flag"></v-avatar>
                {{ org.official_name }}
              </h3>
            </v-col>
            <v-col cols="6" align="right">
              <v-btn
                color="primary"
                variant="outlined"
                @click="console.log('ambassador')"
              >
                <v-icon start>mdi-account-star</v-icon>
                Select ambassador for {{ org.name }}
              </v-btn>
            </v-col>
          </v-row>
        </v-container>

        <v-table hover>
          <thead>
            <tr>
              <th class="text-center">Role</th>
              <th class="text-left">Member Organization</th>
              <th class="text-left">Forum</th>
              <th class="text-left">Name</th>
              <th class="text-left">Registration Link</th>
              <th class="text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="delegate in delegatesStore.delegates
                .filter((delegate) => delegate.school == route.params.school_id)
                .filter((delegate) => delegate.represents === org.id)
                .sort((a, b) => {
                  return a.forum.id > b.forum.id;
                })"
              :key="delegate.id"
            >
              <td class="text-center">
                <v-icon
                  v-tooltip:right-center="
                    delegate.ambassador ? 'Ambassador' : 'Delegate'
                  "
                  :color="delegate.ambassador ? 'primary' : 'auto'"
                  >{{
                    delegate.ambassador ? "mdi-account-star" : "mdi-account"
                  }}</v-icon
                >
              </td>
              <td>
                <span
                  v-tooltip:right-center="
                    memberOrganizationsStore.member_organizations.find(
                      (org) => org.id === delegate.represents,
                    ).official_name
                  "
                  >{{
                    memberOrganizationsStore.member_organizations.find(
                      (org) => org.id === delegate.represents,
                    ).name
                  }}</span
                >
              </td>
              <td>
                {{
                  forumsStore.forums.find(
                    (forum) => forum.id === delegate.forum,
                  ).name
                }}
              </td>
              <td>
                <v-icon v-if="delegate.first_name" color="green" start
                  >mdi-check-circle</v-icon
                >
                {{ delegate.first_name }} {{ delegate.last_name }}
              </td>
              <td>
                <Router-Link
                  class="link"
                  target="_blank"
                  :to="{
                    name: 'final-registration-delegate',
                    params: { delegate_id: delegate.id },
                  }"
                  >{{
                    this.$router.resolve({
                      name: "final-registration-delegate",
                      params: { delegate_id: delegate.id },
                    }).href
                  }}</Router-Link
                >
                <v-btn
                  rounded
                  variant="tonal"
                  density="comfortable"
                  prepend-icon="mdi-content-copy"
                  v-clipboard:copy="
                    `${
                      this.$router.resolve({
                        name: 'final-registration-delegate',
                        params: { delegate_id: delegate.id },
                      }).href
                    }`
                  "
                  v-clipboard:success="onCopy"
                  v-clipboard:error="onError"
                  v-tooltip:bottom-center="
                    'Click to copy registration link into your clipboard'
                  "
                >
                  Copy link
                </v-btn>
              </td>
              <td>...</td>
            </tr>
          </tbody>
        </v-table>
      </div>

      <v-alert style="margin-top: 20px" title="TODOs" color="info">
        <ul>
          <li>ambassador assignment per member organization</li>
          <li>Copy/export to spreadsheet button</li>
          <li>Adjust links to actual urls, i.e. add domain</li>
          <li>
            Questions for testers: Is highlighting of ambassador enough or
            should entire row be highlighted?
          </li>
          <li>
            Add short name and member status of member organizations to the
            table?
          </li>
        </ul>
      </v-alert>
    </v-sheet>
  </div>
</template>

<style scoped>
#sheet {
  padding: 20px;
  margin: 20px 50px;

  @media (max-width: 600px) {
    padding: 0px;
    margin: 20px;
  }
}
.link {
  margin-right: 20px;
}
h2 {
  margin: 20px 0px;
}

.delegation {
  margin: 30px 0px;
}

.delegation > h3 {
  margin: 10px 0px;
}
</style>
