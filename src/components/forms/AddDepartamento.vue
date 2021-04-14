<template>
  <div>
    <v-dialog
      v-model="dialog"
      max-width="500"
      @click:outside="
        () => {
          form = {};
          this.$refs.addDepartamento.reset();
        }
      "
    >
      <v-btn slot="activator" slot-scope="props" v-on="props.on">
        + Adicionar
      </v-btn>
      <v-card>
        <v-toolbar color="primary" dark
          ><h2>Adicionar Novo Departamento</h2></v-toolbar
        >
        <v-card-text class="pt-6">
          <v-form v-model="validForm" ref="addDepartamento">
            <v-text-field
              v-model="form.abbreviation"
              @keyup="form.abbreviation = $event.target.value.toUpperCase()"
              @keyup.enter="handleSubmit"
              :rules="abbreviatonRules"
              label="Sigla do Departamento"
              required
            ></v-text-field>
            <v-text-field
              v-model="form.name"
              :rules="nameRules"
              label="Nome do Departamento"
              required
              @keyup.enter="handleSubmit"
            ></v-text-field>
          </v-form>
        </v-card-text>
        <v-card-actions class="justify-end">
          <v-btn
            text
            color="red darken-1"
            @click="
              () => {
                dialog = false;
                this.$refs.addDepartamento.reset();
              }
            "
            >Cancelar</v-btn
          >
          <v-btn text color="light-blue darken-4" @click.prevent="handleSubmit"
            >Adicionar</v-btn
          >
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-snackbar v-model="stored" timeout="4000" color="success">
      <template v-slot:action="{ attrs }">
        <h3 style="margin: 0px !important">
          Departamento Adicionado com Sucesso!
        </h3>
        <v-btn color="white" text v-bind="attrs" @click="stored = false">
          Fechar
        </v-btn>
      </template>
    </v-snackbar>
  </div>
</template>
<script>
import departamentoService from "../../services/departamentoService";
export default {
  data() {
    return {
      form: { abbreviation: "", name: "" },
      dialog: false,
      validForm: undefined,
      abbreviatonRules: [
        (v) => !!v || "Sigla do Departamento é um campo obrigatório",
        (v) =>
          /[D][A-Z]{3}/.test(v) ||
          "Sigla deve começar com 'D' e conter apenas letras",
      ],
      nameRules: [
        (v) => !!v || "Nome do Departamento é um campo obrigatório",
        (v) =>
          /([A-Z] || [a-z])+/.test(v) ||
          "Nome do departamento deve conter apenas letras",
      ],
      stored: false,
    };
  },
  methods: {
    async handleSubmit() {
      this.form.abbreviation.trim();
      this.form.name.trim();
      try {
        if (this.$refs.addDepartamento.validate()) {
          await departamentoService.store(this.form);
          this.dialog = false;
          this.$emit("handleSubmit", this.form);
          this.stored = true;
          this.form = {};
        }
      } catch (error) {
        console.log(error);
      }
    },
  },
};
</script>
