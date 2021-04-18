<template>
  <v-container>
    <v-row id="teachers-table" class="mt-2">
      <v-col offset-md="2" md="8" sm="12">
        <v-card>
          <v-card-title>
            <h2>Semestres</h2>
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
                <AddSemestre @handleSubmit="handleSubmit" />
              </v-col>
            </v-row>
          </v-card-subtitle>
          <Table
            :loading="data == undefined"
            :headers="headers"
            :filteredList="filteredList"
            notFound="Nenhum semestre encontrado"
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
import semestreService from "../../services/semestreService";
import AddSemestre from "../forms/AddSemestre";
export default {
  props: ["value"],
  components: {
    AddSemestre,
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
          return this.removeSpecial(item.code.toLowerCase()).includes(search);
        });
      } else {
        return this.data;
      }
    },
  },
  methods: {
    componentStructure() {
      this.headers = headers.semestres;
      semestreService.get().then((response) => {
        let items = response.data.sort((a, b) => {
          return a.code.localeCompare(b.code);
        });
        items.map((item) => {
          item.start_date = this.formatDate(item.start_date);
          item.end_date = this.formatDate(item.end_date);
          this.data = [];
          this.data.push(item);
        });
      });
    },
    handleSubmit(data) {
      this.data = [];
      this.data.push(data);
    },
    formatDate(date) {
      var newDate = date.split("-");
      newDate = newDate[2] + "-" + newDate[1] + "-" + newDate[0];
      return newDate;
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
