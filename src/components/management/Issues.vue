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
  async mounted() {
    try {
      const { data } = await this.$http.get(
        "https://munoltom.pythonanywhere.com/api/issues/"
      );
      this.issues = data;
    } catch (error) {
      alert(error);
    }
  },
};
</script>
