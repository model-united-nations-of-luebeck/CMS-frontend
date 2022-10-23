<template>
  <v-container>
    <v-card elevation="2"> </v-card>

    <v-row class="flex-child">
      <v-col class="d-flex" cols="12" md="12">
        <v-sheet
          color=" lighten-3"
          elevation="1"
          style="padding: 20px;"
          width="100vw"
        >
          <p class="font-weight-bold display-2 text-center primary--text">
            <i>{{ conference.theme }}</i>
          </p>
          <p class="font-weight-medium headline text-center">
            {{ conference.annual_session | ordinal({ includeNumber: true }) }}
            annual session of Model United Nations of Lübeck
            <br />
            MUNOL
            {{ conference.year }}
          </p>
        </v-sheet>
      </v-col>
      <v-col cols="12" md="3">
        <!-- <v-sheet class="d-flex" color="green lighten-3" width="100%"> -->

        <v-card width="100%">
          <v-card-title
            ><v-icon left>mdi-volume-high</v-icon> Soundboard</v-card-title
          >
          <v-card-text
            class="font-weight-medium headline text-center"
            style="text-align: center;"
          >
            <div id="easybutton" @click="playEasy()">
              <span>easy</span>
            </div>
          </v-card-text>
          <p></p>
        </v-card>
        <v-card v-if="this.days < 0" width="100%" style="padding: 20px;">
          <v-card-title
            ><v-icon left>mdi-calendar-today</v-icon> Countdown</v-card-title
          >
          <v-card-text
            class="font-weight-medium headline text-center"
            style="text-align: center;"
          >
            <h2>{{ this.days }} days</h2>
            <br />
            <h3>until MUNOL</h3></v-card-text
          >
          <p></p>
        </v-card>
      </v-col>

      <v-col class="d-flex" cols="6" md="6">
        <v-sheet id="center-container"> </v-sheet>
      </v-col>

      <v-col class="d-flex" cols="12" md="3">
        <v-card width="100vw">
          <v-card-title
            ><v-icon left>mdi-open-in-new</v-icon>Links to external
            services</v-card-title
          >
          <v-card-text>
            <v-list nav shaped width="100%">
              <v-list-item-group color="primary">
                <v-list-item href="https://www.munol.org" target="_blank">
                  <v-list-item-icon>
                    <v-icon> mdi-earth</v-icon>
                  </v-list-item-icon>
                  <v-list-item-content>
                    <v-list-item-title>Website</v-list-item-title>
                  </v-list-item-content>
                </v-list-item>

                <v-list-item
                  href="https://www.munol.sharepoint.com"
                  target="_blank"
                >
                  <v-list-item-icon>
                    <v-icon> mdi-microsoft-office</v-icon>
                  </v-list-item-icon>
                  <v-list-item-content>
                    <v-list-item-title
                      >SharePoint / Office 365</v-list-item-title
                    >
                  </v-list-item-content>
                </v-list-item>

                <v-list-item href="http://www.archive.unol.org" target="_blank">
                  <v-list-item-icon>
                    <v-icon> mdi-archive</v-icon>
                  </v-list-item-icon>
                  <v-list-item-content>
                    <v-list-item-title>Archive</v-list-item-title>
                  </v-list-item-content>
                </v-list-item>

                <v-list-item
                  href="http://www.registration.munol.org"
                  target="_blank"
                >
                  <v-list-item-icon>
                    <v-icon> mdi-bank</v-icon>
                  </v-list-item-icon>
                  <v-list-item-content>
                    <v-list-item-title>School Registration</v-list-item-title>
                  </v-list-item-content>
                </v-list-item>

                <v-list-item href="http://www.tms.munol.org" target="_blank">
                  <v-list-item-icon>
                    <v-icon> mdi-application-edit</v-icon>
                  </v-list-item-icon>
                  <v-list-item-content>
                    <v-list-item-title>TMS Registration</v-list-item-title>
                  </v-list-item-content>
                </v-list-item>

                <v-list-item
                  href="http://www.advisor.munol.org"
                  target="_blank"
                >
                  <v-list-item-icon>
                    <v-icon> mdi-application</v-icon>
                  </v-list-item-icon>
                  <v-list-item-content>
                    <v-list-item-title>Advisor Registration</v-list-item-title>
                  </v-list-item-content>
                </v-list-item>
              </v-list-item-group>
            </v-list>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
export default {
  name: "Home",
  props: {
    msg: String,
  },
  data: () => ({
    conference: "",
  }),
  computed: {
    days: function () {
      const now = new Date();
      const startOfMUNOL = new Date(this.conference.startdate);
      const difference = Math.floor((startOfMUNOL - now) / (1000 * 3600 * 24));
      return difference;
    },
  },
  filters: {},
  methods: {
    playEasy: () => {
      new Audio(require("@/assets/audio/easy.mp3")).play();
    },
  },
  mounted() {
    this.$http
      .get("https://munoltom.pythonanywhere.com/api/conferences/")
      .then((response) => {
        [this.conference] = response.data;
      })
      .catch((error) => console.trace(`%c ${error}", "#FF0000`));
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
#center-container {
  width: 100vw;
  background-image: url("../assets/images/logo.png");
  background-size: contain;
  background-position: center;
}

#easybutton {
  background: red;
  color: white;
  margin: 0 auto;
  display: inline-block;
  width: 90px;
  height: 90px;
  border-radius: 50px;
  text-align: center;
  line-height: 90px;
  cursor: pointer;
  margin-right: 0px;
  margin-top: 20px;
  margin-bottom: 20px;

  background-color: #ee432e;
  background-image: -webkit-gradient(
    linear,
    left top,
    left bottom,
    color-stop(0%, #ee432e),
    color-stop(50%, #c63929),
    color-stop(50%, #b51700),
    color-stop(100%, #891100)
  );
  background-image: -webkit-linear-gradient(
    top,
    #ee432e 0%,
    #c63929 50%,
    #b51700 50%,
    #891100 100%
  );
  background-image: -moz-linear-gradient(
    top,
    #ee432e 0%,
    #c63929 50%,
    #b51700 50%,
    #891100 100%
  );
  background-image: -ms-linear-gradient(
    top,
    #ee432e 0%,
    #c63929 50%,
    #b51700 50%,
    #891100 100%
  );
  background-image: -o-linear-gradient(
    top,
    #ee432e 0%,
    #c63929 50%,
    #b51700 50%,
    #891100 100%
  );
  background-image: linear-gradient(
    top,
    #ee432e 0%,
    #c63929 50%,
    #b51700 50%,
    #891100 100%
  );
  border: 3px solid #fff;
  -webkit-box-shadow: inset 0 0 0 1px rgba(255, 115, 100, 0.4),
    0 1px 3px #333333;
  box-shadow: inset 0 0 0 1px rgba(255, 115, 100, 0.4), 0 1px 3px #333333;
  color: #fff;
  font: helvetica, arial, sans-serif;
  font-weight: bold;
  font-size: 18pt;
  text-align: center;
  text-shadow: 0 -1px 1px rgba(0, 0, 0, 0.8);
}
</style>
