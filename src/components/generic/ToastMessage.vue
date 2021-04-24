<template>
  <div>
    <v-snackbar v-model="snackbar" :color="color" :timeout="timeout">
      <v-icon color="white">{{ prepend_icon }}</v-icon>
      {{ message }}
      <v-spacer></v-spacer>
      <template v-slot:action="{ attrs }">
        <v-btn text v-bind="attrs" @click="snackbar = false">
          {{ ok_option }}
        </v-btn>
      </template>
    </v-snackbar>
  </div>
</template>

<script>
export default {
  name: "ToastMessage",
  props: {
    message: String,
    color: String,
    ok_option: {
      type: String,
      default: "OK",
    },
    timeout: {
      type: Number,
      default: 2000,
    },
    prepend_icon: String,
  },
  data: () => ({
    snackbar: null,
  }),

  methods: {
    show() {
      this.snackbar = true;
    },
  },
};
</script>
