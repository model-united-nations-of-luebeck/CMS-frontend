<template>
  <v-container>
    <v-sparkline
      :value="[0, 2, 5, 9, 5, 10, 3, 5, 0, 0, 1, 8, 2, 9, 0]"
      :gradient="['#f72047', '#ffd200', '#1feaea']"
      smooth="10"
      padding="8"
      line-width="2"
      stroke-linecap="round"
      gradient-direction="top"
      :fill="false"
      auto-draw
    ></v-sparkline>

    <v-card elevation="5">
      <p class="font-weight-bold display-2 text-center primary--text">
        <i>{{ conference.theme }}</i>
      </p>
      <p class="font-weight-medium headline text-center">
        {{
          conference.annual_session | ordinal({ includeNumber: true })
        }}
        annual session of Model United Nations of Lübeck <br />MUNOL
        {{ conference.year }}
      </p>
    </v-card>

    <v-card> </v-card>
  </v-container>
</template>

<script>
export default {
  name: "Home",
  props: {
    msg: String
  },
  data: () => ({
    conference: null
  }),
  filters: {},
  methods: {},
  mounted() {
    var vm = this;
    vm.$http
      .get("https://munoltom.pythonanywhere.com/api/conferences/")
      .then(function(response) {
        vm.conference = response.data[0];
      })
      .catch(function(error) {
        alert(error);
      });
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped></style>
