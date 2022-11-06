<template>
  <div>
    <v-container>
      <v-btn
        @click="openNewLocationDialog"
        fab
        right
        bottom
        fixed
        color="primary"
        ><v-icon>mdi-plus</v-icon></v-btn
      >
      <location-dialog ref="newLocationDialog"></location-dialog>

      <v-tabs fixed-tabs background-color="primary" v-model="tab">
        <v-tab>
          <v-icon>mdi-map-marker</v-icon>
          Locations
        </v-tab>
        <v-tab>
          <v-icon>mdi-map</v-icon>
          Map
        </v-tab>
        <v-tab>
          <v-icon>mdi-home-account</v-icon>
          Rooms
        </v-tab>
        <v-tab>
          <v-icon>mdi-floor-plan</v-icon>
          Roomplan
        </v-tab>
      </v-tabs>

      <v-tabs-items v-model="tab">
        <v-tab-item>
          <v-card flat color="basil">
            <v-list>
              <v-list-item
                link
                v-for="location in this.locations"
                :key="location.id"
              >
                <v-list-item-action>
                  <tooltipped-icon
                    icon="mdi-map-marker"
                    :text="
                      'latitude: ' +
                      location.latitude +
                      ', longitude: ' +
                      location.longitude
                    "
                    position="right"
                  />
                </v-list-item-action>
                <v-list-item-content>
                  {{ location.name }}
                </v-list-item-content>
                <v-list-item-content>
                  {{ location.address }}
                </v-list-item-content>
                <v-list-item-action>
                  <v-menu
                    v-model="showLocationMenu"
                    offset-y
                    close-on-content-click
                    left
                  >
                    <template v-slot:activator="{ on, attrs }">
                      <v-icon v-bind="attrs" v-on="on"
                        >mdi-dots-vertical</v-icon
                      >
                    </template>

                    <v-list>
                      <v-list-item
                        :to="{
                          name: 'LocationDetails',
                          params: { id: location.id },
                        }"
                      >
                        <v-list-item-content>
                          <v-list-item-title>Edit</v-list-item-title>
                        </v-list-item-content>
                        <v-list-item-action>
                          <v-icon color="primary">mdi-pencil</v-icon>
                        </v-list-item-action>
                      </v-list-item>
                      <v-list-item @click.stop="deleteLocation(location.id)">
                        <v-list-item-content>
                          <v-list-item-title>Delete</v-list-item-title>
                        </v-list-item-content>
                        <v-list-item-action>
                          <v-icon color="red">mdi-delete</v-icon>
                        </v-list-item-action>
                      </v-list-item>
                    </v-list>
                  </v-menu>
                </v-list-item-action>
              </v-list-item>
            </v-list>
          </v-card>
        </v-tab-item>
        <v-tab-item>
          <v-card flat color="basil">
            <l-map
              :zoom="14"
              :center="center(locations)"
              style="height: 80vh; width: 100%; z-index: 1;"
            >
              <l-tile-layer :url="url" :attribution="attribution" />
              <l-marker
                v-for="location in locations"
                :lat-lng="latLong(location)"
                :key="location.id"
              >
                <l-popup>
                  <div>
                    <h4>{{ location.name }}</h4>
                    <p>Latitude: {{ location.latitude }}</p>
                    <p>Longitude: {{ location.longitude }}</p>
                    <p>Address: {{ location.address }}</p>
                  </div>
                </l-popup>
              </l-marker>
            </l-map>
          </v-card>
        </v-tab-item>
        <v-tab-item>
          <v-card flat color="basil">
            <v-list>
              <v-list-item link v-for="room in this.rooms" :key="room.id">
                <v-list-item-action>
                  <tooltipped-icon
                    icon="mdi-home-account"
                    :text="
                      'latitude: ' +
                      room.latitude +
                      ', longitude: ' +
                      room.longitude
                    "
                    position="right"
                  />
                </v-list-item-action>
                <v-list-item-content>
                  {{ room.name }}
                </v-list-item-content>
                <v-list-item-content>
                  {{ room.room_number }}
                </v-list-item-content>
                <v-list-item-action>
                  <v-menu
                    v-model="showRoomMenu"
                    offset-y
                    close-on-content-click
                    left
                  >
                    <template v-slot:activator="{ on, attrs }">
                      <v-icon v-bind="attrs" v-on="on"
                        >mdi-dots-vertical</v-icon
                      >
                    </template>

                    <v-list>
                      <v-list-item
                        :to="{
                          name: 'RoomDetails',
                          params: { id: room.id },
                        }"
                      >
                        <v-list-item-content>
                          <v-list-item-title>Edit</v-list-item-title>
                        </v-list-item-content>
                        <v-list-item-action>
                          <v-icon color="primary">mdi-pencil</v-icon>
                        </v-list-item-action>
                      </v-list-item>
                      <v-list-item @click.stop="deleteRoom(room.id)">
                        <v-list-item-content>
                          <v-list-item-title>Delete</v-list-item-title>
                        </v-list-item-content>
                        <v-list-item-action>
                          <v-icon color="red">mdi-delete</v-icon>
                        </v-list-item-action>
                      </v-list-item>
                    </v-list>
                  </v-menu>
                </v-list-item-action>
              </v-list-item>
            </v-list>
          </v-card>
        </v-tab-item>
        <v-tab-item>
          <v-card flat color="basil">
            <l-map
              :zoom="18"
              :center="center(rooms)"
              style="height: 80vh; width: 100%; z-index: 1;"
            >
              <l-control-layers></l-control-layers>
              <l-tile-layer :url="url" :attribution="attribution" />
              <l-layer-group layerType="overlay" name="Ground Floor">
                <l-marker
                  v-for="room in rooms.filter((room) => room.floor == 0)"
                  :lat-lng="latLong(room)"
                  :key="room.id"
                >
                  <l-popup>
                    <div>
                      <h4>{{ room.name }}</h4>
                      <p>Latitude: {{ room.latitude }}</p>
                      <p>Longitude: {{ room.longitude }}</p>
                      <p>Room number: {{ room.room_number }}</p>
                    </div>
                  </l-popup>
                </l-marker>
              </l-layer-group>
              <l-layer-group layerType="overlay" name="First Floor">
                <l-marker
                  v-for="room in rooms.filter((room) => room.floor == 1)"
                  :lat-lng="latLong(room)"
                  :key="room.id"
                >
                  <l-popup>
                    <div>
                      <h4>{{ room.name }}</h4>
                      <p>Latitude: {{ room.latitude }}</p>
                      <p>Longitude: {{ room.longitude }}</p>
                      <p>Room number: {{ room.room_number }}</p>
                    </div>
                  </l-popup>
                </l-marker>
              </l-layer-group>
            </l-map>
          </v-card>
        </v-tab-item>
      </v-tabs-items>

      <v-dialog v-model="deleteLocationDialog" max-width="500px">
        <v-card>
          <v-card-title>Delete location?</v-card-title>
          <v-card-text
            >Are you sure you want to delete this location?
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="blue darken-1" text @click="closeDeleteDialog"
              >Cancel</v-btn
            >
            <v-btn color="blue darken-1" text @click="deleteItemConfirm"
              >OK</v-btn
            >
          </v-card-actions>
        </v-card>
      </v-dialog>

      <v-dialog v-model="deleteRoomDialog" max-width="500px">
        <v-card>
          <v-card-title>Delete room?</v-card-title>
          <v-card-text>Are you sure you want to delete this room? </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="blue darken-1" text @click="closeDeleteRoomDialog"
              >Cancel</v-btn
            >
            <v-btn color="blue darken-1" text @click="deleteRoomItemConfirm"
              >OK</v-btn
            >
          </v-card-actions>
        </v-card>
      </v-dialog>

      <toast-message
        ref="deletedSnackbar"
        message="Deleted successfully"
        prepend_icon="mdi-check"
        color="success"
      />
      <toast-message
        ref="deletedErrorSnackbar"
        message="Deletion wasn't successful"
        prepend_icon="mdi-alert"
        color="error"
      />
    </v-container>
  </div>
