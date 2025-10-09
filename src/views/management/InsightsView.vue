<script setup>
import { ref, onMounted, inject } from "vue";
import AgeChart from "./charts/AgeChart.vue";
import GenderChart from "./charts/GenderChart.vue";
import HousingChart from "./charts/HousingChart.vue";
import OriginChart from "./charts/OriginChart.vue";
import FirstTimeDelegatesChart from "./charts/FirstTimeDelegatesChart.vue";
import axios from "axios";

const http = inject("backend_instance");
const stats_http = axios.create({
  ...http.defaults,
  baseURL: http.defaults.baseURL.replace(/\/?api\/?$/, "/stats/"),
});

const age_stats = ref(null);
const gender = ref(null);
const housing_data = ref(null);
const origin_data = ref(null);
const delegates_from_countries = ref(null);
const birthdays = ref(null);
const first_time_delegates_per_forum = ref(null);
const stats = ref(null);

const stats_api_request = async (endpoint) => {
  try {
    const response = await stats_http.get(endpoint);
    return response.data;
  } catch (error) {
    console.error(`Error fetching data from ${endpoint}:`, error);
    return null;
  }
};

onMounted(async () => {
  gender.value = await stats_api_request("gender_all");
  age_stats.value = await stats_api_request("age_counts_all");
  birthdays.value = await stats_api_request("birthdays_during_conference");
  origin_data.value = await stats_api_request("origin_all");
  delegates_from_countries.value = await stats_api_request(
    "delegates_from_countries",
  );
  housing_data.value = await stats_api_request("housing_all");
  first_time_delegates_per_forum.value = await stats_api_request(
    "first_time_delegates_per_forum",
  );
  stats.value = await stats_api_request("all_stats");
});
</script>

