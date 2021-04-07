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
                <Dialog
                  :fields="fields"
                  title="Adicionar Novo Departamento"
                  @handleSubmit="handleSubmit"
                />
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
import modal from "../utils/modal.json";
import Dialog from "./Dialog";
import departamentoService from "../services/departamentoService";
import disciplinaService from "../services/disciplinaService";
import semestreService from "../services/semestreService";
export default {
  props: ["value"],
  components: {
    Dialog,
  },
  data() {
    return {
      data: [],
      searchQuery: "",
      title: "",
      headers: "",
      fields: "",
    };
  },
  created() {
    this.tableStructure();
  },
  computed: {
    filteredList() {
      let search = this.removeSpecial(this.searchQuery.toLowerCase().trim());
      if (search != null || search != "") {
        return this.data.filter((item) => {
          if (this.value != 3)
            return this.removeSpecial(item.name.toLowerCase()).includes(search);
          else return this.removeSpecial(item.code).includes(search);
        });
      } else return this.data;
    },
  },
  methods: {
    tableStructure() {
      if (this.value == 1) {
        this.title = "Departamentos";
        this.headers = headers.departamento;
        this.fields = modal.adm;
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
            return a.abbreviation.localeCompare(b.abbreviation);
          });
        });
      } else if (this.value == 3) {
        this.title = "Semestres";
        this.headers = headers.semestres;
        semestreService.get().then((response) => {
          this.data = response.data.sort((a, b) => {
            return a.abbreviation.localeCompare(b.abbreviation);
          });
        });
      } else {
        this.title = "Turmas";
        this.headers = headers.turmas;
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
    async handleSubmit(form) {
      console.log(form);
    },
    // async onSubmit() {
    //   this.form.name.trim();
    //   this.form.autor.trim();
    //   this.form.link.trim();
    //   try {
    //     await artigoService.addArtigo(this.form);
    //     this.$vs.notification({
    //       color: "success",
    //       title: "Adicionar Artigo",
    //       text: "Artigo adicionado com sucesso!",
    //     });
    //     this.getArtigos();
    //     this.$refs["modal-artigos"].hide();
    //   } catch (e) {
    //     this.$vs.notification({
    //       color: "danger",
    //       title: "Adicionar Artigo",
    //       text: "Houve um erro ao tentar adicionar o novo artigo",
    //     });
    //   }
    // },
  },
};
</script>
