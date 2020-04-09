<template>
  <div>
    <v-container>
      <p>Advisors:</p>
      <ul>
        <li v-for="advisor in advisors" v-bind:key="advisor.id">
          {{ advisor.first_name + " " + advisor.last_name }}
        </li>
      </ul>
    </v-container>
  </div>
</template>

<script>
export default {
  name: "Advisors",

  data: () => ({
    advisors: null
  }),
  mounted() {
    var vm = this;
    vm.$http
      .get("https://munoltom.pythonanywhere.com/api/advisors/")
      .then(function(response) {
        vm.advisors = response.data;
      })
      .catch(function(error) {
        alert(error);
      });
  }
};
</script>
