<template>
  <div>
    <v-dialog
      v-model="dialog"
      max-width="500"
      :disabled="waiting"
      :persistent="waiting"
      @click:outside="
        () => {
          form = {};
          this.$refs.addDepartamento.reset();
          if (this.update == true) this.cancelUpdate();
        }
      "
    >
      <v-btn
        slot="activator"
        slot-scope="props"
        v-on="props.on"
        color="var(--primary-color)"
        style="color: white"
      >
        <v-icon left> mdi-plus </v-icon> Adicionar
      </v-btn>
      <v-card>
        <v-toolbar color="var(--primary-dark-color)" style="color: white"
          ><v-progress-linear
            v-if="waiting == true"
            indeterminate
          ></v-progress-linear>
          <h5>
            {{
              update == true
                ? "Editar departamento"
                : "Adicionar novo departamento"
            }}
          </h5></v-toolbar
        >
        <v-card-text class="pt-6">
          <v-form v-model="validForm" ref="addDepartamento">
            <v-text-field
              v-model="form.abbreviation"
              @keyup="form.abbreviation = $event.target.value.toUpperCase()"
              @keyup.enter="handleSubmit"
              :rules="abbreviatonRules"
              label="Sigla do departamento"
              required
              :disabled="update"
            ></v-text-field>
            <v-text-field
              v-model="form.name"
              :rules="nameRules"
              label="Nome do departamento"
              required
              @keyup.enter="update == true ? handleUpdate() : handleSubmit()"
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
import Snackbar from "../Snackbar";
export default {
  components: {
    Snackbar,
  },
  props: ["dataToUpdate, waiting"],
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
      update: false,
      updated: false,
    };
  },
  methods: {
    async handleSubmit() {
      this.form.abbreviation.trim();
      this.form.name.trim();
      try {
        if (this.$refs.addDepartamento.validate()) {
          var departamento = await departamentoService.store(this.form);
          this.dialog = false;
          this.$emit("handleSubmit", departamento.data);
          this.stored = true;
          this.form = { abbreviation: "", name: "" };
          this.$refs.addDepartamento.reset();
        }
      } catch (error) {
        console.log(error);
      }
    },
    //new
    async handleUpdate() {
      try {
        if (this.$refs.addDepartamento.validate()) {
          var updatedData = await departamentoService.update(this.form);
          this.$emit("handleUpdate", updatedData.data);
          this.dialog = false;
          this.updated = true;
          this.update = false;
          this.form = { abbreviation: "", name: "" };
          this.$refs.addDepartamento.reset();
        }
      } catch (error) {
        console.log(error);
      }
    },
    //new
    getOne() {
      departamentoService.getOne(this.dataToUpdate).then((response) => {
        this.form = response.data;
      });
      this.dialog = true;
      this.update = true;
    },
    //new
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
        ? "Departamento Adicionado com Sucesso!"
        : "Departamento Atualizado com Sucesso!";
    },
  },
};
</script>
