<template>
  <v-container>
    <v-row id="log-table" class="mt-2">
      <v-col offset-md="2" md="8" sm="12">
        <v-card>
          <v-card-title>
            <h4>Logs do Sistema</h4>
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
            </v-row>
          </v-card-subtitle>
          <!-- New -->
          <Table
            :loading="data == undefined"
            :headers="headers"
            :filteredList="filteredList"
            :notFound="notFound"
          />
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>
<script>
import Table from "./Table";
import logService from "../../services/logService";
export default {
  components: {
    Table,
  },
  data() {
    return {
      data: undefined,
      searchQuery: "",
      headers: [
        { text: "Log do Sistema", value: "log" },
        { text: "Data", value: "created_at" },
      ],
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
            this.removeSpecial(item.log.toLowerCase()).includes(search) ||
            item.created_at.includes(search)
          );
        });
      } else {
        return this.data;
      }
    },
    notFound() {
      return "Ainda não ocorreram mudanças no sistema";
    },
  },
  methods: {
    componentStructure() {
      try {
        logService.get().then((response) => {
          this.data = response.data.reverse();
        });
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
