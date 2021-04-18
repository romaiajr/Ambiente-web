<template>
  <v-data-table
    @click:row="teste"
    :loading="loading"
    loading-text="Carregando... Por favor, aguarde"
    :headers="headers"
    :items="filteredList"
    :items-per-page="10"
    class="elevation-1 row-pointer"
    :no-data-text="notFound"
  >
  </v-data-table>
</template>
<script>
export default {
  props: ["loading", "headers", "filteredList", "notFound"],
  methods: {
    teste() {
      this.$emit("teste", "oi");
    },
  },
};
</script>
