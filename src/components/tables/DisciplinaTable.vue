<template>
  <v-container>
    <v-row id="teachers-table" class="mt-2">
      <v-col offset-md="2" md="8" sm="12">
        <v-card>
          <v-card-title>
            <h4>Disciplinas</h4>
          </v-card-title>
          <v-card-subtitle>
            <v-spacer></v-spacer>
            <v-row no-gutter align="center">
              <v-col class="d-flex" cols="12" sm="5">
                <v-text-field
                  align="center"
                  v-model="searchQuery"
                  append-icon="mdi-magnify"
                  label="Pesquisar..."
                  hide-details
                  dense
                ></v-text-field>
              </v-col>
              <v-col cols="12" sm="3">
                <v-select
                  dense
                  style="margin-top: 22px !important; "
                  :items="departamentos"
                  label="Filtrar"
                  v-model="filterQuery"
                  append-icon="mdi-filter"
                  clearable
                ></v-select>
              </v-col>
              <v-col class="d-flex justify-end" cols="12" sm="4">
                <AddDisciplina
                  @handleSubmit="handleSubmit"
                  :dataToUpdate="dataToUpdate"
                  @handleUpdate="updateData"
                  @cancelUpdate="dataToUpdate = null"
                  :waiting="waiting"
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
    <Snackbar
      type="success"
      text="Disciplina removida com sucesso!"
      :show="removed"
      @hide="removed = false"
    />
  </v-container>
</template>
<script>
import Table from "./Table";
import headers from "../../utils/headers.json";
import disciplinaService from "../../services/disciplinaService";
import AddDisciplina from "../forms/AddDisciplina";
import departamentoService from "../../services/departamentoService";
import Snackbar from "../Snackbar";
export default {
  components: {
    AddDisciplina,
    Table,
    Snackbar,
  },
  data() {
    return {
      data: undefined,
      searchQuery: "",
      filterQuery: null,
      headers: "",
      waiting: false,
      dataToUpdate: null,
      departamentos: [],
      removed: false,
    };
  },
  created() {
    this.componentStructure();
  },
  computed: {
    filteredList() {
      let search = this.removeSpecial(this.searchQuery.toLowerCase().trim());
      var itens = [];
      if (this.filterQuery == null) {
        itens = this.data;
      } else {
        itens = this.data.filter((item) => {
          console.log(item.data);
          return item.departamento_id == this.filterQuery;
        });
      }
      if (search != "") {
        return itens.filter((item) => {
          return (
            this.removeSpecial(item.code.toLowerCase()).includes(search) ||
            this.removeSpecial(item.name.toLowerCase()).includes(search)
          );
        });
      } else {
        return itens;
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
      departamentoService.get().then((response) => {
        response.data.map((item) => {
          this.departamentos.push({
            text: item.abbreviation,
            value: item.id,
          });
        });
      });
    },
    handleSubmit(data) {
      this.waiting = true;
      this.data.push(data);
      this.data = this.data.sort((a, b) => {
        return a.code.localeCompare(b.code);
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
      this.data[index].workload = updatedData.workload;
      this.dataToUpdate = null;
      this.waiting = false;
    },
    async handleDelete(selectedItem) {
      try {
        this.waiting = true;
        await disciplinaService.destroy(selectedItem.id);
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
