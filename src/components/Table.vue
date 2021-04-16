<template>
  <v-container>
    <v-row id="teachers-table" class="mt-2">
      <v-col offset-md="2" md="8" sm="12">
        <v-card>
          <v-card-title>
            <h2>{{ title }}</h2>
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
                <AddDepartamento
                  v-if="value == 0 || value == 1"
                  @handleSubmit="handleSubmit"
                />
                <AddDisciplina
                  v-else-if="value == 2"
                  @handleSubmit="handleSubmit"
                />
                <AddSemestre
                  v-else-if="value == 3"
                  @handleSubmit="handleSubmit"
                />
                <AddTurma v-else-if="value == 4" @handleSubmit="handleSubmit" />
              </v-col>
            </v-row>
          </v-card-subtitle>
          <!-- @click:row="handleClick" -->
          <v-data-table
            :loading="data.length == 0"
            loading-text="Carregando... Por favor, aguarde"
            :headers="headers"
            :items="filteredList"
            :items-per-page="10"
            class="elevation-1 row-pointer"
          >
          </v-data-table>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>
<script>
import headers from "../utils/headers.json";
import departamentoService from "../services/departamentoService";
import disciplinaService from "../services/disciplinaService";
import semestreService from "../services/semestreService";
import turmaService from "../services/turmaService";
import AddDepartamento from "./forms/AddDepartamento";
import AddDisciplina from "./forms/AddDisciplina";
import AddSemestre from "./forms/AddSemestre";
import AddTurma from "./forms/AddTurma";
export default {
  props: ["value"],
  components: {
    AddDepartamento,
    AddDisciplina,
    AddSemestre,
    AddTurma,
  },
  data() {
    return {
      data: [],
      searchQuery: "",
      title: "",
      headers: "",
    };
  },
  created() {
    this.componentStructure();
  },
  computed: {
    filteredList() {
      let search = this.removeSpecial(this.searchQuery.toLowerCase().trim());
      if ((search != null || search != "") && this.value != 4) {
        return this.data.filter((item) => {
          if (this.value != 3)
            return this.removeSpecial(item.name.toLowerCase()).includes(search);
          else return this.removeSpecial(item.code).includes(search);
        });
      } else return this.data;
    },
  },
  methods: {
    componentStructure() {
      if (this.value == 1) {
        this.title = "Departamentos";
        this.headers = headers.departamento;
        departamentoService.get().then((response) => {
          this.data = response.data.sort((a, b) => {
            return a.abbreviation.localeCompare(b.abbreviation);
          });
        });
      } else if (this.value == 2) {
        this.title = "Disciplinas";
        this.headers = headers.disciplinas;
        disciplinaService.get().then((response) => {
          this.data = response.data.sort((a, b) => {
            return a.code.localeCompare(b.code);
          });
        });
      } else if (this.value == 3) {
        this.title = "Semestres";
        this.headers = headers.semestres;
        semestreService.get().then((response) => {
          let items = response.data.sort((a, b) => {
            return a.code.localeCompare(b.code);
          });
          items.map((item) => {
            item.start_date = this.formatDate(item.start_date);
            item.end_date = this.formatDate(item.end_date);
            this.data.push(item);
          });
        });
      } else {
        this.title = "Turmas";
        this.headers = headers.turmas;
        turmaService.get().then((response) => {
          let items = response.data.sort((a, b) => {
            return a.disciplina_name.localeCompare(b.disciplina_name);
          });
          items.map((item) => {
            item.code = `${item.disciplina_code}-${item.code}`;
            this.data.push(item);
          });
        });
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
    handleSubmit(data) {
      data.code = `${data.disciplina_code}-${data.code}`;
      this.data.push(data);
    },
    formatDate(date) {
      var newDate = date.split("-");
      newDate = newDate[2] + "-" + newDate[1] + "-" + newDate[0];
      return newDate;
    },
    sortData(array) {
      //building
      console.log(array);
    },
  },
};
</script>
