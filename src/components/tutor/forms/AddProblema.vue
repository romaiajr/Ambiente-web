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
            <v-menu
              ref="menu1"
              v-model="menu1"
              :close-on-content-click="false"
              transition="scale-transition"
              offset-y
              max-width="290px"
              min-width="auto"
            >
              <template v-slot:activator="{ on, attrs }">
                <v-text-field
                  v-model="dateFormatted"
                  label="data_entrega"
                  persistent-hint
                  prepend-icon="mdi-calendar"
                  v-bind="attrs"
                  @blur="form.data_entrega = parseDate(dateFormatted)"
                  v-on="on"
                ></v-text-field>
              </template>
              <v-date-picker
                v-model="form.data_entrega"
                no-title
                @input="menu1 = false"
              ></v-date-picker>
            </v-menu>
            <v-file-input
              show-size
              truncate-length="17"
              label="Anexo"
              id="file"
              ref="file"
              v-on:change="onChangeFileUpload()"
            ></v-file-input>
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
      form: { title: "", 
              description: "",
              data_entrega: (new Date(Date.now() - (new Date()).getTimezoneOffset() * 60000)).toISOString().substr(0, 10),
              anexo: null
              },
      dateFormatted: this.formatDate((new Date(Date.now() - (new Date()).getTimezoneOffset() * 60000)).toISOString().substr(0, 10)),
      menu1: false,
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

  watch: {
    dataToUpdate() {
      if (this.dataToUpdate != null) {
        this.getOne();
      }
    },
    form:{
      handler(){
        this.dateFormatted = this.formatDate(this.form.data_entrega)
      },
      deep: true
    },
  },
  
  computed: {
    snackText() {
      return this.updated == false
        ? "Problema Adicionado com Sucesso!"
        : "Problema Atualizado com Sucesso!";
    },
    computedDateFormatted () {
      return this.formatDate(this.date)
    },
  },

  methods: {
    onChangeFileUpload(){
      this.form.anexo = this.$refs.file.files[0];
    },
    formatDate (date) {
      if (!date) return null

      const [year, month, day] = date.split('-')
      return `${day}/${month}/${year}`
    },
    
    parseDate (date) {
      if (!date) return null
      const [day, month, year] = date.split('/')
      return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`
    },

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
          this.form = { title: "", description: "", data_entrega: null, anexo: null};
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
          this.form = { title: "", description: "", data_entrega: null, anexo: null};
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
};
</script>
