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
          ><v-progress-linear
            v-if="waiting == true"
            indeterminate
          ></v-progress-linear>
          <h5>Adicionar Nova Turma</h5></v-toolbar
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
            <p class="mt-1 mb-1">
              Dias de Aula
              <small v-show="classes.days.length > 0">{{
                this.classes.days
              }}</small>
            </p>
            <v-card outlined style="color: #ff5252 !important">
              <v-row class="m-0" no-gutter>
                <v-col
                  md="4"
                  v-for="day in days"
                  :key="day.value"
                  class="pt-0 pb-0"
                >
                  <v-checkbox
                    dense
                    v-model="classes.days"
                    :label="day.text"
                    :value="day.value"
                    :disabled="form.disciplina_id == null"
                  ></v-checkbox>
                </v-col>
              </v-row>
            </v-card>
            <div v-show="correctWorkload">
              <small style="color: #ff5252 !important"
                >O número de dias não condiz com a carga horária da
                disciplina</small
              >
            </div>
            <p class="mt-4 mb-1">
              Horário das Aulas
              <small v-show="classes.time.length > 0">{{
                this.classes.time
              }}</small>
            </p>
            <v-card outlined>
              <v-row class="m-0" no-gutter>
                <v-col
                  md="4"
                  v-for="t in times"
                  :key="t.value"
                  class="pt-0 pb-0"
                >
                  <v-checkbox
                    dense
                    v-model="classes.time"
                    :label="t.text"
                    :value="t.value"
                    :disabled="form.disciplina_id == null"
                  ></v-checkbox>
                </v-col>
              </v-row>
            </v-card>
            <div v-show="correctTime">
              <small style="color: #ff5252 !important"
                >A quantidade de horários não condiz com a carga horária da
                disciplina</small
              >
            </div>
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
  props: ["waiting"],
  data() {
    return {
      form: {
        disciplina_id: null,
        semestre_id: null,
        number_of_classes: null,
      },
      classes: {
        days: [],
        time: [],
      },
      days: [
        { text: "Segunda", value: "seg" },
        { text: "Terça", value: "ter" },
        { text: "Quarta", value: "qua" },
        { text: "Quinta", value: "qui" },
        { text: "Sexta", value: "sex" },
      ],
      times: [
        { text: "7:30 - 9:30", value: "7:30 - 9:30" },
        { text: "9:30 - 11:30", value: "9:30 - 11:30" },
        { text: "13:30 - 15:30", value: "13:30 - 15:30" },
        { text: "15:30 - 17:30", value: "15:30 - 17:30" },
      ],
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
  computed: {
    correctWorkload() {
      if (this.form.disciplina_id != null && this.classes.days.length > 0) {
        var selected = this.disciplinas.filter((item) => {
          return this.form.disciplina_id == item.value;
        });
        return selected[0].carga / 30 != this.classes.days.length;
      } else return false;
    },
    correctTime() {
      if (this.form.disciplina_id != null) {
        var selected = this.disciplinas.filter((item) => {
          return this.form.disciplina_id == item.value;
        });

        return selected[0].carga / 30 < this.classes.time.length;
      } else return false;
    },
  },
  methods: {
    async handleSubmit() {
      try {
        if (!this.correctWorkload && !this.correctTime) {
          if (this.$refs.addTurma.validate()) {
            var disciplina = await disciplinaOfertadaService.store(this.form);
            var i = 0;
            while (i < this.form.number_of_classes) {
              var turma = await turmaService.store({
                disciplina_id: disciplina.data.id,
                code: `P0${i + 1}`,
                class_days: this.classes.days.toString(),
                class_time: this.classes.time.toString(),
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
            carga: item.workload,
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
