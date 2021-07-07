<template>
  <v-container>
    <v-row id="departamento-table" class="mt-2">
      <v-col offset-md="2" md="8" sm="12">
        <v-card>
          <v-card-title>
            <h4>Departamentos</h4>
          </v-card-title>
          <v-card-subtitle>
            <v-spacer></v-spacer>
            <v-row no-gutter align="center">
              <v-col class="d-flex" cols="12" sm="8">
                <v-text-field
                  align="center"
                  v-model="searchQuery"
                  append-icon="mdi-magnify"
                  label="Pesquisar..."
                  hide-details
                  dense
                ></v-text-field>
              </v-col>

              <v-col class="d-flex justify-end" cols="12" sm="4">
                <!-- New -->
                <AddDepartamento
                  @handleSubmit="handleSubmit"
                  :dataToUpdate="dataToUpdate"
                  @handleUpdate="updateData"
                  @cancelUpdate="dataToUpdate = null"
                  :waiting="waiting"
                />
              </v-col>
            </v-row>
          </v-card-subtitle>
          <!-- New -->
          <Table
            :loading="data == undefined"
            :headers="headers"
            :filteredList="filteredList"
            :notFound="notFound"
            @handleDelete="handleDelete"
            :waiting="waiting"
            @handleUpdate="handleUpdate"
          />
        </v-card>
      </v-col>
    </v-row>
    <Snackbar
      type="success"
      text="Departamento removido com sucesso!"
      :show="removed"
      @hide="removed = false"
    />
  </v-container>
</template>
<script>
import Table from "./Table";
import headers from "../../utils/headers.json";
import departamentoService from "../../services/departamentoService";
import AddDepartamento from "../forms/AddDepartamento";
import Snackbar from "../Snackbar";
import departamentoController from "../../controllers/adm/departamentoController";
export default {
  components: {
    AddDepartamento,
    Table,
    Snackbar,
  },
  data() {
    return {
      data: undefined,
      searchQuery: "",
      headers: [],
      waiting: false,
      dataToUpdate: null,
      removed: false,
    };
  },
  created() {
    this.componentStructure();
  },
  computed: {
    filteredList() {
      if (this.searchQuery != "") {
        return departamentoController.filter(this.data, this.searchQuery);
      } else {
        return this.data;
      }
    },

    notFound() {
      if (this.data == undefined || this.data.length == 0) {
        return "Ainda não foram cadastrados departamentos";
      } else {
        return "Nenhum departamento encontrado";
      }
    },
  },
  methods: {
    async componentStructure() {
      this.headers = headers.departamento;
      try {
        departamentoService.get().then((response) => {
          this.data = response.data.sort((a, b) => {
            return a.abbreviation.localeCompare(b.abbreviation);
          });
        });
      } catch (error) {
        console.log(error);
      }
    },
    handleSubmit(data) {
      this.waiting = true;
      this.data.push(data);
      this.data = this.data.sort((a, b) => {
        return a.abbreviation.localeCompare(b.abbreviation);
      });
      this.waiting = false;
    },
    handleUpdate(item) {
      this.dataToUpdate = item.id;
    },
    updateData(updatedData) {
      this.waiting = true;
      var index = this.data.findIndex((item) => {
        return item.id == updatedData.id;
      });
      this.data[index].name = updatedData.name;
      this.dataToUpdate = null;
      this.waiting = false;
    },
    async handleDelete(selectedItem) {
      try {
        this.waiting = true;
        await departamentoService.destroy(selectedItem.id);
        this.data = this.data.filter((item) => {
          return item.id != selectedItem.id;
        });
        this.waiting = false;
        this.removed = true;
      } catch (error) {
        console.log(error);
      }
    },
    removeSpecial(texto) {
      texto = texto.replace(/[ÀÁÂÃÄÅ]/, "A");
      texto = texto.replace(/[àáâãäå]/, "a");
      texto = texto.replace(/[ÈÉÊË]/, "E");
      texto = texto.replace(/[Ç]/, "C");
      texto = texto.replace(/[ç]/, "c");
      return texto;
    },
  },
};
</script>
