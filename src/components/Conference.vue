<template>
  <div>
    <v-container>
      <v-form ref="form" v-model="validationRules.valid" lazy-validation>
        <div class="text-h4">General</div>
        <v-row>
          <v-col sm="12">
            <v-text-field
              v-model="conference.theme"
              label="Conference Theme"
              name="theme"
              :value="conference.theme"
              prepend-icon="mdi-message-question"
              type="text"
            /> </v-col
        ></v-row>

        <v-row>
          <v-col sm="3">
            <v-text-field
              v-model="conference.year"
              label="Conference year"
              name="year"
              :value="conference.year"
              prepend-icon="mdi-calendar-month"
              type="number"
              :rules="validationRules.yearRules"
              required
              ><template slot="append-outer">
                <v-tooltip bottom>
                  <template v-slot:activator="{ on }">
                    <v-icon v-on="on">mdi-help-circle</v-icon>
                  </template>
                  <span
                    >Use format YYYY for years so 2019 instead of just 19</span
                  >
                </v-tooltip>
              </template></v-text-field
            >
          </v-col>
          <v-col sm="3">
            <v-text-field
              v-model="conference.annual_session"
              label="Annual session"
              name="session"
              :value="conference.annual_session"
              prepend-icon="mdi-counter"
              type="number"
              :rules="validationRules.annualSessionRules"
              required
              ><template slot="append-outer">
                <v-tooltip bottom>
                  <template v-slot:activator="{ on }">
                    <v-icon v-on="on">mdi-help-circle</v-icon>
                  </template>
                  <span
                    >First session was in 1998, i.e. MUNOL 2020 will be the 23rd
                    session</span
                  >
                </v-tooltip>
              </template></v-text-field
            >
          </v-col>
          <v-col sm="3">
            <v-menu
              v-model="picker_startdate"
              :close-on-content-click="false"
              transition="scale-transition"
              offset-y
              min-width="auto"
            >
              <template v-slot:activator="{ on, attrs }">
                <v-text-field
                  v-model="conference.startdate"
                  label="Start date"
                  prepend-icon="mdi-calendar-today"
                  readonly
                  v-bind="attrs"
                  v-on="on"
                  :rules="validationRules.startDateRules"
                  required
                  ><template slot="append-outer">
                    <v-tooltip bottom>
                      <template v-slot:activator="{ on }">
                        <v-icon v-on="on">mdi-help-circle</v-icon>
                      </template>
                      <span
                        >Use the first day of the conference as start date, at
                        MUNOL it's usually Monday</span
                      >
                    </v-tooltip>
                  </template></v-text-field
                >
              </template>
              <v-date-picker
                v-model="conference.startdate"
                show-adjacent-months
                @input="picker_startdate = false"
              ></v-date-picker>
            </v-menu>
          </v-col>
          <v-col sm="3">
            <v-menu
              v-model="picker_enddate"
              :close-on-content-click="false"
              transition="scale-transition"
              offset-y
              min-width="auto"
            >
              <template v-slot:activator="{ on, attrs }">
                <v-text-field
                  v-model="conference.enddate"
                  label="End date"
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
                      <span
                        >Last day of the conference, at MUNOL usually
                        Saturday</span
                      >
                    </v-tooltip>
                  </template></v-text-field
                >
              </template>
              <v-date-picker
                v-model="conference.enddate"
                show-adjacent-months
                @input="picker_enddate = false"
              ></v-date-picker>
            </v-menu>
          </v-col>
        </v-row>
        <div class="text-h4">Deadlines</div>
        <v-row>
          <v-col sm="4">
            <v-datetime-picker
              v-model="conference.pre_registration_deadline"
              :text-field-props="textFieldPropsPrereg"
              :time-picker-props="timePickerProps"
              required
            >
              <template slot="dateIcon">
                <v-icon>mdi-calendar</v-icon>
              </template>
              <template slot="timeIcon">
                <v-icon>mdi-clock</v-icon>
              </template>
              <template slot="actions" slot-scope="{}"><span></span> </template>
            </v-datetime-picker>
          </v-col>
          <v-col sm="4">
            <v-datetime-picker
              v-model="conference.final_registration_deadline"
              :text-field-props="textFieldPropsFinal"
              :time-picker-props="timePickerProps"
            >
              <template slot="dateIcon">
                <v-icon>mdi-calendar</v-icon>
              </template>
              <template slot="timeIcon">
                <v-icon>mdi-clock</v-icon>
              </template>
              <template slot="actions" slot-scope="{}"><span></span> </template>
            </v-datetime-picker>
          </v-col>
          <v-col sm="4">
            <v-datetime-picker
              v-model="conference.position_paper_deadline"
              :text-field-props="textFieldPropsPositionPaper"
              :time-picker-props="timePickerProps"
            >
              <template slot="dateIcon">
                <v-icon>mdi-calendar</v-icon>
              </template>
              <template slot="timeIcon">
                <v-icon>mdi-clock</v-icon>
              </template>
              <template slot="actions" slot-scope="{}"><span></span> </template>
            </v-datetime-picker>
          </v-col>
        </v-row>
        <div class="text-h4">Association Board Members</div>

        <v-row>
          <v-col sm="3">
            <v-text-field
              v-model="conference.chairhuman"
              label="Chair:wo:man"
              name="chairhuman"
              :value="conference.chairhuman"
              prepend-icon="mdi-account"
              type="text"
              :rules="validationRules.associationRules"
              required
              ><template slot="append-outer">
                <v-tooltip bottom>
                  <template v-slot:activator="{ on }">
                    <v-icon v-on="on">mdi-help-circle</v-icon>
                  </template>
                  <span
                    >Full name of the Chairman/woman of the MUNOL
                    Association</span
                  >
                </v-tooltip>
              </template></v-text-field
            >
          </v-col>
          <v-col sm="3">
            <v-text-field
              v-model="conference.vice_chairhuman"
              label="Vice-Chair:wo:man"
              name="vicechairhuman"
              :value="conference.vice_chairhuman"
              prepend-icon="mdi-account"
              type="text"
              ><template slot="append-outer">
                <v-tooltip bottom>
                  <template v-slot:activator="{ on }">
                    <v-icon v-on="on">mdi-help-circle</v-icon>
                  </template>
                  <span>
                    Full name of the Vice-Chairman/woman of the MUNOL
                    Association</span
                  >
                </v-tooltip>
              </template></v-text-field
            >
          </v-col>
          <v-col sm="3">
            <v-text-field
              v-model="conference.treasurer"
              label="Treasurer"
              name="treasurer"
              :value="conference.treasurer"
              prepend-icon="mdi-account-cash"
              type="text"
              ><template slot="append-outer">
                <v-tooltip bottom>
                  <template v-slot:activator="{ on }">
                    <v-icon v-on="on">mdi-help-circle</v-icon>
                  </template>
                  <span
                    >Full name of the Treasurer of the MUNOL Association</span
                  >
                </v-tooltip>
              </template></v-text-field
            >
          </v-col>
          <v-col sm="3">
            <v-text-field
              v-model="conference.vice_treasurer"
              label="Vice-Treasurer"
              name="vicetreasurer"
              :value="conference.vice_treasurer"
              prepend-icon="mdi-account-cash"
              type="text"
              ><template slot="append-outer">
                <v-tooltip bottom>
                  <template v-slot:activator="{ on }">
                    <v-icon v-on="on">mdi-help-circle</v-icon>
                  </template>
                  <span
                    >Full name of the Vice-Treasurer of the MUNOL
                    Association</span
                  >
                </v-tooltip>
              </template></v-text-field
            >
          </v-col>
        </v-row>
        <v-row>
          <v-col sm="12" style="text-align: right;">
            <v-btn
              :disabled="!validationRules.valid"
              color="primary"
              @click="updateConferenceSettings"
            >
              Update
              <v-icon right dark> mdi-send </v-icon>
            </v-btn></v-col
          ></v-row
        >

        <v-snackbar v-model="successSnackbar" color="success" timeout="2000">
          Successfully updated conference
          <template v-slot:action="{ attrs }">
            <v-btn text v-bind="attrs" @click="successSnackbar = false">
              OK
            </v-btn>
          </template>
        </v-snackbar>
        <v-snackbar v-model="errorSnackbar" color="error">
          Updating conference failed. Details: {{ errorMessage }}
          <template v-slot:action="{ attrs }">
            <v-btn text v-bind="attrs" @click="errorSnackbar = false">
              OK
            </v-btn>
          </template>
        </v-snackbar>
      </v-form>
    </v-container>
  </div>
