<template>
  <div>
    <v-container>
      <v-expansion-panels accordion multiple focusable hover>
        <v-expansion-panel v-for="(school, i) in schools" :key="i">
          <v-expansion-panel-header class="text-right">
            <v-row no-gutters align="center" justify="end">
              <v-col sm="5" style="text-align: left;">
                <span>{{ school.name }}</span>
              </v-col>
              <v-col sm="1">
                <tooltipped-icon
                  icon="mdi-currency-eur"
                  text="pre-reg fee not paid yet"
                  position="right"
                  v-if="school.fee"
                />
                <tooltipped-icon
                  icon="mdi-check"
                  text="pre-reg fee already paid"
                  position="right"
                  v-if="!school.fee"
                />
              </v-col>
              <v-col sm="1">
                <tooltipped-icon
                  icon="mdi-account-outline"
                  text="Numer of student requested"
                  position="right"
                />
                {{ school.requested }}
              </v-col>
              <v-col sm="1" justify="center">
                <tooltipped-icon
                  color="green"
                  icon="mdi-account"
                  text="Numer of student confirmed"
                  position="left"
                />13
              </v-col>
              <v-col sm="1">
                <tooltipped-icon
                  :icon="school.housing | housingIcon"
                  :text="school.housing | capitalize"
                />
              </v-col>
              <v-col sm="3">
                <v-chip :color="school.registration_status | regStatusColor">
                  {{ school.registration_status }}
                </v-chip>
              </v-col>
            </v-row>
          </v-expansion-panel-header>
          <v-expansion-panel-content style="text-align: left;">
            <v-row>
              <v-col sm="4">
                <p>{{ school.street }}</p>
                <p>{{ school.zipcode }}</p>
                <p>{{ school.country }}</p>
              </v-col>
              <v-col sm="4">
                <v-textarea
                  outlined
                  label="Arrival"
                  rows="2"
                  readonly
                  :value="school.arrival"
                ></v-textarea>
                <v-textarea
                  outlined
                  label="Departure"
                  rows="2"
                  readonly
                  :value="school.departure"
                ></v-textarea>
              </v-col>
              <v-col sm="4">
                <v-textarea
                  outlined
                  label="Internal comment"
                  rows="7"
                  :value="school.comment"
                ></v-textarea>
              </v-col>
            </v-row>
          </v-expansion-panel-content>
        </v-expansion-panel>
      </v-expansion-panels>
    </v-container>
  </div>
</template>

<script>
import TooltippedIcon from "./generic/TooltippedIcon";
export default {
  name: "Schools",
  components: { TooltippedIcon },
  filters: {
    capitalize(value) {
      if (!value) return "";
      value = value.toString();
      return value.charAt(0).toUpperCase() + value.slice(1);
    },
    regStatusColor(value) {
      switch (value) {
        case "WAITING_FOR_PRE_REGISTRATION":
          return "red";
        case "PRE_REGISTRATION_DONE":
          return "orange";
        default:
          return "red";
      }
    },
    housingIcon(value) {
      switch (value) {
        case "guest family":
          return "mdi-home-heart";
        case "hostel":
          return "mdi-hotel";
        default:
          return "mdi-home";
      }
    },
  },
  data: () => ({
    schools: null,
  }),
  mounted() {
    this.$http
      .get("https://munoltom.pythonanywhere.com/api/schools/")
      .then((response) => {
        this.schools = response.data;
      })
      .catch((error) => alert(error));
  },
};
</script>

<style>
.v-expansion-panel-header__icon {
  order: -1 !important;
}

.col {
  text-align: center;
}
</style>