</template>

<script>
import TooltippedIcon from "@/components/generic/TooltippedIcon";
import LocationDialog from "@/components/locations/LocationDialog";
import ToastMessage from "@/components/generic/ToastMessage";
import { latLng } from "leaflet";
import {
  LMap,
  LTileLayer,
  LMarker,
  LPopup,
  LLayerGroup,
  LControlLayers,
} from "vue2-leaflet";
export default {
  name: "Locations",
  components: {
    TooltippedIcon,
    LocationDialog,
    ToastMessage,
    LMap,
    LTileLayer,
    LMarker,
    LPopup,
    LLayerGroup,
    LControlLayers,
  },
  data() {
    return {
      locations: [],
      rooms: [],
      firstFloor: false,
      tab: null,
      url: "http://{s}.tile.osm.org/{z}/{x}/{y}.png",
      attribution:
        '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors',
      newLocationDialog: false,
      deleteLocationDialog: false,
      deleteRoomDialog: false,
      deletedItem: null,
      deletedRoomItem: null,
    };
  },
  mounted() {
    this.$http
      .get("api/locations/")
      .then((response) => {
        this.locations = response.data;
      })
      .catch((error) => alert(error));

    this.$http
      .get("api/rooms/")
      .then((response) => {
        this.rooms = response.data;
      })
      .catch((error) => alert(error));
  },
  methods: {
    deleteLocation(locationID) {
      this.showLocationMenu = false;
      [this.deletedItem] = this.locations.filter((l) => l.id == locationID);
      this.deleteLocationDialog = true;
    },
    deleteRoom(roomID) {
      this.showRoomMenu = false;
      [this.deletedRoomItem] = this.rooms.filter((r) => r.id == roomID);
      this.deleteRoomDialog = true;
    },
    async deleteItemConfirm() {
      await this.$http
        .delete(`api/locations/${this.deletedItem.id}/`, {})
        .then((r) => {
          if (r.status == 204) {
            this.$refs.deletedSnackbar.show();
            //TODO: trigger page refresh
          } else {
            console.log(r.status);
          }
        })
        .catch((e) => {
          console.log(e);
          this.$refs.deletedErrorSnackbar.show();
        });
      this.locations.splice(this.deleteLocation, 1);
      this.closeDeleteDialog();
    },
    async deleteRoomItemConfirm() {
      await this.$http
        .delete(`api/rooms/${this.deletedRoomItem.id}/`, {})
        .then((r) => {
          if (r.status == 204) {
            this.$refs.deletedSnackbar.show();
            //TODO: trigger page refresh
          } else {
            console.log(r.status);
          }
        })
        .catch((e) => {
          console.log(e);
          this.$refs.deletedErrorSnackbar.show();
        });
      this.rooms.splice(this.deleteRoom, 1);
      this.closeDeleteRoomDialog();
    },
    closeDeleteDialog() {
      this.deleteLocationDialog = false;
      this.deletedItem = null;
    },
    closeDeleteRoomDialog() {
      this.deleteRoomDialog = false;
      this.deletedRoomItem = null;
    },
    openNewLocationDialog() {
      this.$refs.newLocationDialog.open();
    },
    latLong({ latitude, longitude }) {
      return latLng(latitude, longitude);
    },
    average(array) {
      return array.reduce((a, b) => a + b, 0) / array.length;
    },
    center(array) {
      if (this.locations.length > 0) {
        const latitudes = array.map((location) => Number(location.latitude));
        const avgLatitude = this.average(latitudes);
        const longitudes = array.map((location) => Number(location.longitude));
        const avgLongitude = this.average(longitudes);
        return latLng(avgLatitude, avgLongitude);
      } else {
        return latLng(0, 0);
      }
    },
  },
  computed: {},
};
</script>

<style>
@import "../../../node_modules/leaflet/dist/leaflet.css";

.leaflet-fake-icon-image-2x {
  background-image: url(../../../node_modules/leaflet/dist/images/marker-icon-2x.png);
}
.leaflet-fake-icon-shadow {
  background-image: url(../../../node_modules/leaflet/dist/images/marker-shadow.png);
}
</style>
