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
                <AddDisciplina @handleSubmit="handleSubmit" />
              </v-col>
            </v-row>
          </v-card-subtitle>
          <Table
            :loading="data == undefined"
            :headers="headers"
            :filteredList="filteredList"
            notFound="Nenhuma Disciplina Encontrada"
            @teste="teste"
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
  props: ["value"],
  components: {
    AddDisciplina,
    Table,
  },
  data() {
    return {
      data: undefined,
      searchQuery: "",
      headers: "",
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
    removeSpecial(texto) {
      texto = texto.replace(/[ÀÁÂÃÄÅ]/, "A");
      texto = texto.replace(/[àáâãäå]/, "a");
      texto = texto.replace(/[ÈÉÊË]/, "E");
      texto = texto.replace(/[Ç]/, "C");
      texto = texto.replace(/[ç]/, "c");
      return texto;
    },
    teste() {
      alert("oi");
    },
  },
};
</script>
