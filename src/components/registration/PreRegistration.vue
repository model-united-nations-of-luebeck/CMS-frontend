<template>
  <v-container>
    <span>Dear MUN-Director of {{ school }},</span>
    <span
      >we are very delighted that you are interested in taking part in the
      24<sup>th</sup> MUNOL session in 2021. In order to register, you and your
      school's delegation, please fill out thise form by
      {{ deadline.toLocaleDateString() }}. The registration procedure is
      explained in detail <router-link>here</router-link>. Please don't hesitate
      contacting Conference Management if you have any questions:
      <a>conferencemanager@munol.org.</a>
    </span>
  </v-container>
</template>

<script>
export default {
  name: "PreRegistration",
  data() {
    return {
      school: "Template School",
      deadline: new Date(),
    };
  },
};
</script>

<style></style>
