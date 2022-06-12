<template>
  <div>
    <v-container grid-list-md>
      <v-layout row wrap>
        <v-flex d-flex xs12 sm5 md5>
          <v-card>
            <v-card-title
              ><v-icon left>mdi-gender-male-female</v-icon>Gender</v-card-title
            >
            <v-card-text>
              <p>
                See how the gender distribution in the different participant
                groups is.
              </p>
              <v-carousel
                v-model="genderChartId"
                cycle
                interval="20000"
                show-arrows-on-hover
                hide-delimiters
                :height="400"
              >
                <v-carousel-item>
                  <gender-chart
                    :participants="participants"
                    title="All participants"
                  ></gender-chart>
                </v-carousel-item>
                <v-carousel-item>
                  <gender-chart
                    :participants="delegates"
                    title="Delegates"
                  ></gender-chart>
                </v-carousel-item>
                <v-carousel-item>
                  <gender-chart
                    :participants="student_officers"
                    title="Student Officers"
                  ></gender-chart>
                </v-carousel-item>
                <v-carousel-item>
                  <gender-chart
                    :participants="staffs"
                    title="Staff"
                  ></gender-chart>
                </v-carousel-item>
                <v-carousel-item>
                  <gender-chart
                    :participants="executives"
                    title="Executives"
                  ></gender-chart>
                </v-carousel-item>
              </v-carousel>
            </v-card-text>
          </v-card>
        </v-flex>

        <v-flex d-flex xs12 sm4 md4>
          <v-card>
            <v-card-title
              ><v-icon left>mdi-calendar-clock</v-icon>Age</v-card-title
            >
            <v-card-text>
              <p>
                See how the age distribution in the different participant groups
                is.
              </p>

              <age-chart
                :delegates="delegates"
                :executives="executives"
                :student_officers="student_officers"
                :mundirectors="mundirectors"
                :advisors="advisors"
                :staffs="staffs"
              ></age-chart>
            </v-card-text>
          </v-card>
        </v-flex>

        <v-flex d-flex xs12 sm3 md3>
          <v-card>
            <v-card-title><v-icon left>mdi-cake</v-icon>Birthdays</v-card-title>
            <v-card-text>
              <p>
                The following participants have birthday during the conference
                and might need a new wristband:
              </p>
              <ul>
                <li><a href="">XXX</a> on YYY</li>
              </ul>
            </v-card-text>
          </v-card>
        </v-flex>

        <v-flex d-flex xs12 sm8 md8>
          <v-card>
            <v-card-title
              ><v-icon left>mdi-home-export-outline</v-icon>Origin</v-card-title
            >
            <v-card-text>
              <p>
                See where the participants come from See where the participants
                come fromSee where the participants come fromSee where the
                participants come fromSee where the participants come from
              </p>
              <v-row no-gutters>
                <v-col cols="12" sm="7">
                  <v-card elevation="0">
                    <origin-chart
                      :male="10"
                      :female="20"
                      :diverse="1"
                      :title="group"
                    ></origin-chart>
                  </v-card>
                </v-col>
                <v-spacer></v-spacer>
                <v-col cols="12" sm="4"
                  ><v-card elevation="0">
                    <h3>Participating schools from:</h3>
                    <ol>
                      <li v-for="country in countries" :key="country">
                        {{ country }}
                      </li>
                    </ol>
                  </v-card>
                </v-col>
              </v-row>
            </v-card-text>
          </v-card>
        </v-flex>

        <v-flex d-flex xs12 sm4 md4>
          <v-card>
            <v-card-title
              ><v-icon left>mdi-home-heart</v-icon>Housing</v-card-title
            >
            <v-card-text>
              <p>
                Please note, the housing numbers do <b>not</b> include
                MUN-Directors, Student Officers and other participants from
                abroad how are in the housing, only Delegates.
              </p>

              <housing-chart
                :male="10"
                :female="20"
                :diverse="1"
                :title="group"
              ></housing-chart>
            </v-card-text>
          </v-card>
        </v-flex>
        <v-flex d-flex xs12 sm6 md6>
          <v-card>
            <v-card-title
              ><v-icon left>mdi-silverware-fork-knife</v-icon>Diet</v-card-title
            >
            <v-card-text>
              <p>
                For evaluating how much food needs to be ordered for lunch. This
                includes all participants, i.e. everyone who eats at MUNOL.
                Note, that the advisors might not arrive at the beginning of the
                week.
              </p>

              <diet-chart
                :male="10"
                :female="20"
                :diverse="1"
                :title="group"
              ></diet-chart>
            </v-card-text>
          </v-card>
        </v-flex>

        <v-flex d-flex xs12 sm6 md6>
          <v-card>
            <v-card-title><v-icon left>mdi-counter</v-icon>Stats</v-card-title>
            <v-card-text>
              <p>
                Some general statistics of this conference for getting an
                overview and reporting true facts
              </p>

              <v-simple-table dense>
                <template v-slot:default>
                  <thead>
                    <tr>
                      <th class="text-left text-bold">
                        Category
                      </th>
                      <th class="text-left">
                        Amount
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>Number of forums</td>
                      <td>11</td>
                    </tr>
                    <tr>
                      <td>Number of issues</td>
                      <td>50</td>
                    </tr>
                    <tr>
                      <td>Number of simulated member organizations</td>
                      <td>59</td>
                    </tr>
                    <tr>
                      <td>Number of participating Delegates</td>
                      <td>250</td>
                    </tr>
                    <tr>
                      <td>Number of participating Student Officers</td>
                      <td>30</td>
                    </tr>
                    <tr>
                      <td>Number of participating MUN-Directors</td>
                      <td>45</td>
                    </tr>
                    <tr>
                      <td>Number of participating Executives</td>
                      <td>33</td>
                    </tr>
                    <tr>
                      <td>Number of participating Staff</td>
                      <td>45</td>
                    </tr>
                    <tr>
                      <td>Number of participating Advisors</td>
                      <td>20</td>
                    </tr>
                    <tr>
                      <td>Participants in total</td>
                      <td>500</td>
                    </tr>
                    <tr>
                      <td>Average age</td>
                      <td>16.4</td>
                    </tr>
                    <tr>
                      <td></td>
                      <td></td>
                    </tr>
                  </tbody>
                </template>
              </v-simple-table>
            </v-card-text>
          </v-card>
        </v-flex>
      </v-layout>
    </v-container>
  </div>
