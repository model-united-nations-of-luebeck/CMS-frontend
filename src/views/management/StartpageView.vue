<script setup>
import easy from "@/assets/audio/easy.mp3";
import { useConferenceStore } from "../../stores/conference";

const playEasy = function () {
  const audio = new Audio(easy);
  audio.play();
};

const conferenceStore = useConferenceStore();
conferenceStore.getCurrentConference();
</script>

<template>
  <div class="">
    <img
      src="@/assets/images/munollogo.png"
      alt="MUNOL Logo"
      id="logo"
      width="300"
    />
    <h1 id="motto" class="text-center">AD URBEM TERRARUM CONSOCIANDUM</h1>

    <div class="columns">
      <v-card class="column" hover title="Countdown">
        <template v-slot:prepend>
          <v-icon color="primary" icon="mdi-calendar-heart"></v-icon>
        </template>

        <v-card-text class="text-center">
          <h1 class="text-h1" style="margin: 40px">
            {{
              Math.ceil(
                (new Date(conferenceStore.conference?.start_date) -
                  new Date()) /
                  (1000 * 60 * 60 * 24),
              )
            }}
          </h1>
          <p class="text-h6">
            days until MUNOL {{ conferenceStore.conference?.year }}
          </p>
        </v-card-text>
      </v-card>

      <v-card class="column" hover title="Link Collection">
        <template v-slot:prepend>
          <v-icon color="primary" icon="mdi-open-in-new"></v-icon>
        </template>
        <v-card-text>
          <v-list nav shaped width="100%">
            <v-list-item-group color="primary">
              <v-list-item href="https://www.munol.org" target="_blank">
                <template v-slot:prepend>
                  <v-icon color="primary"> mdi-earth</v-icon>
                </template>
                <v-list-item-content>
                  <v-list-item-title>Website</v-list-item-title>
                </v-list-item-content>
              </v-list-item>

              <v-list-item href="https://munol.sharepoint.com" target="_blank">
                <template v-slot:prepend>
                  <v-icon color="primary"> mdi-microsoft-office</v-icon>
                </template>
                <v-list-item-content>
                  <v-list-item-title>SharePoint / Office 365</v-list-item-title>
                </v-list-item-content>
              </v-list-item>

              <v-list-item
                href="http://www.registration.munol.org"
                target="_blank"
              >
                <template v-slot:prepend>
                  <v-icon color="primary"> mdi-bank</v-icon>
                </template>
                <v-list-item-content>
                  <v-list-item-title>School Registration</v-list-item-title>
                </v-list-item-content>
              </v-list-item>

              <v-list-item href="http://www.advisor.munol.org" target="_blank">
                <template v-slot:prepend>
                  <v-icon color="primary"> mdi-application</v-icon>
                </template>
                <v-list-item-content>
                  <v-list-item-title>Advisor Registration</v-list-item-title>
                </v-list-item-content>
              </v-list-item>
            </v-list-item-group>
          </v-list>
        </v-card-text>
      </v-card>

      <v-card class="column" hover title="Soundboard">
        <template v-slot:prepend>
          <v-icon color="primary" icon="mdi-bullhorn"></v-icon>
        </template>

        <v-card-text class="text-center">
          <div id="easy-button" @click="playEasy()">
            <span>easy</span>
          </div>
        </v-card-text>
      </v-card>
    </div>
  </div>
</template>

<style>
.columns {
  display: flex;
  justify-content: space-around;
  margin-top: 20px;

  animation: fade-in;
  animation-duration: 2s;
  animation-delay: 3s;
  opacity: 0;
  animation-fill-mode: forwards;
}

@keyframes fade-in {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

#logo {
  display: block;
  margin: 10px auto;
  animation: rotating-logo;
  animation-duration: 2s;
}

#motto {
  text-align: center;

  font-weight: bold;
  color: #333;
  animation: fly-in;
  animation-fill-mode: forwards;
  animation-delay: 1s;
  opacity: 0;
  animation-fill-mode: forwards;
  animation-duration: 2s;
}

@keyframes rotating-logo {
  from {
    transform: rotate(240deg);
  }
  to {
    transform: rotate(360deg);
  }
}

@keyframes fly-in {
  from {
    font-size: 0pt;
    opacity: 0;
  }
  to {
    font-size: 32pt;
    opacity: 1;
  }
}

.columns {
  display: flex;
  justify-content: space-between;
  margin-top: 20px;
}

.column {
  flex: 1;
  padding: 10px;
  margin: 0 10px;
}

#easy-button {
  background: red;
  color: white;
  margin: 50px;
  display: inline-block;
  width: 140px;
  height: 140px;
  border-radius: 70px;
  text-align: center;
  line-height: 140px;
  cursor: pointer;

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
  -webkit-box-shadow:
    inset 0 0 0 1px rgba(255, 115, 100, 0.4),
    0 1px 3px #333333;
  box-shadow:
    inset 0 0 0 1px rgba(255, 115, 100, 0.4),
    0 1px 3px #333333;
  color: #fff;
  font: helvetica, arial, sans-serif;
  font-weight: bold;
  font-size: 28pt;
  text-align: center;
  text-shadow: 0 -1px 1px rgba(0, 0, 0, 0.8);
}
</style>