<template>
  <div class="">
    <v-container fluid>
      <v-row>
        <v-col xs="12" sm="8" md="8">
          <v-card prepend-icon="mdi-gender-male-female" title="Gender">
            <v-card-text>
              <p>
                See how the gender distribution in the different participant
                groups is.
              </p>

              <v-carousel
                cycle
                interval="20000"
                show-arrows="hover"
                hide-delimiters
                :height="400"
              >
                <v-carousel-item>
                  <gender-chart
                    :male="gender?.participant.male"
                    :female="gender?.participant.female"
                    :other="gender?.participant.other"
                    title="All participants"
                  ></gender-chart>
                </v-carousel-item>
                <v-carousel-item>
                  <gender-chart
                    :male="gender?.delegate.male"
                    :female="gender?.delegate.female"
                    :other="gender?.delegate.other"
                    title="Delegates"
                  ></gender-chart>
                </v-carousel-item>
                <v-carousel-item>
                  <gender-chart
                    :male="gender?.studentofficer.male"
                    :female="gender?.studentofficer.female"
                    :other="gender?.studentofficer.other"
                    title="Student Officers"
                  ></gender-chart>
                </v-carousel-item>
                <v-carousel-item>
                  <gender-chart
                    :male="gender?.staff.male"
                    :female="gender?.staff.female"
                    :other="gender?.staff.other"
                    title="Staff"
                  ></gender-chart>
                </v-carousel-item>
                <v-carousel-item>
                  <gender-chart
                    :male="gender?.executive.male"
                    :female="gender?.executive.female"
                    :other="gender?.executive.other"
                    title="Executives"
                  ></gender-chart>
                </v-carousel-item>
              </v-carousel>
            </v-card-text>
          </v-card>
        </v-col>

        <v-col xs="12" sm="4" md="4">
          <v-card prepend-icon="mdi-calendar-clock" title="Age">
            <v-card-text>
              <p>
                See how the age distribution in the different participant groups
                is.
              </p>

              <age-chart :age_stats="age_stats"></age-chart>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>

      <v-row align="stretch">
        <v-col xs="12" sm="4" md="4" class="d-flex">
          <v-card prepend-icon="mdi-cake" title="Birthdays">
            <v-card-text>
              <p>
                The following participants have birthday during the conference
                and might need a new wristband:
              </p>
              <ul class="pa-2 ma-2">
                <li
                  v-for="birthday in birthdays?.birthdays"
                  :key="birthday"
                  class="mb-1"
                >
                  <a href="">{{ birthday.name }}</a> on {{ birthday.date }}
                </li>
              </ul>
            </v-card-text>
          </v-card>
        </v-col>

        <v-col xs="12" sm="8" md="8" class="d-flex">
          <v-card
            width="100%"
            prepend-icon="mdi-home-export-outline"
            title="Origin"
          >
            <v-card-text>
              <p>See where the participants come from</p>
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
                    <div style="height: 300px; overflow: scroll">
                      <ol>
                        <li
                          v-for="country in delegates_from_countries?.origin"
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
        </v-col>

        <v-col xs="12" sm="4" md="4" class="d-flex">
          <v-card prepend-icon="mdi-home-heart" title="Housing">
            <v-card-text>
              <p>
                Please note, the housing numbers do <b>not</b> include
                MUN-Directors, Student Officers and other participants from
                abroad how are in the housing, only Delegates.
              </p>

              <housing-chart :data="housing_data"></housing-chart>
            </v-card-text>
          </v-card>
        </v-col>

        <v-col xs="12" sm="4" md="4" class="d-flex">
          <v-card prepend-icon="mdi-counter" title="Stats">
            <v-card-text>
              <p>
                Some general statistics of this conference for getting an
                overview and reporting true facts
              </p>

              <v-table density="compact">
                <template v-slot:default>
                  <thead>
                    <tr>
                      <th class="text-left text-bold">Category</th>
                      <th class="text-left">Amount</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>Number of forums</td>
                      <td>{{ stats?.number_of_forums }}</td>
                    </tr>
                    <tr>
                      <td>Number of issues</td>
                      <td>{{ stats?.number_of_issues }}</td>
                    </tr>
                    <tr>
                      <td>Number of simulated member organizations</td>
                      <td>
                        {{ stats?.number_of_simulated_member_organizations }}
                      </td>
                    </tr>
                    <tr>
                      <td>Number of participating Delegates</td>
                      <td>{{ stats?.number_of_delegates }}</td>
                    </tr>
                    <tr>
                      <td>Number of participating Student Officers</td>
                      <td>{{ stats?.number_of_student_officers }}</td>
                    </tr>
                    <tr>
                      <td>Number of participating MUN-Directors</td>
                      <td>{{ stats?.number_of_mun_directors }}</td>
                    </tr>
                    <tr>
                      <td>Number of participating Executives</td>
                      <td>{{ stats?.number_of_executives }}</td>
                    </tr>
                    <tr>
                      <td>Number of participating Staff</td>
                      <td>{{ stats?.number_of_staff }}</td>
                    </tr>
                    <tr>
                      <td>Number of participating Advisors</td>
                      <td>{{ stats?.number_of_advisors }}</td>
                    </tr>
                    <tr>
                      <td>Participants in total</td>
                      <td>{{ stats?.number_of_participants }}</td>
                    </tr>
                    <tr>
                      <td>Minimum and maximum birthday</td>
                      <td>
                        {{ stats?.minimum_birthday.birthday__min }};
                        {{ stats?.maximum_birthday.birthday__max }}
                      </td>
                    </tr>
                    <tr>
                      <td></td>
                      <td></td>
                    </tr>
                  </tbody>
                </template>
              </v-table>
            </v-card-text>
          </v-card>
        </v-col>

        <v-col xs="12" sm="4" md="4" class="d-flex">
          <v-card
            prepend-icon="mdi-account-question"
            title="First Time Delegates"
          >
            <v-card-text>
              <p>
                The following participants are attending their first Model UN
                conference:
              </p>

              <first-time-delegates-chart
                :data="first_time_delegates_per_forum"
              ></first-time-delegates-chart>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<style>
.center {
  text-align: center;
}

tbody tr:nth-of-type(odd) {
  background-color: rgba(0, 0, 0, 0.05);
}
</style>
