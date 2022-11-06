<template>
  <div>
    <v-container grid-list-md>
      <v-layout row wrap>
        <v-flex d-flex xs12 sm8 md7>
          <v-card>
            <v-card-title><v-icon left>mdi-note</v-icon>Placards</v-card-title>
            <v-card-text>
              <p>
                Placards are used for Delegates but also Student Officers and
                Executives to identify them in large meetings. Note that
                delegations of non-member states of the UN without full voting
                rights such as NGOs/IGOs obtain special placards printed on
                coloured paper so that one can quickly identify their special
                voting rights.
              </p>
              <h3>General Assembly</h3>
              <p>
                For the Opening Ceremonies, Closing Ceremonies and Plenary
                Sessions like the General Assembly the placards are usually
                printed on DIN A3 paper so that one can read them more easily
              </p>

              <v-row align="center">
                <v-col class="d-flex" sm="3"> </v-col>
                <v-col class="d-flex" sm="3">
                  <v-switch
                    inset
                    v-model="ga_member_states"
                    :label="`${
                      ga_member_states ? 'Member States' : 'Non-Member States'
                    }`"
                  ></v-switch>
                </v-col>
                <v-col sm="3">
                  <v-btn-toggle v-model="ga_pagesize" color="primary" dense>
                    <v-btn value="A3"> <v-icon left>mdi-note</v-icon>A3</v-btn>
                    <v-btn value="A4"> <v-icon left>mdi-note</v-icon>A4</v-btn>
                  </v-btn-toggle>
                </v-col>
                <v-col class="d-flex" sm="3" align="center">
                  <v-btn
                    :href="`https://munoltom.pythonanywhere.com/pdfs/placards?pagesize=${this.ga_pagesize}&memberstates=${this.ga_member_states}`"
                    target="_blank"
                    color="primary"
                    ><v-icon left>mdi-printer</v-icon>Print</v-btn
                  >
                </v-col>
              </v-row>
              <h3>Forums</h3>
              <p>
                For normal forum sessions the placards are usually printed on
                DIN A4 paper
              </p>

              <v-row align="center">
                <v-col class="d-flex" sm="3">
                  <v-select
                    v-model="forumid"
                    :items="forums"
                    item-text="name"
                    item-value="id"
                    label="Select a forum"
                  ></v-select>
                </v-col>
                <v-col class="d-flex" sm="3">
                  <v-switch
                    inset
                    v-model="forum_member_states"
                    :label="`${
                      forum_member_states
                        ? 'Member States'
                        : 'Non-Member States'
                    }`"
                  ></v-switch>
                </v-col>
                <v-col sm="3">
                  <v-btn-toggle v-model="forum_pagesize" color="primary" dense>
                    <v-btn value="A3"> <v-icon left>mdi-note</v-icon>A3</v-btn>
                    <v-btn value="A4"> <v-icon left>mdi-note</v-icon>A4</v-btn>
                  </v-btn-toggle>
                </v-col>
                <v-col class="d-flex" sm="3" align="center">
                  <v-btn
                    :href="`https://munoltom.pythonanywhere.com/pdfs/forum_placards?pagesize=${this.forum_pagesize}&forumid=${this.forumid}&memberstates=${this.forum_member_states}`"
                    target="_blank"
                    color="primary"
                    ><v-icon left>mdi-printer</v-icon>Print</v-btn
                  >
                </v-col>
              </v-row>

              <h3>Staff Placards</h3>
              <p>
                Placards for Executives and Student Officers are always printed
                on DIN A3 paper
              </p>

              <v-row align="center">
                <v-col class="d-flex" sm="4">
                  <v-btn
                    :href="`https://munoltom.pythonanywhere.com/pdfs/executive_placards?pagesize=A3`"
                    target="_blank"
                    color="primary"
                    ><v-icon left>mdi-printer</v-icon>Print Executives</v-btn
                  >
                </v-col>
                <v-col class="d-flex" sm="4">
                  <v-btn
                    :href="`https://munoltom.pythonanywhere.com/pdfs/student_officer_placards?pagesize=A3`"
                    target="_blank"
                    color="primary"
                    ><v-icon left>mdi-printer</v-icon>Print Student
                    Officers</v-btn
                  >
                </v-col>
              </v-row>

              <h3>Custom Placards</h3>
              <p>
                Sometimes it is necessary to print custom placards, e.g. for
                guest speakers
              </p>
              <v-row align="center">
                <v-col class="d-flex" sm="4">
                  <v-text-field
                    v-model="custom_title"
                    label="Title"
                  ></v-text-field>
                </v-col>
                <v-col class="d-flex" sm="2"> </v-col>
                <v-col sm="3">
                  <v-btn-toggle v-model="custom_pagesize" color="primary" dense>
                    <v-btn value="A3"> <v-icon left>mdi-note</v-icon>A3</v-btn>
                    <v-btn value="A4"> <v-icon left>mdi-note</v-icon>A4</v-btn>
                  </v-btn-toggle>
                </v-col>
                <v-col class="d-flex" sm="3" align="center">
                  <v-btn
                    :href="`https://munoltom.pythonanywhere.com/pdfs/custom_placard?pagesize=${this.custom_pagesize}&name=${this.custom_title}`"
                    target="_blank"
                    color="primary"
                    ><v-icon left>mdi-printer</v-icon>Print</v-btn
                  >
                </v-col>
              </v-row>
            </v-card-text>
          </v-card>
        </v-flex>

        <v-flex d-flex xs12 sm4 md5>
          <v-card>
            <v-card-title
              ><v-icon left>mdi-badge-account-horizontal</v-icon
              >Badges</v-card-title
            >
            <v-card-text>
              <p>
                Every participant receives a badge upon registration. As badges
                are used for identification as conference participants they
                should be treated with upmost care.
              </p>
              <v-row align="center">
                <v-col class="d-flex" sm="4">
                  <v-btn
                    href="https://munoltom.pythonanywhere.com/pdfs/delegate_badge"
                    target="_blank"
                    color="primary"
                    ><v-icon left>mdi-printer</v-icon>Delegates</v-btn
                  > </v-col
                ><v-col class="d-flex" sm="4">
                  <v-btn
                    href="https://munoltom.pythonanywhere.com/pdfs/mundirector_badge"
                    target="_blank"
                    color="primary"
                    ><v-icon left>mdi-printer</v-icon>MUN-Directors</v-btn
                  ></v-col
                ><v-col class="d-flex" sm="4">
                  <v-btn
                    href="https://munoltom.pythonanywhere.com/pdfs/staff_badge"
                    target="_blank"
                    color="primary"
                    ><v-icon left>mdi-printer</v-icon>Staffs</v-btn
                  ></v-col
                >
              </v-row>
              <v-row align="center">
                <v-col class="d-flex" sm="4">
                  <v-btn
                    href="https://munoltom.pythonanywhere.com/pdfs/executive_badge"
                    target="_blank"
                    color="primary"
                    ><v-icon left>mdi-printer</v-icon>Executives</v-btn
                  ></v-col
                ><v-col class="d-flex" sm="4">
                  <v-btn
                    href="https://munoltom.pythonanywhere.com/pdfs/student_officer_badge"
                    target="_blank"
                    color="primary"
                    ><v-icon left>mdi-printer</v-icon>Student Officers</v-btn
                  ></v-col
                ><v-col class="d-flex" sm="4">
                  <v-btn
                    href="https://munoltom.pythonanywhere.com/pdfs/advisor_badge"
                    target="_blank"
                    color="primary"
                    ><v-icon left>mdi-printer</v-icon>Advisors</v-btn
                  >
                </v-col>
              </v-row>

              <h3>Custom Badge</h3>
              <!-- firstname, lastname, affiliation, position, color, base64photo -->
              <v-form
                method="post"
                action="https://munoltom.pythonanywhere.com/pdfs/custom_badge"
              >
                <v-text-field
                  name="csrftoken"
                  :value="csrf_token"
                  hint="hidden csrf token from cookie for post request"
                  v-show="false"
                ></v-text-field>
                <v-row>
                  <v-col sm="6">
                    <v-text-field
                      name="first_name"
                      label="First name"
                    ></v-text-field>
                  </v-col>
                  <v-col sm="6">
                    <v-text-field
                      name="last_name"
                      label="Last name"
                    ></v-text-field>
                  </v-col>
                </v-row>
                <v-row>
                  <v-col sm="6">
                    <v-text-field
                      name="affiliation"
                      label="School"
                      hint="or affiliation like MUNOL Association"
                    ></v-text-field>
                  </v-col>
                  <v-col sm="6">
                    <v-text-field
                      name="position"
                      label="Position"
                      hint="or guest"
                    ></v-text-field>
                  </v-col>
                </v-row>

                <v-row>
                  <v-col sm="6">
                    <v-text-field
                      name="color"
                      :value="color.substring(0, 7)"
                      hint="hidden color picker post value field"
                      v-show="false"
                    ></v-text-field>
                    <v-color-picker
                      v-model="color"
                      dot-size="25"
                      swatches-max-height="200"
                      hide-inputs
                    ></v-color-picker>
                  </v-col>

                  <v-col sm="6">
                    <v-text-field
                      name="base64photo"
                      :value="base64photo"
                      hint="hidden base64photo post value field"
                      v-show="false"
                    ></v-text-field>
                    <v-file-input
                      label="Badge Photo"
                      chips
                      show-size
                      small-chips
                      @change="encodePhoto"
                    ></v-file-input>
                    <!-- @click="customBadge" -->
                    <v-btn target="_blank" color="primary" type="submit"
                      ><v-icon left>mdi-printer</v-icon>Print Badge</v-btn
                    >
                  </v-col>
                </v-row>
              </v-form>
            </v-card-text>
          </v-card>
        </v-flex>

        <v-flex d-flex xs12 sm4 md4>
          <v-card>
            <v-card-title
              ><v-icon left>mdi-certificate</v-icon>Certificates</v-card-title
            >
            <v-card-text>
              <p>
                Every participant receives a certificate at the end of the
                conference. This document may be used for further applications
                as a proof of participation. Printing and preparation of the
                certificates should already be started right after the beginning
                of the conference.
              </p>

              <h3>Signed by SecGens</h3>
              <v-btn
                href="https://munoltom.pythonanywhere.com/pdfs/delegate_certificate"
                target="_blank"
                color="primary"
                ><v-icon left>mdi-printer</v-icon>Delegates</v-btn
              >
              <v-btn
                href="https://munoltom.pythonanywhere.com/pdfs/student_officer_certificate"
                target="_blank"
                color="primary"
                ><v-icon left>mdi-printer</v-icon>Student Officers</v-btn
              >

              <h3>Signed by CMs</h3>
              <v-btn
                href="https://munoltom.pythonanywhere.com/pdfs/staff_certificate"
                target="_blank"
                color="primary"
                ><v-icon left>mdi-printer</v-icon>Staffs</v-btn
              >
              <v-btn
                href="https://munoltom.pythonanywhere.com/pdfs/executive_certificate"
                target="_blank"
                color="primary"
                ><v-icon left>mdi-printer</v-icon>Executives</v-btn
              >
              <v-btn
                href="https://munoltom.pythonanywhere.com/pdfs/mundirector_certificate"
                target="_blank"
                color="primary"
                ><v-icon left>mdi-printer</v-icon>MUN-Directors</v-btn
              >
            </v-card-text>
          </v-card>
        </v-flex>
        <v-flex d-flex xs12 sm4 md4>
          <v-card>
            <v-card-title
              ><v-icon left>mdi-list-status</v-icon>Roll Call
              Lists</v-card-title
            >
            <v-card-text>
              <p>
                These sheets may be used for checking the presence in forums.
              </p>
              <v-row align="center">
                <v-col class="d-flex" sm="12">
                  <v-select
                    v-model="forumid"
                    :items="forums"
                    item-text="name"
                    item-value="id"
                    label="Select a forum"
                  ></v-select>
                </v-col>
              </v-row>
              <v-row align="center">
                <v-col sm="6">
                  <v-btn-toggle v-model="forum_pagesize" color="primary" dense>
                    <v-btn value="A3"> <v-icon left>mdi-note</v-icon>A3</v-btn>
                    <v-btn value="A4"> <v-icon left>mdi-note</v-icon>A4</v-btn>
                  </v-btn-toggle>
                </v-col>
                <v-col class="d-flex" sm="6" align="center">
                  <v-btn
                    :href="`https://munoltom.pythonanywhere.com/pdfs/forum_roll_call_list?pagesize=${this.forum_pagesize}&forumid=${this.forumid}`"
                    target="_blank"
                    color="primary"
                    ><v-icon left>mdi-printer</v-icon>Print</v-btn
                  >
                </v-col>
              </v-row>
              <v-row align="center">
                <v-col sm="12">
                  <v-btn
                    :href="`https://munoltom.pythonanywhere.com/pdfs/forum_roll_call_list?pagesize=A3`"
                    target="_blank"
                    color="primary"
                    ><v-icon left>mdi-printer</v-icon>Print Plenary</v-btn
                  >
                </v-col>
              </v-row>
            </v-card-text>
          </v-card>
        </v-flex>
        <v-flex d-flex xs12 sm4 md4>
          <v-card>
            <v-card-title
              ><v-icon left>mdi-sign-direction</v-icon>Signs</v-card-title
            >
            <v-card-text>
              <p>
                To guide the participants within the conference venues, signs
                can be generated and placed accordingly.
              </p>

              <v-text-field
                v-model="sign_text"
                label="Sign Text"
              ></v-text-field>

              <v-row align="center">
                <v-col sm="6">
                  <v-btn-toggle v-model="sign_pagesize" color="primary" dense>
                    <v-btn value="A3"> <v-icon left>mdi-note</v-icon>A3</v-btn>
                    <v-btn value="A4"> <v-icon left>mdi-note</v-icon>A4</v-btn>
                  </v-btn-toggle>
                </v-col>
                <v-col sm="6">
                  <v-btn
                    :href="`https://munoltom.pythonanywhere.com/pdfs/signs?pagesize=${sign_pagesize}$&text=${text}`"
                    target="_blank"
                    color="primary"
                    ><v-icon left>mdi-printer</v-icon>Print</v-btn
                  >
                </v-col>
              </v-row>
            </v-card-text>
          </v-card>
        </v-flex>
      </v-layout>
    </v-container>
  </div>
