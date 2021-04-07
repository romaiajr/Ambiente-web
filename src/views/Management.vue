<template>
  <v-app>
    <v-main
      ><Navbar v-on:clicked="changeTableStruct"/>
      <Table :value="current" :key="current"
    /></v-main>
  </v-app>
</template>
<script>
import Navbar from "../components/Navbar";
import Table from "../components/Table";
export default {
  components: { Navbar, Table },
  data: () => ({
    current: 1,
  }),
  methods: {
    changeTableStruct(value) {
      this.current = value;
    },
  },
};
</script>
