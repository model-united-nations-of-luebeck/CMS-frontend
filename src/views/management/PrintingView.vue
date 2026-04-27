<script setup></script>

<template>
  <div id="container">
    <v-container>
      <v-row>
        <v-col cols="12" md="6">
          <v-card
            class="h-100"
            prepend-icon="mdi-card-account-details"
            title="Badges"
            variant="outlined"
            link
            to="badges"
          >
            <v-card-text>Identification cards for conference participants.</v-card-text>
            <v-img
              src="https://cdn.vuetifyjs.com/images/parallax/material.jpg"
              alt="Badges"
              height="200px"
              cover
            ></v-img>
          </v-card>
        </v-col>
        <v-col cols="12" md="6">
          <v-card
            class="h-100"
            prepend-icon="mdi-tag"
            title="Placards"
            variant="outlined"
            link
            to="placards"
          >
            <v-card-text>Member Organization name signs for delegates</v-card-text>
            <v-img
              src="https://cdn.vuetifyjs.com/images/parallax/material.jpg"
              alt="Placards"
              height="200px"
              cover
            ></v-img>
          </v-card>
        </v-col>
        <v-col cols="12" md="4">
          <v-card
            class="h-100"
            prepend-icon="mdi-certificate"
            title="Certificates"
            variant="outlined"
            link
            to="certificates"
          >
            <v-card-text>Documents certifying participation in the conference</v-card-text>
            <v-img
              src="https://cdn.vuetifyjs.com/images/parallax/material.jpg"
              alt="Certificates"
              height="200px"
              cover
            ></v-img>
          </v-card>
        </v-col>
        <v-col cols="12" md="4">
          <v-card
            class="h-100"
            prepend-icon="mdi-table-check"
            title="Lists"
            variant="outlined"
            link
            to="lists"
          >
            <v-card-text>Useful lists of participants for administrative purposes</v-card-text>
            <v-img
              src="https://cdn.vuetifyjs.com/images/parallax/material.jpg"
              alt="Useful lists"
              height="200px"
              cover
            ></v-img>
          </v-card> </v-col
        ><v-col cols="12" md="4">
          <v-card
            class="h-100"
            prepend-icon="mdi-sign-direction"
            title="Signs"
            variant="outlined"
            link
            to="signs"
          >
            <v-card-text>Signs to guide attendees through the venue</v-card-text>
            <v-img
              src="https://cdn.vuetifyjs.com/images/parallax/material.jpg"
              alt="Signs"
              height="200px"
              cover
            ></v-img>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<style>
#container > .v-container {
  max-width: fit-content !important;
  margin: 0px 200px;
}
</style>
