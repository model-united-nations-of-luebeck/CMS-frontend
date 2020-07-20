<template>
  <div>
    <v-container>
      <v-tabs fixed-tabs background-color="orange" v-model="tab">
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
                  <v-icon>mdi-dots-vertical</v-icon>
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
                  <v-icon>mdi-dots-vertical</v-icon>
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
    </v-container>
  </div>
</template>

<script>
import TooltippedIcon from "./generic/TooltippedIcon";
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
    };
  },
  async mounted() {
    try {
      const { data } = await this.$http.get(
        "https://munoltom.pythonanywhere.com/api/locations/"
      );
      this.locations = data;
    } catch (error) {
      alert(error);
    }

    try {
      const { data } = await this.$http.get(
        "https://munoltom.pythonanywhere.com/api/rooms/"
      );
      this.rooms = data;
    } catch (error) {
      alert(error);
    }
  },
  methods: {
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
@import "../../node_modules/leaflet/dist/leaflet.css";

.leaflet-fake-icon-image-2x {
  background-image: url(../../node_modules/leaflet/dist/images/marker-icon-2x.png);
}
.leaflet-fake-icon-shadow {
  background-image: url(../../node_modules/leaflet/dist/images/marker-shadow.png);
}
</style>
