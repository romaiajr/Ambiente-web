<template>
  <div>
    <v-dialog
      v-model="dialog"
      max-width="500"
      @click:outside="
        () => {
          form = {};
          this.$refs.addDisciplina.reset();
          if (update == true) this.cancelUpdate();
        }
      "
    >
      <v-btn slot="activator" slot-scope="props" v-on="props.on">
        + Adicionar
      </v-btn>
      <v-card>
        <v-toolbar dark
          ><h2>
            {{
              update == true ? "Editar disciplina" : "Adicionar nova disciplina"
            }}
          </h2></v-toolbar
        >
        <v-card-text class="pt-6">
          <v-form v-model="validForm" ref="addDisciplina">
            <v-text-field
              v-model="form.code"
              @keyup="form.code = $event.target.value.toUpperCase()"
              @keyup.enter="handleSubmit"
              :rules="codeRules"
              label="Código da disciplina"
              required
              :disabled="update"
            ></v-text-field>
            <v-text-field
              v-model="form.name"
              :rules="nameRules"
              label="Nome da disciplina"
              required
              @keyup.enter="update == true ? handleUpdate() : handleSubmit()"
            ></v-text-field>
            <v-select
              v-model="form.workload"
              :rules="workloadRules"
              label="Carga horária da disciplina"
              required
              @keyup.enter="update == true ? handleUpdate() : handleSubmit()"
              :items="workload"
            ></v-select>
            <v-select
              v-model="form.departamento_id"
              :rules="departamentoRules"
              label="Departamento"
              required
              @keyup.enter="update == true ? handleUpdate() : handleSubmit()"
              :items="departamentos"
              :disabled="update"
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
                if (update == true) this.cancelUpdate();
              }
            "
            >Cancelar</v-btn
          >
          <v-btn
            text
            color="light-blue darken-4"
            @click.prevent="update == true ? handleUpdate() : handleSubmit()"
            >{{ update == true ? "Confirmar edição" : "Adicionar" }}</v-btn
          >
        </v-card-actions>
      </v-card>
    </v-dialog>
    <Snackbar
      type="success"
      :text="snackText"
      :show="stored"
      @hide="stored = false"
    />
    <Snackbar
      type="success"
      :text="snackText"
      :show="updated"
      @hide="updated = false"
    />
  </div>
</template>
<script>
import departamentoService from "../../services/departamentoService";
import disciplinaService from "../../services/disciplinaService";
import Snackbar from "../Snackbar";
export default {
  components: {
    Snackbar,
  },
  props: ["dataToUpdate"],
  data() {
    return {
      form: { code: "", name: "", workload: "", departamento_id: "" },
      workload: [30, 45, 60, 90],
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
      update: false,
      updated: false,
    };
  },
  created() {
    this.getDepartamentos();
  },
  methods: {
    async handleSubmit() {
      this.form.code.trim();
      this.form.name.trim();
      try {
        if (this.$refs.addDisciplina.validate()) {
          var disciplina = await disciplinaService.store(this.form);
          this.dialog = false;
          this.$emit("handleSubmit", disciplina.data);
          this.stored = true;
          this.form = {};
          this.$refs.addDisciplina.reset();
        }
      } catch (error) {
        console.log(error);
      }
    },
    //new
    async handleUpdate() {
      try {
        if (this.$refs.addDisciplina.validate()) {
          var updatedData = await disciplinaService.update(this.form);
          this.$emit("handleUpdate", updatedData.data);
          this.dialog = false;
          this.updated = true;
          this.update = false;
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
    },
    getOne() {
      disciplinaService.getOne(this.dataToUpdate).then((response) => {
        this.form = response.data;
      });
      this.dialog = true;
      this.update = true;
    },
    cancelUpdate() {
      this.update = false;
      this.$emit("cancelUpdate");
    },
  },
  watch: {
    dataToUpdate() {
      if (this.dataToUpdate != null) this.getOne();
    },
  },
  computed: {
    snackText() {
      return this.updated == false
        ? "Disciplina Adicionada com Sucesso!"
        : "Disciplina Atualizada com Sucesso!";
    },
  },
};
</script>