</template>

<script>
export default {
  name: "Conference",
  components: {},
  data: () => ({
    picker_startdate: "",
    picker_enddate: "",
    textFieldPropsPrereg: {
      prependIcon: "mdi-calendar-clock",
      hint: "Pre-Registration deadline",
      persistentHint: true,
    },
    textFieldPropsFinal: {
      prependIcon: "mdi-calendar-clock",
      hint: "Final Registration deadline",
      persistentHint: true,
    },
    textFieldPropsPositionPaper: {
      prependIcon: "mdi-calendar-clock",
      hint: "Position Paper deadline",
      persistentHint: true,
    },
    timePickerProps: {
      format: "24hr",
    },
    validationRules: {
      yearRules: [
        (y) => !!y || "Year is required",
        (y) => y.length == 4 || "Please give the year in YYYY format",
      ],
      annualSessionRules: [(as) => !!as || "Annual session is required"],
      associationRules: [(a) => !!a || "Board members are required"],
      valid: true,
    },
    conference: {
      theme: "",
      annual_session: "",
      year: "",
      startdate: "",
      enddate: "",
      pre_registration_deadline: "",
      final_registration_deadline: "",
      position_paper_deadline: "",
      chairhuman: "",
      vice_chairhuman: "",
      treasurer: "",
      vice_treasurer: "",
    },
    successSnackbar: false,
    errorSnackbar: false,
    errorMessage: "",
  }),
  mounted() {
    this.$http
      .get("api/conferences/")
      .then((response) => {
        [this.conference] = response.data;
        this.conference.pre_registration_deadline = new Date(
          this.conference.pre_registration_deadline
        );
        this.conference.final_registration_deadline = new Date(
          this.conference.final_registration_deadline
        );
        this.conference.position_paper_deadline = new Date(
          this.conference.position_paper_deadline
        );
        this.$refs.form.resetValidation();
      })
      .catch((error) => console.trace(`%c ${error}", "#FF0000`));
  },
  methods: {
    async updateConferenceSettings() {
      await this.$http
        .put(`api/conferences/1/`, this.conference, {})
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
  computed: {},
};
</script>

<style>
.text-h4 {
  margin-bottom: 20px;
  margin-top: 15px;
  display: inline-block;
}
</style>
