<script setup>
import { useRoute, useRouter } from "vue-router";
const router = useRouter();
const origin = window.location.origin;
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

const changeAmbassador = (delegate_id) => {
  delegatesStore.changeAmbassador(delegate_id);
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
    return memberOrganizationsStore.member_organizations.find((org) => org.id === represents);
  });

  return memberOrganizations;
};

const getExportData = () => {
  return delegatesStore.delegates
    .filter((delegate) => delegate.school == route.params.school_id)
    .sort((a, b) => {
      // First, sort by represents (member organization)
      if (a.represents !== b.represents) {
        return a.represents > b.represents ? 1 : -1;
      }
      // If represents is the same, sort by forum
      return a.forum > b.forum ? 1 : a.forum < b.forum ? -1 : 0;
    })
    .map((delegate) => {
      return {
        ...delegate,
        represents: memberOrganizationsStore.member_organizations.find(
          (org) => org.id === delegate.represents,
        ).name,
        forum: forumsStore.forums.find((forum) => forum.id === delegate.forum).name,
        link: `${origin}${
          router.resolve({
            name: "final-registration-delegate",
            params: { delegate_id: delegate.id },
          }).href
        }`,
      };
    });
};
</script>

<template>
  <div class="final-registration">
    <v-sheet id="sheet" :elevation="mobile ? 0 : 2" :rounded="mobile ? false : 'lg'">
      <v-btn
        variant="plain"
        prepend-icon="mdi-arrow-left"
        :to="{
          name: 'registration-startpage',
          params: { school_id: route.params.school_id },
        }"
        >Back to registration overview</v-btn
      >

      <h1 class="py-6">Final Registration</h1>

      <p>
        Dear MUN-Director, <br />

        Country Allocations have been done. We can confirm that you can bring
        <b>{{
          delegatesStore.delegates.filter((delegate) => delegate.school == route.params.school_id)
            .length
        }}</b>
        students. Your school is representing the following member organisations:
        <b>{{
          getUniqueMemberOrganizationsFromSchool()
            .map((org) => org.official_name)
            .join(", ")
            .replace(
              /,([^,]*)$/,
              " and$1",
            ) /* Gets a set of all unique member organizations which are represented by the delegates of a school. The official names of these member organizations are listed separated by commas, but the last comma is replaced with 'and' */
        }}</b
        >. In the final registration we ask you, your fellow MUN-Directors as well as your students
        to fill in forms. This data is required to organize the conference. For each participant you
        have an unique registration link. Forward this to the delegate/colleague, so that they can
        provide their information. Once they've done it, their information shows up here. Please
        don't hesitate contacting the Conference Managers in case you have any questions
        <a href="mailto:conferencemanager@munol.org">conferencemanager@munol.org</a>.
      </p>

      <h2>MUN-Directors</h2>

      <v-table hover>
        <thead>
          <tr>
            <th class="text-left">Name</th>
            <th class="text-left">Registration Link</th>
            <th class="text-left"></th>
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
              <v-icon start>mdi-school</v-icon>{{ director.first_name }}
              {{ director.last_name }}
            </td>
            <td>
              <Router-Link
                class="link"
                target="_blank"
                rel="noopener noreferrer"
                :to="{
                  name: 'final-registration-mun-director',
                  params: { mun_director_id: director.id },
                }"
                >{{ origin
                }}{{
                  router.resolve({
                    name: "final-registration-mun-director",
                    params: { mun_director_id: director.id },
                  }).href
                }}</Router-Link
              >
            </td>
            <td>
              <v-btn
                v-tooltip:bottom-center="{
                  text: 'Click to copy registration link into your clipboard',
                  openOnClick: true,
                }"
                rounded
                variant="tonal"
                density="comfortable"
                prepend-icon="mdi-content-copy"
                v-clipboard:copy="
                  `${origin}${
                    router.resolve({
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
                v-tooltip:bottom-center="{
                  text: 'Click to remove this MUN-Director',
                  openOnClick: true,
                }"
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
                v-tooltip:bottom-center="{
                  text: 'Click to add another MUN-Director',
                  openOnClick: true,
                }"
                rounded
                density="comfortable"
                color="green"
                prepend-icon="mdi-account-plus"
                @click="addMUNDirector"
                >Add an MUN-Director</v-btn
              >
            </td>
          </tr>
        </tfoot>
      </v-table>

      <h2>Delegates</h2>

      Please select one delegate of each member organization to be the ambassador of this delegation
      by clicking the star button at the end of the respective row. The ambassador will be the main
      point of contact for this delegation during the conference and might be asked to give a speech
      at the opening ceremony.

      <v-table>
        <thead>
          <tr>
            <th class="selectable text-left">Member Organization</th>
            <th class="selectable text-left">Forum</th>
            <th class="selectable text-left">Name</th>
            <th class="selectable text-left">Registration Link</th>
            <th class="text-left"></th>
            <th class="text-left">Status</th>
            <th class="text-center">Role</th>
            <th class="text-left">Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="delegate in delegatesStore.delegates
              .filter((delegate) => delegate.school == route.params.school_id)
              .sort((a, b) => {
                // First, sort by represents (member organization)
                if (a.represents !== b.represents) {
                  return a.represents > b.represents ? 1 : -1;
                }
                // If represents is the same, sort by forum
                return a.forum > b.forum ? 1 : a.forum < b.forum ? -1 : 0;
              })"
            :key="delegate.id"
          >
            <td>
              <v-chip
                v-tooltip:bottom="{
                  text: memberOrganizationsStore.member_organizations.find(
                    (org) => org.id === delegate.represents,
                  )?.official_name,
                  openOnClick: true,
                }"
              >
                <template v-slot:prepend>
                  <v-avatar
                    lazy
                    start
                    v-if="
                      memberOrganizationsStore.member_organizations.find(
                        (org) => org.id === delegate.represents,
                      )?.flag
                    "
                    :image="
                      memberOrganizationsStore.member_organizations.find(
                        (org) => org.id === delegate.represents,
                      )?.flag
                    "
                    class="no-select"
                  ></v-avatar>
                </template>
                {{
                  memberOrganizationsStore.member_organizations.find(
                    (org) => org.id === delegate.represents,
                  )?.placard_name
                }}
              </v-chip>
            </td>
            <td>
              <v-chip
                v-tooltip:bottom="{
                  text: forumsStore.forums.find((forum) => forum.id === delegate.forum).name,
                  openOnClick: true,
                }"
              >
                {{ forumsStore.forums.find((forum) => forum.id === delegate.forum).abbreviation }}
              </v-chip>
            </td>
            <td>{{ delegate?.first_name }} {{ delegate?.last_name }}</td>
            <td>
              <Router-Link
                class="link"
                target="_blank"
                rel="noopener noreferrer"
                :to="{
                  name: 'final-registration-delegate',
                  params: { delegate_id: delegate.id },
                }"
                >{{ origin
                }}{{
                  router.resolve({
                    name: "final-registration-delegate",
                    params: { delegate_id: delegate.id },
                  }).href
                }}</Router-Link
              >
            </td>
            <td>
              <v-btn
                rounded
                variant="tonal"
                density="comfortable"
                prepend-icon="mdi-content-copy"
                v-clipboard:copy="
                  `${origin}${
                    router.resolve({
                      name: 'final-registration-delegate',
                      params: { delegate_id: delegate.id },
                    }).href
                  }`
                "
                v-clipboard:success="onCopy"
                v-clipboard:error="onError"
                v-tooltip:bottom-center="{
                  text: 'Click to copy registration link into your clipboard',
                  openOnClick: true,
                }"
                class="no-select"
              >
                Copy link
              </v-btn>
            </td>
            <td class="no-select">
              <v-chip
                v-if="
                  delegate.first_name &&
                  delegate.last_name &&
                  delegate.email &&
                  delegate.data_consent_time &&
                  delegate.data_consent_ip &&
                  delegate.gender
                "
                color="green"
              >
                <v-icon start>mdi-check-circle</v-icon>
                Completed
              </v-chip>
              <v-chip v-else color="red">
                <v-icon start>mdi-close-circle</v-icon>
                Not completed
              </v-chip>
            </td>
            <td class="text-center no-select">
              <v-icon
                v-tooltip:right-center="{
                  text: delegate.ambassador ? 'Ambassador' : 'Delegate',
                  openOnClick: true,
                }"
                :color="delegate.ambassador ? 'primary' : 'auto'"
                >{{ delegate.ambassador ? "mdi-account-star" : "mdi-account" }}</v-icon
              >
            </td>
            <td class="no-select">
              <v-btn
                v-if="!delegate.ambassador"
                variant="tonal"
                color="primary"
                size="small"
                icon="mdi-star"
                v-tooltip:start="{
                  text: 'Click to make this delegate the ambassador for this delegation',
                  openOnClick: true,
                }"
                @click="changeAmbassador(delegate.id)"
              >
              </v-btn>
            </td>
          </tr></tbody
      ></v-table>

      <p>
        <i>
          Hint: You can mark the delegates table and copy it to distribute the links to your
          students. Or you can
          <download-excel
            class="download"
            :data="getExportData()"
            :fields="{
              'Member Organization': 'represents',
              Forum: 'forum',
              'First name': 'first_name',
              'Last name': 'last_name',
              'Registration Link': 'link',
            }"
            name="MUNOL_Delegation.xls"
            :header="`Registration Links for Delegates of ${schoolsStore.school.name}`"
            >export the table as a spreadsheet </download-excel
          ><v-icon start>mdi-microsoft-excel</v-icon>
        </i>
      </p>
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

.no-select {
  user-select: none;
}

.selectable {
  user-select: all !important;
}

.download {
  display: inline;
  text-decoration: underline;
  color: blue;
  cursor: pointer;
}
</style>
