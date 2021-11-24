<template>
  <div>
    <v-container>
      <v-breadcrumbs :items="breadcrumbs" divider="/"></v-breadcrumbs>
      <v-form v-model="valid">
        <v-row>
          <v-col cols="12" sm="4">
            <v-text-field
              v-model="room.name"
              label="Name *"
              hint="e.g. 'Thomas-Mann-Schule'"
              prepend-icon="mdi-map-marker-radius"
              :rules="validationRules.nameRules"
              required
            ></v-text-field>
          </v-col>
          <v-col cols="12" sm="8">
            <v-text-field
              v-model="room.address"
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
              v-model="room.latitude"
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
              v-model="room.longitude"
              type="number"
              label="Longitude *"
              hint="e.g. 10.713462"
              prepend-icon="mdi-longitude"
              :rules="validationRules.longitudeRules"
            ></v-text-field>
          </v-col>
          <v-col cols="12" sm="4">
            <v-text-field
              v-model="room.zoom_level"
              type="number"
              label="Zoom level *"
              hint="a number between 1 and 20, like google maps zoom levels"
              prepend-icon="mdi-magnify-plus-outline"
              :rules="validationRules.zoom_levelRules"
            ></v-text-field>
          </v-col>
        </v-row>
        <v-row>
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

      <v-row>
        <v-spacer></v-spacer>

        <v-btn color="primary" @click="save" :disabled="!valid">
          Update
        </v-btn>
      </v-row>
    </v-container>

    <v-snackbar v-model="successSnackbar" color="success" timeout="2000">
      The room has been successfully updated.
      <template v-slot:action="{ attrs }">
        <v-btn text v-bind="attrs" @click="successSnackbar = false">
          OK
        </v-btn>
      </template>
    </v-snackbar>
    <v-snackbar v-model="errorSnackbar" color="error">
      Updating room failed. Details: {{ errorMessage }}
      <template v-slot:action="{ attrs }">
        <v-btn text v-bind="attrs" @click="errorSnackbar = false">
          OK
        </v-btn>
      </template>
    </v-snackbar>
  </div>
</template>

<script>
export default {
  name: "RoomDetails",
  props: ["id"],
  data: () => ({
    room: null,
    defaultRoom: {
      name: "",
      latitude: null,
      longitude: null,
      zoom_level: null,
      address: "",
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
    breadcrumbs: [
      {
        text: "Rooms",
        href: "/rooms",
      },
      {
        text: "",
      },
    ],
    successSnackbar: false,
    errorSnackbar: false,
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
    if (this.id != undefined) {
      this.$http
        .get(`https://munoltom.pythonanywhere.com/api/rooms/${this.id}`)
        .then((response) => {
          this.room = response.data;
          this.breadcrumbs[1].text = `${this.room.name}`;
        })
        .catch((error) => alert(error));
    }
  },
  methods: {
    async save() {
      // convert object to form data to also upload file
      const fd = new FormData();
      for (const key in this.room) {
        if (this.room[key] != null) {
          fd.append(key, this.room[key]);
        }
      }
      await this.$http
        .put(`https://munoltom.pythonanywhere.com/api/rooms/${this.id}/`, fd, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        })
        .then((r) => {
          if (r.status == 200) {
            this.successSnackbar = true;
          } else {
            console.log(r.status);
          }
        })
        .catch((e) => {
          console.log(e);
          this.errorMessage = e.message;
          this.errorSnackbar = true;
        });
    },
  },
};
</script>