</template>

<script>
import GenderChart from "./GenderChart.vue";
import AgeChart from "./AgeChart.vue";
import OriginChart from "./OriginChart.vue";
import HousingChart from "./HousingChart.vue";
import DietChart from "./DietChart.vue";

export default {
  components: {
    GenderChart,
    AgeChart,
    OriginChart,
    HousingChart,
    DietChart,
  },
  name: "Insights",
  data: () => ({
    delegates: null,
    executives: null,
    mundirectors: null,
    staffs: null,
    student_officers: null,
    advisors: null,
    participants: null,
    schools: null,
    forums: null,
    issues: null,
    member_organizations: null,
    conference: null,
    countries: ["Germany", "Sweden", "Italy"],
  }),
  watch: {},
  methods: {},
  async mounted() {
    try {
      const { data } = await this.$http.get(
        "https://munoltom.pythonanywhere.com/api/delegates/"
      );
      this.delegates = data;
    } catch (error) {
      alert(error);
    }

    try {
      const { data } = await this.$http.get(
        "https://munoltom.pythonanywhere.com/api/executives/"
      );
      this.executives = data;
    } catch (error) {
      alert(error);
    }

    try {
      const { data } = await this.$http.get(
        "https://munoltom.pythonanywhere.com/api/student-officers/"
      );
      this.student_officers = data;
    } catch (error) {
      alert(error);
    }

    try {
      const { data } = await this.$http.get(
        "https://munoltom.pythonanywhere.com/api/mun-directors/"
      );
      this.mundirectors = data;
    } catch (error) {
      alert(error);
    }

    try {
      const { data } = await this.$http.get(
        "https://munoltom.pythonanywhere.com/api/staffs/"
      );
      this.staffs = data;
    } catch (error) {
      alert(error);
    }

    try {
      const { data } = await this.$http.get(
        "https://munoltom.pythonanywhere.com/api/advisors/"
      );
      this.advisors = data;
    } catch (error) {
      alert(error);
    }

    try {
      const { data } = await this.$http.get(
        "https://munoltom.pythonanywhere.com/api/participants/"
      );
      this.participants = data;
    } catch (error) {
      alert(error);
    }

    try {
      const { data } = await this.$http.get(
        "https://munoltom.pythonanywhere.com/api/schools/"
      );
      this.schools = data;
    } catch (error) {
      alert(error);
    }

    try {
      const { data } = await this.$http.get(
        "https://munoltom.pythonanywhere.com/api/issues/"
      );
      this.issues = data;
    } catch (error) {
      alert(error);
    }

    try {
      const { data } = await this.$http.get(
        "https://munoltom.pythonanywhere.com/api/forums/"
      );
      this.forums = data;
    } catch (error) {
      alert(error);
    }

    try {
      const { data } = await this.$http.get(
        "https://munoltom.pythonanywhere.com/api/member-organizations/"
      );
      this.member_organizations = data;
    } catch (error) {
      alert(error);
    }

    try {
      const [conference] = (
        await this.$http.get(
          "https://munoltom.pythonanywhere.com/api/conferences/"
        )
      ).data;
      this.conference = conference;
    } catch (error) {
      alert(error);
    }
  },
};
</script>

<style scoped>
tbody tr:nth-of-type(odd) {
  background-color: rgba(0, 0, 0, 0.05);
}

td {
  font-weight: bold;
}

td {
  color: grey;
}
</style>