</template>

<script>
import Cookies from "js-cookie";
import axios from "axios";
export default {
  name: "Printing",

  data: () => ({
    forumid: "",
    forums: null,
    forum_member_states: true,
    ga_member_states: true,
    custom_title: "",
    custom_pagesize: "A4",
    forum_pagesize: "A4",
    ga_pagesize: "A3",
    firstname: "",
    lastname: "",
    affiliation: "",
    position: "",
    base64photo: "",
    color: "990000",
    sign_pagesize: "A4",
    sign_text: "",
    csrf_token: "",
  }),
  methods: {
    encodePhoto: function (file) {
      // converts image file to base64 encoded string
      const reader = new FileReader();
      reader.readAsDataURL(file);

      reader.onload = () => {
        this.base64photo = reader.result.substring(22);
      };
    },
    customBadge: function () {
      // make post request with cookie containing csrf token
      axios({
        url: "https://munoltom.pythonanywhere.com/pdfs/custom_badge",
        method: "post",
        data: {
          first_name: "Tom",
        },
        headers: {
          "X-CSRFToken": this.csrf_token,
          Cookies: `csrftoken=${this.csrf_token}`,
        },
        withCredentials: true,
      }).catch((error) => {
        console.log(error);
      });
    },
  },
  async mounted() {
    // obtain CSRF Token from backend and set it in cookie
    this.csrf_token = Cookies.get("csrftoken");
    if (!this.csrf_token) {
      try {
        const { data } = await this.$http.get(
          "https://munoltom.pythonanywhere.com/pdfs/get-token"
        );
        this.csrf_token = data.token;
        Cookies.set("csrftoken", this.csrf_token);
      } catch (error) {
        alert(error);
      }
    }

    try {
      const { data } = await this.$http.get("api/forums/");
      this.forums = data;
    } catch (error) {
      alert(error);
    }
  },
};
</script>
