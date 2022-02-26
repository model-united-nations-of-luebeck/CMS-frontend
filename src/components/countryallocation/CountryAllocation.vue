<template>
  <div>
    <v-container>
      <!-- Header with actions -->
      <v-card-title>
        Country Allocation
        <v-spacer></v-spacer>
      </v-card-title>

      <v-simple-table dense>
        <thead>
          <tr>
            <th></th>
            <th></th>
            <th v-for="forum in forums" :key="forum.id" style="width: 50px;">
              <v-tooltip top>
                <template v-slot:activator="{ on, attrs }">
                  <b v-bind="attrs" v-on="on">{{ forum.abbreviation }}</b>
                </template>
                <span>{{ forum.name }}</span>
              </v-tooltip>
            </th>
            <th></th>
          </tr>
          <tr>
            <th>Member Organization</th>
            <th></th>
            <th
              v-for="forum in forums"
              :key="forum.id"
              style="text-align: center;"
            >
              ({{ delegatesInForum(forum.id) }})
            </th>
            <th>School</th>
          </tr>
        </thead>
        <colgroup>
          <col style="width: 300px;" />
          <col style="width: 20px;" />
          <col v-for="forum in forums" :key="forum.id" style="width: 60px;" />
          <col style="width: 170px;" />
        </colgroup>
        <tbody>
          <tr v-for="mo in memberOrganizations" :key="mo.id">
            <td>
              <v-tooltip top>
                <template v-slot:activator="{ on, attrs }">
                  <b
                    class="d-inline-block text-truncate"
                    style="max-width: 150px;"
                    v-bind="attrs"
                    v-on="on"
                    >{{ mo.name }}</b
                  >
                </template>
                <span>{{ mo.name }}</span>
              </v-tooltip>
              <div class="all">
                <v-tooltip bottom>
                  <template v-slot:activator="{ on, attrs }">
                    <v-btn
                      icon
                      small
                      style="right: 16px;"
                      color="primary"
                      v-bind="attrs"
                      v-on="on"
                      @click="checkAll(mo.id)"
                    >
                      <v-icon>mdi-check-all</v-icon>
                    </v-btn>
                  </template>
                  <span>check all</span>
                </v-tooltip>
                <v-tooltip bottom>
                  <template v-slot:activator="{ on, attrs }">
                    <v-btn
                      icon
                      small
                      color="primary"
                      v-bind="attrs"
                      v-on="on"
                      @click="uncheckAll(mo.id)"
                    >
                      <v-icon>mdi-checkbox-blank-off-outline</v-icon>
                    </v-btn>
                  </template>
                  <span>uncheck all</span>
                </v-tooltip>
              </div>
            </td>
            <td>
              <b>({{ delegatesOfMemberOrganization(mo.id) }})</b>
            </td>
            <td
              v-for="forum in forums"
              :key="forum.id"
              style="text-align: center;"
            >
              <v-simple-checkbox
                hide-details
                :ripple="false"
                dense
                color="primary"
                :value="checked(forum.id, mo.id)"
                @click="toggleDelegate(forum.id, mo.id)"
              >
              </v-simple-checkbox>
            </td>
            <td class="d-inline-block text-truncate" style="width: 170px;">
              <v-btn
                icon
                small
                dense
                color="red"
                v-if="!schoolNameOrAction(mo.id) == ''"
                @click="unlinkSchool(mo.id)"
              >
                <v-icon>mdi-link-off</v-icon>
              </v-btn>
              {{ schoolNameOrAction(mo.id) }}
              <v-btn
                icon
                small
                dense
                color="primary"
                v-if="schoolNameOrAction(mo.id) == ''"
                @click="openLinkSchoolDialog(mo.id)"
              >
                <v-icon>mdi-link-plus</v-icon>
              </v-btn>
            </td>
          </tr>
        </tbody>
      </v-simple-table>

      <link-school-dialog
        ref="linkSchoolDialog"
        :schools="this.schools"
        :memberOrganization="this.selectedMemberOrganization"
        @selected="linkSchool"
      ></link-school-dialog>
    </v-container>
  </div>
</template>

