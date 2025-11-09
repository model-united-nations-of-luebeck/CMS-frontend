<script setup>
import { ref, inject } from "vue";
import { toast } from "vue3-toastify";
import { useRoute } from "vue-router";

const route = useRoute();

const conference_abbr = import.meta.env.VITE_CONFERENCE_ABBREVIATION;

const showTokenSentDialog = ref(false);
const participantRegistrationView = ref(null);
const email = ref("");
const callback_token = ref("");
const loading = ref(false);
const http = inject("backend_instance");

function reloadPage() {
  window.location.reload();
}

const showLoginDialog = (response) => {
  if (response?.status === 403) {
    if (response.data?.dialog == "token_sent") {
      showTokenSentDialog.value = true;
    } else if (response.data?.dialog == "no_email") {
      toast.error(
        'You have not provided an email address yet, therefore you cannot log in. Please contact the Conference Management at <a href="mailto:conferencemanager@munol.org">conferencemanager@munol.org</a>.',
        {
          position: toast.POSITION.BOTTOM_CENTER,
          autoClose: false,
          dangerouslyHTMLString: true,
        },
      );
    } else {
      toast.error("You are not allowed to access this page.", {
        position: toast.POSITION.BOTTOM_CENTER,
        autoClose: false,
      });
    }
  }
};

async function login() {
  loading.value = true;
  await http
    .post(http.defaults.baseURL.replace(/api\/$/, "") + "auth/token/", {
      email: email.value,
      token: callback_token.value,
    })
    .then((response) => {
      loading.value = false;
      showTokenSentDialog.value = false;
      http.defaults.headers.common["Authorization"] = `Token ${response.data.token}`;
      email.value = null; // Reset email after successful login
      callback_token.value = null; // Reset callback token after successful login
      participantRegistrationView.value?.retry();
    })
    .catch((err) => {
      loading.value = false;
      toast.error(err.response?.data?.detail || "Login failed. Please retry by reloading page.", {
        position: toast.POSITION.BOTTOM_CENTER,
        autoClose: false,
      });
    });
}
</script>

<template>
  <div class="registration">
    <v-container v-if="route.name === 'registration'">
      <v-sheet>
        <v-card>
          <v-card-title>Registration</v-card-title>
          <v-card-text>
            <p>
              Thanks for being interested in participating in our conference. If you or your school
              haven't already applied for the next conference, please do so. As an MUN-Director of a
              school, please send an email to the Conference Management at
              <a href="mailto:conferencemanager@munol.org">conferencemanager@munol.org</a>. If you
              want to become a Student Officer, please contact the Secretaries-General at
              <a href="mailto:secretarygeneral@munol.org">secretarygeneral@munol.org</a>.
            </p>
            <br />
            <p>
              If you already successfully applied, please check your emails for further
              instructions. You should have received a personalized URL where you can enter your
              data to complete your registration.
            </p>
            <br />
            <p>
              In case of any questions, don't hesitate to contact us at
              <a href="mailto:conferencemanager@munol.org">conferencemanager@munol.org</a>.
            </p>
          </v-card-text>
        </v-card>
      </v-sheet>
    </v-container>

    <v-dialog
      v-model="showTokenSentDialog"
      width="500"
      persistent
      max-width="90%"
      transition="slide-y-transition"
    >
      <v-card>
        <v-card-title class="headline"> {{ conference_abbr }} Registration </v-card-title>
        <v-card-text>
          <p>
            A token was sent to your email address. Please check your inbox, and if necessary your
            spam folder. Please enter your email address and the token you received to log in.
          </p>
          <br />
          <v-form @submit.prevent="login">
            <v-text-field
              autofocus
              v-model="email"
              label="Email address"
              placeholder="user@domain.com"
              type="text"
              required
              outlined
              prepend-inner-icon="mdi-email"
              class="mb-4"
            ></v-text-field>

            <v-otp-input
              v-model="callback_token"
              :loading="loading"
              length="6"
              variant="solo"
              @finish="login"
            ></v-otp-input>
          </v-form>

          <br />
          <div style="display: flex; justify-content: center">
            <v-btn prepend-icon="mdi-reload" small @click.prevent="reloadPage" variant="tonal">
              Resend the token
            </v-btn>
          </div>

          <br />
          <p>
            If you have any issues with the registration, please contact us at
            <a href="mailto:conferencemanager@munol.org">conferencemanager@munol.org</a>
          </p>
        </v-card-text>
      </v-card>
    </v-dialog>

    <router-view v-slot="{ Component }">
      <component
        :is="Component"
        ref="participantRegistrationView"
        @show-login-dialog="showLoginDialog"
      ></component>
    </router-view>
  </div>
</template>

<style scoped></style>
