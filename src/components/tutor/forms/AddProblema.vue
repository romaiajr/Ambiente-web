<template>
  <div>
    <v-dialog
      v-model="dialog"
      max-width="500"
      :disabled="waiting"
      :persistent="waiting"
      @click:outside="cancelForm"
    >
      <v-btn
        slot="activator"
        slot-scope="props"
        v-on="props.on"
        color="primary"
      >
        Novo Problema
      </v-btn>
      <v-card>
        <v-toolbar color="var(--primary-dark-color)" style="color: white"
          ><v-progress-linear
            v-if="waiting == true"
            indeterminate
          ></v-progress-linear>
          <h5>
            {{ update == true ? "Editar problema" : "Adicionar novo problema" }}
          </h5></v-toolbar
        >

        <v-card-text class="pt-6">
          <v-form v-model="validForm" ref="AddProblema">
            <v-text-field
              v-model="form.title"
              @keyup.enter="handleSubmit"
              :rules="title"
              label="Nome do problema"
              required
              :error="errorMessages.name != null"
              :error-messages="errorMessages.name"
            ></v-text-field>
            <v-textarea
              v-model="form.description"
              @keyup.enter="handleSubmit"
              :rules="descriptionRules"
              label="Descrição do problema"
              required
              :error="errorMessages.name != null"
              :error-messages="errorMessages.name"
            ></v-textarea>
          </v-form>
        </v-card-text>
        <v-card-actions class="justify-end">
          <v-btn text color="red darken-1" @click="cancelForm()"
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
import problemaService from "../../../services/problemaService";
import Snackbar from "../../Snackbar";
export default {
  components: {
    Snackbar,
  },
  props: ["dataToUpdate", "waiting", "disciplina_ofertada_id"],
  data() {
    return {
      form: { title: "", description: "" },
      dialog: false,
      validForm: undefined,
      title: [(v) => !!v || "Nome do problema é um campo obrigatório"],
      descriptionRules: [(v) => !!v || "descrição do problema é um campo obrigatório"],
      stored: false,
      update: false,
      updated: false,
      errorMessages: { name: null },
    };
  },
  methods: {
    async handleSubmit() {
      this.form.title.trim();
      this.form.description.trim();
      this.form.disciplina_ofertada_id = this.disciplina_ofertada_id;
      try {
        if (this.$refs.AddProblema.validate()) {
          var problema = await problemaService.store(this.form);
          this.dialog = false;
          this.$emit("handleSubmit", problema.data);
          this.stored = true;
          this.form = { title: "", description: "" };
          this.$refs.AddProblema.reset();
          this.errorMessages.name = null;
        }
      } catch (error) {
        error.response.data.message.forEach((item) => {
          this.handleError(item);
        });
      }
    },
    async handleUpdate() {
      try {
        if (this.$refs.AddProblema.validate()) {
          var updatedData = await problemaService.update(
            this.form,
            this.dataToUpdate
          );
          this.$emit("handleUpdate", updatedData.data);
          this.dialog = false;
          this.updated = true;
          this.update = false;
          this.form = { title: "", description: "" };
          this.$refs.AddProblema.reset();
        }
      } catch (error) {
        error.response.data.message.forEach((item) => {
          this.handleError(item);
        });
      }
    },
    getOne() {
      problemaService.getOne(this.dataToUpdate).then((response) => {
        this.form.title = response.data.problema.title;
        this.form.description = response.problema.description;
      });
      this.dialog = true;
      this.update = true;
    },
    cancelUpdate() {
      this.update = false;
      this.$emit("cancelUpdate");
    },
    cancelForm() {
      this.dialog = false;
      this.$refs.AddProblema.reset();
      this.form = { title: "", description: ""  };
      if (this.update == true) this.cancelUpdate();
      this.errorMessages.name = null;
    },
    handleError(error) {
      switch (error.field) {
        case "name": {
          this.errorMessages.name = error.message;
          break;
        }
      }
    },
  },
  watch: {
    dataToUpdate() {
      if (this.dataToUpdate != null) {
        this.getOne();
      }
    },
  },
  computed: {
    snackText() {
      return this.updated == false
        ? "Problema Adicionado com Sucesso!"
        : "Problema Atualizado com Sucesso!";
    },
  },
};
</script>
