<template>
  <div>
    <v-dialog v-model="dialog" persistent max-width="600px">
      <v-card>
        <v-card-title>
          <span class="headline">Add new location</span>
        </v-card-title>
        <v-card-text>
          <v-container>
            <v-form v-model="valid">
              <v-row>
                <v-col cols="12" sm="4">
                  <v-text-field
                    v-model="location.name"
                    label="Name *"
                    hint="e.g. 'Thomas-Mann-Schule'"
                    prepend-icon="mdi-map-marker-radius"
                    :rules="validationRules.nameRules"
                    required
                  ></v-text-field>
                </v-col>
                <v-col cols="12" sm="8">
                  <v-text-field
                    v-model="location.address"
                    label="Address *"
                    hint="e.g. 'Thomas-Mann-Straße 14', including street name and house number"
                    prepend-icon="mdi-home-map-marker"
                    :rules="validationRules.addressRules"
                  ></v-text-field>
                </v-col>
              </v-row>
              <v-row>
                <v-col cols="12" sm="4">
                  <v-text-field
                    v-model="location.latitude"
                    type="number"
                    label="Latitude *"
                    hint="e.g. 53.860421"
                    prepend-icon="mdi-latitude"
                    :rules="validationRules.latitudeRules"
                    required
                  ></v-text-field>
                </v-col>
                <v-col cols="12" sm="4">
                  <v-text-field
                    v-model="location.longitude"
                    type="number"
                    label="Longitude *"
                    hint="e.g. 10.713462"
                    prepend-icon="mdi-longitude"
                    :rules="validationRules.longitudeRules"
                  ></v-text-field>
                </v-col>
                <v-col cols="12" sm="4">
                  <v-text-field
                    v-model="location.zoom_level"
                    type="number"
                    label="Zoom level *"
                    hint="a number between 1 and 20, like google maps zoom levels"
                    prepend-icon="mdi-magnify-plus-outline"
                    :rules="validationRules.zoom_levelRules"
                  ></v-text-field>
                </v-col>
              </v-row>
              <v-row>
                <v-col cols="12" sm="12">
                  <v-switch
                    v-model="isRoom"
                    inset
                    label="Location is a room in school"
                  ></v-switch>
                </v-col>
              </v-row>
              <v-row v-if="isRoom">
                <v-col cols="12" sm="6">
                  <v-text-field
                    v-model="room.room_number"
                    label="Room number or name *"
                    hint="e.g. '0.23'"
                    prepend-icon="mdi-label"
                    :rules="validationRules.room_numberRules"
                    required
                  ></v-text-field>
                </v-col>
                <v-col cols="12" sm="6">
                  <v-select
                    v-model="room.floor"
                    label="Floor *"
                    :items="floors"
                    item-text="floor_name"
                    item-value="value"
                    prepend-icon="mdi-floor-plan"
                  ></v-select>
                </v-col>
              </v-row>
            </v-form>
            <small>*indicates required field</small>
          </v-container>
        </v-card-text>

        <v-card-actions>
          <v-spacer></v-spacer>

          <v-btn color="red " text @click="cancel">
            Cancel
          </v-btn>
          <v-btn color="green" text @click="save" :disabled="!valid">
            Save
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <toast-message
      ref="successSnackbar"
      message="The location has been successfully created."
      color="success"
      prepend_icon="mdi-check"
    />
    <toast-message
      ref="errorSnackbar"
      :message="'Creating location failed. Details:' + errorMessage"
      color="error"
      prepend_icon="mdi-alert"
    />
  </div>
</template>

<script>
import ToastMessage from "../generic/ToastMessage.vue";
export default {
  components: { ToastMessage },
  name: "LocationDialog",

  data: () => ({
    location: null,
    defaultLocation: {
      name: "",
      latitude: null,
      longitude: null,
      zoom_level: null,
      address: "",
    },
    isRoom: false,
    room: null,
    defaultRoom: {
      room_number: "",
      floor: null,
    },

    floors: [
      {
        floor_name: "Ground floor",
        value: 0,
      },
      {
        floor_name: "First floor",
        value: 1,
      },
    ],
    dialog: false,
    errorMessage: "",
    valid: false,
    validationRules: {
      nameRules: [
        (v) => !!v || "Name is required",
        (v) => v.length <= 100 || "Name must be less than 100 characters",
      ],
      addressRules: [
        (v) => !!v || "Address is required",
        (v) => v.length <= 100 || "Address must be less than 100 characters",
      ],
      latitudeRules: [
        (v) => !!v || "Latitude is required and must be a number",
        (v) => v <= 90 || "Latitude must be between -90 and 90°",
        (v) => v >= -90 || "Latitude must be between -90 and 90°",
      ],
      longitudeRules: [
        (v) => !!v || "Longitude is required and must be a number",
        (v) => v <= 180 || "Longitude must be between -180 and 180°",
        (v) => v >= -180 || "Longitude must be between -180 and 180°",
      ],
      zoom_levelRules: [
        (v) => !!v || "Zoom level is required and must be a number",
        (v) => v <= 20 || "Zoom level must be between 1 and 20",
        (v) => v >= 1 || "Zoom level must be between 1 and 20",
      ],
      room_numberRules: [
        (v) => !!v || "Room number or name is required",
        (v) => v.length <= 10 || "Room number must be less than 10 characters",
      ],
    },
  }),

  mounted() {
    this.location = this.defaultLocation;
    this.room = this.defaultRoom;
  },
  methods: {
    open() {
      this.dialog = true;
    },
    cancel() {
      this.dialog = false;
      this.location = this.defaultLocation;
      this.room = this.defaultRoom;
      this.isRoom = false;
    },
    async save() {
      // convert object to form data to also upload file
      const fd = new FormData();
      for (const key in this.location) {
        if (this.location[key] != null) {
          fd.append(key, this.location[key]);
        }
      }
      if (this.isRoom) {
        for (const key in this.room) {
          if (this.room[key] != null) {
            fd.append(key, this.room[key]);
          }
        }
      }
      const url = this.isRoom
        ? "https://munoltom.pythonanywhere.com/api/rooms/"
        : "https://munoltom.pythonanywhere.com/api/locations/";
      await this.$http
        .post(url, fd, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        })
        .then((r) => {
          if (r.status == 201) {
            this.$refs.successSnackbar.show();
            this.dialog = false;
          } else {
            console.log(r.status);
          }
          this.location = this.defaultLocation;
          this.room = this.defaultRoom;
          this.isRoom = false;
        })
        .catch((e) => {
          console.log(e);
          this.errorMessage = e.message;
          this.$refs.errorSnackbar.show();
          this.location = this.defaultLocation;
          this.room = this.defaultRoom;
          this.isRoom = false;
        });
    },
  },
};
</script>
