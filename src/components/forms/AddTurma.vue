<template>
  <div>
    <v-dialog
      v-model="dialog"
      max-width="500"
      @click:outside="
        () => {
          form = {};
          this.$refs.addTurma.reset();
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
          ><h5>Adicionar Nova Turma</h5></v-toolbar
        >
        <v-card-text class="pt-6">
          <v-form v-model="validForm" ref="addTurma">
            <v-select
              v-model="form.disciplina_id"
              :rules="disciplinaRules"
              label="Disciplina"
              required
              @keyup.enter="handleSubmit"
              :items="disciplinas"
            ></v-select>
            <v-select
              v-model="form.semestre_id"
              :rules="semestreRules"
              label="Semestre"
              required
              @keyup.enter="handleSubmit"
              :items="semestres"
            ></v-select>
            <v-text-field
              type="number"
              v-model="form.number_of_classes"
              @keyup.enter="handleSubmit"
              :rules="numberRules"
              label="Número de turmas"
              required
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
                this.$refs.addTurma.reset();
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
    <Snackbar
      type="success"
      :text="snackText"
      :show="stored"
      @hide="stored = false"
    />
  </div>
</template>
<script>
import disciplinaOfertadaService from "../../services/disciplinaOfertadaService";
import disciplinaService from "../../services/disciplinaService";
import semestreService from "../../services/semestreService";
import turmaService from "../../services/turmaService";
import Snackbar from "../Snackbar";
export default {
  components: {
    Snackbar,
  },
  data() {
    return {
      form: { disciplina_id: "", semestre_id: "", number_of_classes: "" },
      dialog: false,
      validForm: undefined,
      disciplinaRules: [(v) => !!v || "Disciplina é um campo obrigatório"],
      semestreRules: [(v) => !!v || "Semestre é um campo obrigatório"],
      numberRules: [
        (v) => !!v || "Número de turmas é um campo obrigatório",
        (v) => v <= 10 || "Número máximo de 10 turmas",
      ],
      stored: false,
      disciplinas: [],
      semestres: [],
      snackText: null,
    };
  },
  created() {
    this.getDisciplina();
    this.getSemestres();
  },
  methods: {
    async handleSubmit() {
      try {
        if (this.$refs.addTurma.validate()) {
          var disciplina = await disciplinaOfertadaService.store(this.form);
          var i = 0;
          while (i < this.form.number_of_classes) {
            var turma = await turmaService.store({
              disciplina_id: disciplina.data.id,
              code: `P0${i + 1}`,
            });
            i++;
            turmaService.get(turma.data.id).then((response) => {
              this.$emit("handleSubmit", response.data);
            });
          }
          this.dialog = false;
          this.stored = true;
          this.successText(this.form.number_of_classes);
          this.form = {};
          this.$refs.addTurma.reset();
        }
      } catch (error) {
        console.log(error);
      }
    },
    getDisciplina() {
      disciplinaService.get().then((response) => {
        response.data.map((item) => {
          this.disciplinas.push({
            text: `${item.code} - ${item.name}`,
            value: item.id,
          });
        });
      });
    },
    getSemestres() {
      semestreService.get().then((response) => {
        response.data.map((item) => {
          this.semestres.push({
            text: item.code,
            value: item.id,
          });
        });
      });
    },
    successText(value) {
      value == 1
        ? (this.snackText = "Turma Criada com Sucesso!")
        : (this.snackText = "Turmas Criadas com Sucesso");
    },
  },
};
</script>
