<template>
  <div>
    <v-dialog v-model="dialog" max-width="600px">
      <v-card>
        <v-card-title>
          <span v-if="showName" @click="showName = false" class="headline">{{
            event.name
          }}</span>
          <v-text-field
            v-else
            @change="showName = true"
            v-model="event.name"
            required
          ></v-text-field>
          <v-spacer></v-spacer>
          <v-btn color="red" style="color: white;" @click="deleteEvent"
            >Delete
            <v-icon color="white" right>mdi-delete</v-icon>
          </v-btn>
        </v-card-title>
        <v-card-text>
          <v-form v-model="valid">
            <v-row>
              <v-col sm="12">
                <v-menu
                  v-model="picker_day"
                  :close-on-content-click="false"
                  transition="scale-transition"
                  offset-y
                  min-width="auto"
                >
                  <template v-slot:activator="{ on, attrs }">
                    <v-text-field
                      v-model="event.day"
                      label="Day"
                      prepend-icon="mdi-calendar"
                      readonly
                      v-bind="attrs"
                      v-on="on"
                      required
                      ><template slot="append-outer">
                        <v-tooltip bottom>
                          <template v-slot:activator="{ on }">
                            <v-icon v-on="on">mdi-help-circle</v-icon>
                          </template>
                          <span>On which day does this event take place?</span>
                        </v-tooltip>
                      </template></v-text-field
                    >
                  </template>
                  <v-date-picker
                    v-model="event.day"
                    show-adjacent-months
                    @input="picker_day = false"
                  ></v-date-picker>
                </v-menu>
              </v-col>
              <v-col sm="4">
                <v-menu
                  v-model="picker_start"
                  :close-on-content-click="false"
                  transition="scale-transition"
                  offset-y
                  min-width="auto"
                >
                  <template v-slot:activator="{ on, attrs }">
                    <v-text-field
                      v-model="event.start_time"
                      label="Start time"
                      prepend-icon="mdi-clock-start"
                      readonly
                      v-bind="attrs"
                      v-on="on"
                      required
                      ><template slot="append-outer">
                        <v-tooltip bottom>
                          <template v-slot:activator="{ on }">
                            <v-icon v-on="on">mdi-help-circle</v-icon>
                          </template>
                          <span>Specify the beginning time</span>
                        </v-tooltip>
                      </template></v-text-field
                    >
                  </template>
                  <v-time-picker
                    v-model="event.start_time"
                    @input="picker_start = false"
                  ></v-time-picker>
                </v-menu>
              </v-col>
              <v-col sm="4">
                <v-menu
                  v-model="picker_end"
                  :close-on-content-click="false"
                  transition="scale-transition"
                  offset-y
                  min-width="auto"
                >
                  <template v-slot:activator="{ on, attrs }">
                    <v-text-field
                      v-model="event.end_time"
                      label="End time"
                      prepend-icon="mdi-clock-end"
                      readonly
                      :disabled="open_ended"
                      v-bind="attrs"
                      v-on="on"
                      required
                      ><template slot="append-outer">
                        <v-tooltip bottom>
                          <template v-slot:activator="{ on }">
                            <v-icon v-on="on">mdi-help-circle</v-icon>
                          </template>
                          <span
                            >Specify the end time, if it's not open ended</span
                          >
                        </v-tooltip>
                      </template></v-text-field
                    >
                  </template>
                  <v-time-picker
                    v-model="event.end_time"
                    @input="picker_end = false"
                  ></v-time-picker>
                </v-menu>
              </v-col>
              <v-col sm="4">
                <v-checkbox
                  v-model="open_ended"
                  label="open ended"
                ></v-checkbox>
              </v-col>
              <v-col sm="12">
                <v-select
                  label="Location"
                  hint="Select where the event happens"
                  prepend-icon="mdi-map-marker"
                  :items="locations"
                  item-text="name"
                  item-value="id"
                  v-model="event.location"
                ></v-select>
              </v-col>
              <v-col sm="12">
                <v-textarea
                  label="Additional information"
                  v-model="event.info"
                  :rules="rules.infoRules"
                  counter
                  prepend-icon="mdi-information"
                  hint="Add additional information, e.g. dress code, speakers title"
                ></v-textarea>
              </v-col>
            </v-row>
          </v-form>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>

          <!-- <v-btn color="red " text @click="cancel">
            Cancel
          </v-btn> -->
          <v-btn color="green" text @click="save" :disabled="!valid">
            Save
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
export default {
  components: {},
  name: "EventDialog",
  props: ["event", "locations"],
  data: () => ({
    dialog: false,
    errorMessage: "",
    valid: false,
    picker_day: "",
    picker_start: "",
    picker_end: "",
    open_ended: false,
    showName: true,
    rules: {
      infoRules: [(v) => v.length <= 200 || "Max 200 characters"],
    },
  }),
  watch: {
    dialog: (newValue) => {
      if (!newValue) {
        console.log("closeddialog");
        this.save();
      }
    },
  },
  mounted() {},
  methods: {
    open() {
      this.dialog = true;
    },
    cancel() {
      this.dialog = false;
    },
    save() {
      this.$emit("changed", this.event);
      this.dialog = false;
    },
    deleteEvent() {
      this.$emit("deleted", this.event);
      this.dialog = false;
    },
  },
};
</script>
