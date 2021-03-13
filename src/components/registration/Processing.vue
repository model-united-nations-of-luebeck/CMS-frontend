<template>
  <v-container>
    <v-banner elevation="2">
      <h1>One More Step</h1>
      <v-row class="spaced">
        <v-col md="6">
          <v-row>
            <v-col md="2">
              <v-icon x-large color="yellow darken-2">mdi-currency-usd</v-icon>
            </v-col>
            <v-col md="10">
              <p>
                Thank you for providing the pre-registration information. The
                Conference Managers will contact you soon and ask you to pay a
                pre-registration fee.
              </p>
            </v-col>
          </v-row>
        </v-col>
        <v-col md="6">
          <v-row>
            <v-col md="2">
              <v-icon x-large color="primary">mdi-bank</v-icon>
            </v-col>
            <v-col md="10">
              <p>
                The bank details of the account are:<br />
                MUNOL Account Name Placeholder<br />
                MUNOL Account Bank Placeholder<br />
                MUNOL Account Number Placeholder<br />
              </p>
            </v-col>
          </v-row>
        </v-col>
      </v-row>
    </v-banner>
  </v-container>
</template>

<script>
export default {
  name: "Processing",
};
</script>

<style></style>
