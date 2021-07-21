<template>
  <v-container>
    <v-row id="meus-baremas" class="mt-2">
      <v-col offset-md="2" md="8" sm="12">
        <v-card>
          <v-progress-linear
            indeterminate
            v-if="baremas == undefined"
          ></v-progress-linear>
          <v-card-title>
            <v-row no-gutter align="center">
              <v-col class="d-flex" cols="12" sm="8">
                <h4>Meus Baremas</h4>
              </v-col>
              <v-col class="d-flex justify-end" cols="12" sm="4">
                <AddBarema
                  @handleSubmit="handleSubmit"
                  :dataToUpdate="dataToUpdate"
                  @handleUpdate="updateData"
                  @cancelUpdate="dataToUpdate = null"
                  :waiting="waiting"
                />
              </v-col>
            </v-row>
          </v-card-title>

          <v-card-subtitle class="mt-2">
            <v-expansion-panels accordion>
              <v-expansion-panel
                v-for="barema in baremas"
                :key="barema.barema.id"
              >
                <v-expansion-panel-header>
                  <h6>{{ barema.barema.name }}</h6>
                </v-expansion-panel-header>

                <v-expansion-panel-content>
                  <v-tooltip top v-for="item in barema.itens" :key="item.id">
                    <template v-slot:activator="{ on, attrs }">
                      <v-chip
                        v-bind="attrs"
                        v-on="on"
                        class="ma-2"
                        color="var(--primary-light-color)"
                        label
                        text-color="white"
                      >
                        <v-icon left>
                          mdi-checkbox-marked-outline
                        </v-icon>
                        {{ item.name }}
                      </v-chip>
                    </template>
                    <span>Peso: {{ item.amount }}</span>
                  </v-tooltip>
                  <v-row class="mt-1 mb-1 d-flex justify-end">
                    <v-btn
                      @click="handleUpdate(barema.barema)"
                      elevation="2"
                      small
                      color="warning"
                      tile
                    >
                      <v-icon left> mdi-pencil </v-icon>Editar</v-btn
                    >
                    <v-btn
                      @click="
                        () => {
                          selectedItem = barema.barema.id;
                          confirmDialog = true;
                        }
                      "
                      elevation="2"
                      small
                      color="error"
                      tile
                      class="ml-2"
                      ><v-icon left> mdi-delete </v-icon>Remover</v-btn
                    >
                  </v-row>
                </v-expansion-panel-content>
              </v-expansion-panel>
            </v-expansion-panels>
          </v-card-subtitle>
        </v-card>
      </v-col>
    </v-row>
    <v-dialog
      v-model="confirmDialog"
      max-width="500"
      :disabled="waiting"
      :persistent="waiting"
      @keydown.enter="handleDelete"
    >
      <v-card>
        <v-toolbar color="var(--primary-dark-color)" style="color: white"
          ><h6>Deseja remover o item selecionado?</h6></v-toolbar
        >
        <v-progress-linear
          v-if="waiting == true"
          indeterminate
        ></v-progress-linear>
        <v-card-actions class="justify-end">
          <v-btn
            text
            color="red darken-1"
            @click="confirmDialog = false"
            :disabled="waiting"
            >Cancelar</v-btn
          >
          <v-btn
            text
            color="light-blue darken-4"
            @click="handleDelete"
            :disabled="waiting"
            >Remover</v-btn
          >
        </v-card-actions>
      </v-card>
    </v-dialog>
    <Snackbar
      type="success"
      text="Barema removido com sucesso!"
      :show="removed"
      @hide="removed = false"
    />
  </v-container>
</template>
<script>
import baremaService from "../../services/baremaService";
import Snackbar from "../Snackbar.vue";
import AddBarema from "./forms/AddBarema.vue";
export default {
  components: {
    Snackbar,
    AddBarema,
  },

  data: () => ({
    baremas: undefined,
    selectedItem: undefined,
    confirmDialog: false,
    waiting: false,
    removed: false,
    dataToUpdate: undefined,
  }),

  created() {
    this.getBaremas();
  },

  methods: {
    async getBaremas() {
      try {
        this.baremas = await baremaService.get();
        this.baremas = this.baremas.data;
      } catch (error) {
        console.log(error);
      }
    },
    async handleSubmit(submit) {
      this.baremas.push({ barema: submit.barema, itens: submit.itens });
    },
    async handleDelete() {
      try {
        this.waiting = true;
        await baremaService.destroy(this.selectedItem);
        this.baremas = this.baremas.filter((item) => {
          return item.barema.id != this.selectedItem;
        });
        console.log(this.baremas);
        this.waiting = false;
        this.removed = true;
        this.confirmDialog = false;
      } catch (error) {
        console.log(error);
      }
    },
    async handleUpdate(item) {
      this.dataToUpdate = item.id;
    },
    updateData(updatedData) {
      this.waiting = true;
      var index = this.baremas.findIndex((item) => {
        return item.barema.id == updatedData.barema.id;
      });
      this.baremas[index] = updatedData;
      this.dataToUpdate = null;
      this.waiting = false;
    },
  },
};
</script>
