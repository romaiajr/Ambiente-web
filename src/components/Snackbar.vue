<template>
  <v-snackbar v-model="show" :color="type" right bottom>
    <h6 style="margin: 0px !important">
      {{ text }}
    </h6>
    <template v-slot:action="{ attrs }">
      <v-btn color="white" text v-bind="attrs" @click="hide">
        Fechar
      </v-btn>
    </template>
  </v-snackbar>
</template>

<script>
export default {
  props: ["type", "show", "text"],
  methods: {
    hide() {
      this.$emit("hide", false);
    },
  },
  watch: {
    show() {
      setTimeout(() => this.hide(), 4000);
    },
  },
};
</script>
