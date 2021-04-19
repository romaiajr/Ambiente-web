<template>
  <div>
    <v-data-table
      :loading="loading"
      loading-text="Carregando... Por favor, aguarde"
      :headers="headers"
      :items="filteredList"
      :items-per-page="10"
      class="elevation-1 row-pointer"
      :no-data-text="notFound"
    >
      <template v-slot:item.action="{ item }">
        <v-btn
          @click="handleUpdate(item)"
          elevation="2"
          small
          color="warning"
          tile
          >Editar</v-btn
        >
        <v-btn
          @click="
            () => {
              confirmDialog = true;
              selectedItem = item;
            }
          "
          elevation="2"
          small
          color="error"
          tile
          class="ml-2"
          >Remover</v-btn
        >
      </template>
    </v-data-table>
    <v-dialog
      v-model="confirmDialog"
      max-width="500"
      :disabled="waiting"
      :persistent="waiting"
    >
      <v-card>
        <v-toolbar dark
          ><h3>Deseja realmente remover o item selecionado?</h3></v-toolbar
        >
        <v-progress-linear
          v-if="waiting == true"
          indeterminate
        ></v-progress-linear>
        <v-card-actions class="justify-end">
          <v-btn
            text
            color="light-blue darken-4"
            @click="handleDelete"
            :disabled="waiting"
            >Remover</v-btn
          >
          <v-btn
            text
            color="red darken-1"
            @click="confirmDialog = false"
            :disabled="waiting"
            >Cancelar</v-btn
          >
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>
<script>
export default {
  props: ["loading", "headers", "filteredList", "notFound", "waiting"],
  data() {
    return {
      confirmDialog: false,
      selectedItem: undefined,
    };
  },
  methods: {
    handleDelete() {
      this.$emit("handleDelete", this.selectedItem);
    },
    handleUpdate(item) {
      this.$emit("handleUpdate", item);
    },
  },
  watch: {
    waiting(newValue) {
      if (newValue == false) this.confirmDialog = false;
    },
  },
};
</script>
