<template>
  <v-container>
    <v-row id="teachers-table" class="mt-2">
      <v-col offset-md="2" md="8" sm="12">
        <v-card>
          <v-card-title>
            <h4>Turmas</h4>
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
                  :items="semestres"
                  label="Filtrar"
                  v-model="filterQuery"
                  append-icon="mdi-filter"
                  clearable
                ></v-select>
              </v-col>
              <v-col class="d-flex justify-end" cols="12" sm="4">
                <AddTurma @handleSubmit="handleSubmit" />
                <AddTutor :turma="turma" @cancelTutor="turma = null" />
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
            @handleTutor="handleTutor"
          />
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>
<script>
import Table from "./Table";
import headers from "../../utils/headers.json";
import turmaService from "../../services/turmaService";
import semestreService from "../../services/semestreService";
import AddTurma from "../forms/AddTurma";
import AddTutor from "../forms/AddTutor";
export default {
  components: {
    AddTurma,
    AddTutor,
    Table,
  },
  data() {
    return {
      data: undefined,
      semestres: [],
      searchQuery: "",
      filterQuery: null,
      headers: "",
      waiting: false,
      turma: undefined,
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
          return item.semestre_code == this.filterQuery;
        });
      }
      if (search != "") {
        return itens.filter((item) => {
          return (
            this.removeSpecial(item.code.toLowerCase()).includes(search) ||
            this.removeSpecial(item.disciplina_name.toLowerCase()).includes(
              search
            )
          );
        });
      } else {
        return itens;
      }
    },
    notFound() {
      if (this.data == undefined || this.data.length == 0) {
        return "Ainda não foram cadastradas turmas";
      } else {
        return "Nenhuma turma encontrada";
      }
    },
  },
  methods: {
    componentStructure() {
      this.headers = headers.turmas;
      turmaService.get().then((response) => {
        let items = response.data;
        this.data = [];
        items.map((item) => {
          item.code = `${item.disciplina_code}-${item.code}`;
          this.data.push(item);
        });
        this.data = this.data.sort((a, b) => {
          if (a.disciplina_ofertada_id == b.disciplina_ofertada_id) {
            return a.code.localeCompare(b.code);
          } else {
            return a.disciplina_code.localeCompare(b.disciplina_code);
          }
        });
      });
      semestreService.get().then((response) => {
        let items = response.data.sort((a, b) => {
          return b.code.localeCompare(a.code);
        });
        this.filterQuery = items[0].code;
        items.map((item) => {
          this.semestres.push({
            text: item.code,
            value: item.code,
          });
        });
      });
    },
    handleSubmit(data) {
      data.code = `${data.disciplina_code}-${data.code}`;
      this.data.push(data);
      this.data = this.data.sort((a, b) => {
        return a.code.localeCompare(b.code);
      });
    },
    async handleDelete(selectedItem) {
      try {
        this.waiting = true;
        await turmaService.destroy(selectedItem.id);
        this.data = this.data.filter((item) => {
          return item.id != selectedItem.id;
        });
        this.waiting = false;
      } catch (error) {
        console.log(error);
      }
    },
    handleTutor(item) {
      this.turma = item;
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
<style></style>
