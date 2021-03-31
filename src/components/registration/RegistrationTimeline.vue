<template>
  <v-container>
    <p class="py-4">
      The process of applying for and getting enrolled into the MUNOL conference
      is called registration. In general, registration is divided into
      pre-registration and final registration. The entire registration process
      will be done online on our online registration platform. At any time, the
      Conference Managers are happy to guide you through the registration
      process, let you know what steps to take next and answer any questions.
    </p>
    <v-timeline>
      <v-timeline-item icon="mdi-account-edit">
        <template v-slot:opposite>
          <p :class="`headline  red--text`">
            Fall to Christmas
          </p>
          <span :class="`headline font-weight-light red--text`"
            >Deadline:
            {{
              new Date(conference.pre_registration_deadline).toLocaleString(
                "en",
              )
            }}</span
          >
        </template>
        <div class="py-4">
          <h2 :class="`headline font-weight-bold mb-4 red--text`">
            Pre-Registration
          </h2>
          <div>
            The aim of pre-registration is to figure out how many schools want
            to attend the conference with how many delegates. During
            pre-registration MUN-Directors basically just show interest to take
            part in the next MUNOL session by submitting their school’s name,
            contact details and most importantly a number of students they would
            like to take to Lübeck. Please note, that this is the number of
            students requested. Although the Conference Managers do their best
            to fulfil all requests and constraints, this is not always possible.
            So, it might happen that only a smaller number of students will be
            confirmed by the Conference Managers. Sometimes however, places
            become free again and MUN-Directors might be granted to bring more
            students. The deadline for pre-registration is usually before
            Christmas in December. Make sure to transfer the pre-registration
            fee in time so that the Conference Managers can take your delegation
            into consideration. In the past, there we several schools quitting
            registration at a late point and messed up all preparation that’s
            why the fee was introduced. The pre-registration fee will be charged
            against the conference fee, so this is no extra cost for your
            delegates. Of course, we will only charge the number of students the
            Conference Managers confirm, although the fee for the number of
            requested students has to be paid first.
          </div>
        </div>
      </v-timeline-item>
      <v-timeline-item icon="mdi-gesture-double-tap">
        <template v-slot:opposite>
          <span :class="`headline  red--text`">Between the years</span>
        </template>
        <div class="py-4">
          <h2 :class="`headline  font-weight-bold mb-4 red--text`">
            Country Allocation
          </h2>
          <div>
            Within the next couple of weeks, the Conference Managers in close
            cooperation with the Secretaries-General do the country allocation.
            Basically, they decide which delegations (states, non-governmental
            organisations, inter-governmental organisations, ...) will be
            represented in which forums and which delegation will be represented
            by which school. Like this, they will determine the number of
            students they confirm to each MUN-Director to bring to the
            conference and will inform them via email about it.
          </div>
        </div>
      </v-timeline-item>
      <v-timeline-item icon="mdi-account-check">
        <template v-slot:opposite>
          <p :class="`headline  red--text`">
            Spring
          </p>
          <span :class="`headline font-weight-light red--text`"
            >Deadline:
            {{
              new Date(conference.final_registration_deadline).toLocaleString(
                "en",
              )
            }}</span
          >
        </template>
        <div class="py-4">
          <h2 :class="`headline font-weight-bold mb-4 red--text`">
            Final Registration
          </h2>
          <div>
            In the final registration step, MUN-Directors as well as the
            participating students provide some personal information required
            for organizing the conference. As the information is personal and
            protected by data privacy regulations, each praticipating person has
            to give their constent for the data processing and storage first,
            before the data can be entered. Besides personal information like
            names, titles, email addresses, birth dates, diet also some
            conference-related information has to be set, e.g. who is the
            ambassador of the delegation or whether the MUN-Director is an
            English teacher. Participants are also asked to upload a photo in
            the style of a passport photo which will be used to create their
            badges. Once all the information is provided the Conference Managers
            will review everything. They will let you know if anything needs to
            be done or if you’ve just completed the registration successfully.
          </div>
        </div>
      </v-timeline-item>
      <v-timeline-item icon="mdi-account-group">
        <template v-slot:opposite>
          <span :class="`headline  red--text`">{{
            new Date(conference.startdate).toLocaleDateString("en")
          }}</span>
          -
          <span :class="`headline  red--text`">{{
            new Date(conference.enddate).toLocaleDateString("en")
          }}</span>
        </template>
        <div class="py-4">
          <h2 :class="`headline font-weight-bold mb-4 red--text`">
            MUNOL {{ conference.year }}
          </h2>
          <div>
            The conference takes place in Lübeck. You will be welcomed by the
            organizing team during the Opening Ceremonies. Enjoy the week, meet
            new people, discuss global issues, make frieds, solve international
            problems and have an unforgettable week.
          </div>
        </div>
      </v-timeline-item>
    </v-timeline>
  </v-container>
</template>

<script>
export default {
  name: "RegistrationTimeline",
  components: {},
  data: () => ({
    conference: null,
  }),
  async mounted() {
    try {
      const [conference] = (
        await this.$http.get(
          "https://munoltom.pythonanywhere.com/api/conferences/",
        )
      ).data;
      this.conference = conference;
    } catch (error) {
      console.trace(`%c ${error}", "#FF0000`);
    }
  },
};
</script>

<style></style>
