<template>
  <v-container>
    <v-banner elevation="2">
      <h1>Pre Registration</h1>
      <v-row class="spaced">
        <v-col md="3" class="introduction">
          <p>Dear MUN-Director of {{ school }},</p>
          <p>
            we are very delighted that you are interested in taking part in the
            24<sup>th</sup> MUNOL session in 2021. In order to register, you and
            your school's delegation, please fill out thise form by
            {{ deadline.toLocaleDateString() }}. The registration procedure is
            explained in detail <router-link to="">here</router-link>. Please
            don't hesitate to contact Conference Management if you have any
            further questions:
            <a>conferencemanager@munol.org.</a>
          </p>
        </v-col>
        <v-col md="9" class="form spaced">
          <div>
            <v-icon>mdi-school</v-icon>
            <span>School</span>
          </div>
          <div>
            <v-row>
              <v-col md="4" class="input-container">
                <v-text-field outlined hide-details label="School Name" />
                <tooltipped-icon
                  position="right"
                  icon="mdi-help-circle-outline"
                  text="Please make sure that the school name is written correctly. It will appear on the badges and certificates. Write an email to conferencemanager@munol.org to change it."
                  tooltipWidth="380px"
                  textAlign="center"
                />
              </v-col>
            </v-row>
          </div>
          <div>
            <v-icon>mdi-map-marker</v-icon>
            <span>Address</span>
            <tooltipped-icon
              position="right"
              icon="mdi-help-circle-outline"
              text="We will normally use emails to contact you, however, having an address is the backup option."
              tooltipWidth="380"
              textAlign="center"
            />
          </div>
          <div>
            <v-row>
              <v-col md="4">
                <v-text-field
                  outlined
                  hide-details
                  label="Street Name, House Number"
                />
              </v-col>
              <v-col md="2">
                <v-text-field outlined hide-details label="ZIP Code" />
              </v-col>
              <v-col md="3">
                <v-text-field outlined hide-details label="City" />
              </v-col>
              <v-col md="3">
                <v-text-field outlined hide-details label="Country" />
              </v-col>
            </v-row>
          </div>
          <div>
            <v-icon>mdi-account</v-icon>
            <span>Number of Delegates</span>
            <tooltipped-icon
              position="right"
              icon="mdi-help-circle-outline"
              text="If you would like to bring less or more students, please ask Conference Management."
              tooltipWidth="380"
              textAlign="center"
            />
          </div>
          <div>
            <v-slider
              min="5"
              max="19"
              thumb-label="always"
              value="10"
              hide-details
              class="slider"
            />
          </div>
          <div>
            <v-icon>mdi-home-city</v-icon>
            <span>Accomodation</span>
          </div>
          <div>
            <v-row>
              <v-col md="4">
                <v-select outlined label="Accomodation" :items="items" />
              </v-col>
            </v-row>
          </div>
        </v-col>
      </v-row>
      <template v-slot:actions>
        <v-btn elevation="2" color="primary" x-large>
          Submit
        </v-btn>
      </template>
    </v-banner>
  </v-container>
</template>

<script>
import TooltippedIcon from "../generic/TooltippedIcon.vue";
export default {
  name: "PreRegistration",
  components: { TooltippedIcon },
  data() {
    return {
      school: "Template School",
      deadline: new Date(),
      items: ["Hostel"],
    };
  },
};
</script>

<style></style>
