<template>
  <v-container>
    <v-row id="teachers-table" class="mt-2">
      <v-col offset-md="2" md="8" sm="12">
        <v-card>
          <v-card-title>
            <h2>Disciplinas</h2>
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
                <AddDisciplina
                  @handleSubmit="handleSubmit"
                  :dataToUpdate="dataToUpdate"
                  @handleUpdate="updateData"
                  @cancelUpdate="dataToUpdate = null"
                />
              </v-col>
            </v-row>
          </v-card-subtitle>
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
  </v-container>
</template>
<script>
import Table from "./Table";
import headers from "../../utils/headers.json";
import disciplinaService from "../../services/disciplinaService";
import AddDisciplina from "../forms/AddDisciplina";
export default {
  components: {
    AddDisciplina,
    Table,
  },
  data() {
    return {
      data: undefined,
      searchQuery: "",
      headers: "",
      waiting: false,
      dataToUpdate: null,
    };
  },
  created() {
    this.componentStructure();
  },
  computed: {
    filteredList() {
      let search = this.removeSpecial(this.searchQuery.toLowerCase().trim());
      if (search != "") {
        return this.data.filter((item) => {
          return (
            this.removeSpecial(item.code.toLowerCase()).includes(search) ||
            this.removeSpecial(item.name.toLowerCase()).includes(search)
          );
        });
      } else {
        return this.data;
      }
    },
    notFound() {
      if (this.data == undefined || this.data.length == 0) {
        return "Ainda não foram cadastradas disciplinas";
      } else {
        return "Nenhuma disciplina encontrada";
      }
    },
  },
  methods: {
    componentStructure() {
      this.headers = headers.disciplinas;
      disciplinaService.get().then((response) => {
        this.data = response.data.sort((a, b) => {
          return a.code.localeCompare(b.code);
        });
      });
    },
    handleSubmit(data) {
      this.data.push(data);
    },
    handleUpdate(item) {
      this.dataToUpdate = item.id;
    },
    updateData(updatedData) {
      var index = this.data.findIndex((item) => {
        return item.id == updatedData.id;
      });
      this.data[index].name = updatedData.name;
      this.data[index].workload = updatedData.workload;
    },
    async handleDelete(selectedItem) {
      try {
        this.waiting = true;
        await disciplinaService.destroy(selectedItem.id);
        this.data = this.data.filter((item) => {
          return item.id != selectedItem.id;
        });
        this.waiting = false;
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
