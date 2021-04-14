<template>
  <div>
    <v-dialog
      v-model="dialog"
      max-width="500"
      @click:outside="
        () => {
          form = {};
          this.$refs.addDisciplina.reset();
        }
      "
    >
      <v-btn slot="activator" slot-scope="props" v-on="props.on">
        + Adicionar
      </v-btn>
      <v-card>
        <v-toolbar color="primary" dark
          ><h2>Adicionar Nova Disciplina</h2></v-toolbar
        >
        <v-card-text class="pt-6">
          <v-form v-model="validForm" ref="addDisciplina">
            <v-text-field
              v-model="form.code"
              @keyup="form.code = $event.target.value.toUpperCase()"
              @keyup.enter="handleSubmit"
              :rules="codeRules"
              label="Código da Disciplina"
              required
            ></v-text-field>
            <v-text-field
              v-model="form.name"
              :rules="nameRules"
              label="Nome da Disciplina"
              required
              @keyup.enter="handleSubmit"
            ></v-text-field>
            <v-select
              v-model="form.workload"
              :rules="workloadRules"
              label="Carga Horária da Disciplina"
              required
              @keyup.enter="handleSubmit"
              :items="workload"
            ></v-select>
            <v-select
              v-model="form.departamento_id"
              :rules="departamentoRules"
              label="Departamento"
              required
              @keyup.enter="handleSubmit"
              :items="departamentos"
            ></v-select>
          </v-form>
        </v-card-text>
        <v-card-actions class="justify-end">
          <v-btn
            text
            color="red darken-1"
            @click="
              () => {
                dialog = false;
                this.$refs.addDisciplina.reset();
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
          Disciplina Adicionada com Sucesso!
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
import disciplinaService from "../../services/disciplinaService";
export default {
  data() {
    return {
      form: { code: "", name: "", workload: "", departamento_id: "" },
      workload: [30, 60],
      departamentos: [],
      dialog: false,
      validForm: undefined,
      codeRules: [
        (v) => !!v || "Código da Disciplina é um campo obrigatório",
        (v) =>
          /\b[A-Z]{3}[0-9]{3}\b/g.test(v) ||
          "Código da Disciplina deve conter 3 letras e 3 números",
      ],
      nameRules: [
        (v) => !!v || "Nome da Disciplina é um campo obrigatório",
        (v) =>
          /([A-Z] || [a-z])+/.test(v) ||
          "Nome da Disciplina deve conter apenas letras",
      ],
      workloadRules: [
        (v) => !!v || "Carga Horária é um campo obrigatório",
        (v) =>
          /([30] || [60])/.test(v) || "A carga horária deve ser 30 ou 60 horas",
      ],
      departamentoRules: [
        (v) => !!v || "Departamento é um campo obrigatório",
        (v) => /([0-9]+)/.test(v),
      ],
      stored: false,
    };
  },
  created() {
    this.getDepartamentos();
  },
  methods: {
    async handleSubmit() {
      this.form.code.trim();
      this.form.name.trim();
      console.log(this.form);
      try {
        if (this.$refs.addDisciplina.validate()) {
          await disciplinaService.store(this.form);
          this.dialog = false;
          this.$emit("handleSubmit", this.form);
          this.stored = true;
          this.form = {};
        }
      } catch (error) {
        console.log(error);
      }
    },
    getDepartamentos() {
      departamentoService.get().then((response) => {
        response.data.map((item) => {
          this.departamentos.push({
            text: item.abbreviation,
            value: item.id,
          });
        });
      });
      //   this.departamentos.sort((a, b) => {
      //     return a.abbreviation.localeCompare(b.abbreviation);
      //   });
    },
  },
};
</script>
