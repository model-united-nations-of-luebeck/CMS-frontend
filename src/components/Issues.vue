<template>
  <div>
    <v-container>
      <p>Issues:</p>
      <ul>
        <li v-for="issue in issues" v-bind:key="issue.id">
          {{ issue.name }}
        </li>
      </ul>
    </v-container>
  </div>
</template>

<script>
export default {
  name: "Issues",

  data: () => ({
    issues: null,
  }),
  mounted(){
    var vm = this;
    vm.$http
            .get("https://munoltom.pythonanywhere.com/api/issues/")
            .then(function(response) {
              vm.issues = response.data;
            })
            .catch(function(error) {
              alert(error);
            });

  }
};
</script>