<script>
// import TooltippedIcon from "../generic/TooltippedIcon.vue";
import LinkSchoolDialog from "./LinkSchoolDialog.vue";
export default {
  components: { LinkSchoolDialog },
  name: "CountryAllocation",

  data: () => ({
    delegates: [],
    schools: [],
    forums: [],
    memberOrganizations: [],
    linkSchoolDialog: false,
    selectedMemberOrganization: null,
  }),
  mounted() {
    // fetch required data for this page
    this.$http
      .get("https://munoltom.pythonanywhere.com/api/delegates/")
      .then((response) => {
        this.delegates = response.data;
      })
      .catch((error) => alert(error));
    this.$http
      .get("https://munoltom.pythonanywhere.com/api/schools/")
      .then((response) => {
        this.schools = response.data;
      })
      .catch((error) => alert(error));
    this.$http
      .get("https://munoltom.pythonanywhere.com/api/forums/")
      .then((response) => {
        this.forums = response.data;
      })
      .catch((error) => alert(error));
    this.$http
      .get("https://munoltom.pythonanywhere.com/api/member-organizations/")
      .then((response) => {
        this.memberOrganizations = response.data;
      })
      .catch((error) => alert(error));
  },
  computed: {},
  methods: {
    schoolNameOrAction: function (memberOrganizationId) {
      const delegations = this.delegates.filter(
        (delegate) => delegate.represents == memberOrganizationId
      );
      if (delegations.length != 0) {
        return this.schools.filter(
          (school) => school.id == delegations[0].school
        )[0].name;
      } else {
        return "";
      }
    },
    delegatesInForum: function (forumId) {
      return this.delegates.filter((delegate) => delegate.forum == forumId)
        .length;
    },
    delegatesOfMemberOrganization: function (memberOrganizationId) {
      return this.delegates.filter(
        (delegate) => delegate.represents == memberOrganizationId
      ).length;
    },
    checked: function (forumId, memberOrganizationId) {
      //   console.log(forumId, memberOrganizationId);
      return (
        this.delegates.filter(
          (delegate) =>
            delegate.represents == memberOrganizationId &&
            delegate.forum == forumId
        ) != 0
      );
    },
    toggleDelegate: function (forumId, memberOrganizationId) {
      console.log(forumId);
      console.log(memberOrganizationId);

      // if delegate doesn't exist => create delegate
      if (!this.checked(forumId, memberOrganizationId)) {
        // create delegate
        this.createDelegate(forumId, memberOrganizationId);
      } else {
        // else delete delegate
        this.deleteDelegate(forumId, memberOrganizationId);
      }
    },
    createDelegate: function (forumId, memberOrganizationId) {
      if (!this.checked(forumId, memberOrganizationId)) {
        const delegate = {
          first_name: "unknown",
          last_name: "unknown",
          gender: "f",
          diet: "vegan",
          represents: memberOrganizationId,
          forum: forumId,
          school: 1,
        };
        this.$http
          .post("https://munoltom.pythonanywhere.com/api/delegates/", delegate)
          .then((r) => {
            if (r.status == 201) {
              this.delegates.push(r.data);
            } else {
              console.log(r.status);
            }
          })
          .catch((e) => {
            console.log(e);
          });
      }
    },

    deleteDelegate: function (forumId, memberOrganizationId) {
      console.log(forumId, memberOrganizationId);
      const delegateId = this.delegates.filter(
        (delegate) =>
          delegate.represents == memberOrganizationId &&
          delegate.forum == forumId
      )[0].id;
      console.log(delegateId);
      this.$http
        .delete(
          `https://munoltom.pythonanywhere.com/api/delegates/${delegateId}/`,
          {}
        )
        .then((r) => {
          if (r.status == 204) {
            // this.$refs.deletedSnackbar.show();
            this.delegates.splice(
              this.delegates.findIndex(
                (delegate) => delegate.id === delegateId
              ),
              1
            );

            //TODO: trigger page refresh
          } else {
            console.log(r.status);
          }
        })
        .catch((e) => {
          console.log(e);
          this.$refs.deletedErrorSnackbar.show();
        });
    },
    checkAll: function (memberOrganizationId) {
      this.forums.forEach((forum) => {
        this.createDelegate(forum.id, memberOrganizationId);
      });
    },
    uncheckAll: function (memberOrganizationId) {
      this.forums.forEach((forum) => {
        this.deleteDelegate(forum.id, memberOrganizationId);
      });
    },
    openLinkSchoolDialog(memberOrganizationId) {
      [this.selectedMemberOrganization] = this.memberOrganizations.filter(
        (mo) => mo.id == memberOrganizationId
      );
      this.$refs.linkSchoolDialog.open();
    },
    unlinkSchool(memberOrganizationId) {
      const delegatesInMemberOrganization = this.delegates.filter(
        (delegate) => delegate.represents == memberOrganizationId
      );
      delegatesInMemberOrganization.forEach((delegate) => {
        //update school property of delegates
        this.$http
          .patch(
            `https://munoltom.pythonanywhere.com/api/delegates/${delegate.id}/`,
            {
              school: null,
            }
          )
          .then((response) => {
            console.log(response);
          })
          .catch((error) => {
            console.log(error);
          });
        delegate.school = null;
      });
    },
    linkSchool(schoolId) {
      const delegatesInMemberOrganization = this.delegates.filter(
        (delegate) => delegate.represents == this.selectedMemberOrganization.id
      );
      delegatesInMemberOrganization.forEach((delegate) => {
        //update school property of delegates
        this.$http
          .put(
            `https://munoltom.pythonanywhere.com/api/delegates/${delegate.id}`,
            {
              school: schoolId,
            }
          )
          .then((response) => {
            console.log(response);
          })
          .catch((error) => {
            console.log(error);
          });
      });
    },
  },
};
</script>
<style scoped>
/* override the input control margins and paddings */
.v-input--selection-controls {
  margin-top: 0px !important;
  padding-top: 0px !important;
}
.v-application--is-ltr .v-input--selection-controls__input {
  margin-right: 0px !important;
}
table .v-btn {
  margin: auto !important;
}
.all {
  float: right;
}
/* .container {
  max-width: 1300px !important;
} */
</style>
