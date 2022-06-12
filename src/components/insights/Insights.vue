<template>
  <div>
    <v-container grid-list-md>
      <v-layout row>
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
                    :male="gender.participant.male"
                    :female="gender.participant.female"
                    :other="gender.participant.other"
                    title="All participants"
                  ></gender-chart>
                </v-carousel-item>
                <v-carousel-item>
                  <gender-chart
                    :male="gender.delegate.male"
                    :female="gender.delegate.female"
                    :other="gender.delegate.other"
                    title="Delegates"
                  ></gender-chart>
                </v-carousel-item>
                <v-carousel-item>
                  <gender-chart
                    :male="gender.studentofficer.male"
                    :female="gender.studentofficer.female"
                    :other="gender.studentofficer.other"
                    title="Student Officers"
                  ></gender-chart>
                </v-carousel-item>
                <v-carousel-item>
                  <gender-chart
                    :male="gender.staff.male"
                    :female="gender.staff.female"
                    :other="gender.staff.other"
                    title="Staff"
                  ></gender-chart>
                </v-carousel-item>
                <v-carousel-item>
                  <gender-chart
                    :male="gender.executive.male"
                    :female="gender.executive.female"
                    :other="gender.executive.other"
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

              <age-chart :age_stats="age_stats"></age-chart>
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
                <li v-for="birthday in birthdays" :key="birthday">
                  <a href="">{{ birthday.name }}</a> on {{ birthday.date }}
                </li>
              </ul>
            </v-card-text>
          </v-card>
        </v-flex>

        <v-flex d-flex xs12 sm8 md8>
          <v-card width="100%">
            <v-card-title
              ><v-icon left>mdi-home-export-outline</v-icon>Origin</v-card-title
            >
            <v-card-text>
              <p>
                See where the participants come from
              </p>
              <v-row no-gutters>
                <v-col cols="12" sm="7">
                  <v-card elevation="0">
                    <origin-chart :data="origin_data"></origin-chart>
                  </v-card>
                </v-col>
                <v-spacer></v-spacer>
                <v-col cols="12" sm="4"
                  ><v-card elevation="0">
                    <h3>Participating delegates from:</h3>
                    <div style="height: 300px; overflow: scroll;">
                      <ol>
                        <li
                          v-for="country in delegates_from_countries"
                          :key="country"
                        >
                          {{ country.school__country }}: {{ country.total }}
                        </li>
                      </ol>
                    </div>
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

              <housing-chart :data="housing_data"></housing-chart>
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

              <diet-chart :data="diet_data"></diet-chart>
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
                      <td>{{ stats.number_of_forums }}</td>
                    </tr>
                    <tr>
                      <td>Number of issues</td>
                      <td>{{ stats.number_of_issues }}</td>
                    </tr>
                    <tr>
                      <td>Number of simulated member organizations</td>
                      <td>
                        {{ stats.number_of_simulated_member_organizations }}
                      </td>
                    </tr>
                    <tr>
                      <td>Number of participating Delegates</td>
                      <td>{{ stats.number_of_delegates }}</td>
                    </tr>
                    <tr>
                      <td>Number of participating Student Officers</td>
                      <td>{{ stats.number_of_student_officers }}</td>
                    </tr>
                    <tr>
                      <td>Number of participating MUN-Directors</td>
                      <td>{{ stats.number_of_mun_directors }}</td>
                    </tr>
                    <tr>
                      <td>Number of participating Executives</td>
                      <td>{{ stats.number_of_executives }}</td>
                    </tr>
                    <tr>
                      <td>Number of participating Staff</td>
                      <td>{{ stats.number_of_staff }}</td>
                    </tr>
                    <tr>
                      <td>Number of participating Advisors</td>
                      <td>{{ stats.number_of_advisors }}</td>
                    </tr>
                    <tr>
                      <td>Participants in total</td>
                      <td>{{ stats.number_of_participants }}</td>
                    </tr>
                    <tr>
                      <td>Minimum and maximum birthday</td>
                      <td>
                        {{ stats.minimum_birthday.birthday__min }};
                        {{ stats.maximum_birthday.birthday__max }}
                      </td>
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
    gender: null,
    age_stats: null,
    birthdays: null,
    origin_data: null,
    housing_data: null,
    diet_data: null,
    stats: null,
    delegates_from_countries: null,
  }),
  watch: {},
  methods: {},
  async mounted() {
    try {
      const gender = (
        await this.$http.get(
          "https://munoltom.pythonanywhere.com/stats/gender_all"
        )
      ).data;
      this.gender = gender;
    } catch (error) {
      alert(error);
    }

    try {
      const age_stats = (
        await this.$http.get(
          "https://munoltom.pythonanywhere.com/stats/age_counts_all"
        )
      ).data;
      this.age_stats = age_stats;
    } catch (error) {
      alert(error);
    }

    try {
      const birthdays = (
        await this.$http.get(
          "https://munoltom.pythonanywhere.com/stats/birthdays_during_conference"
        )
      ).data;
      this.birthdays = birthdays.birthdays;
    } catch (error) {
      alert(error);
    }

    try {
      const origin_data = (
        await this.$http.get(
          "https://munoltom.pythonanywhere.com/stats/origin_all"
        )
      ).data;
      this.origin_data = origin_data;
    } catch (error) {
      alert(error);
    }

    try {
      const delegates_from_countries = (
        await this.$http.get(
          "https://munoltom.pythonanywhere.com/stats/delegates_from_countries"
        )
      ).data;
      this.delegates_from_countries = delegates_from_countries.origin;
    } catch (error) {
      alert(error);
    }

    try {
      const housing_data = (
        await this.$http.get(
          "https://munoltom.pythonanywhere.com/stats/housing_all"
        )
      ).data;
      this.housing_data = housing_data;
    } catch (error) {
      alert(error);
    }

    try {
      const diet_data = (
        await this.$http.get("https://munoltom.pythonanywhere.com/stats/diet")
      ).data;
      this.diet_data = diet_data;
    } catch (error) {
      alert(error);
    }

    try {
      const stats = (
        await this.$http.get(
          "https://munoltom.pythonanywhere.com/stats/all_stats"
        )
      ).data;
      this.stats = stats;
      console.log(this.stats);
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
