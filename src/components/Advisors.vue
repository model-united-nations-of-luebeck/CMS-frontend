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
    advisors: null,
  }),
  async mounted() {
    try {
      const { data } = await this.$http.get(
        "https://munoltom.pythonanywhere.com/api/advisors/"
      );
      this.advisors = data;
    } catch (error) {
      alert(error);
    }
  },
};
</script>
