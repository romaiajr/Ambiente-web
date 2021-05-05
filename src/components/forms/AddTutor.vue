<template>
  <div>
    <v-dialog
      v-model="dialog"
      max-width="500"
      :disabled="waiting"
      :persistent="waiting"
      @click:outside="
        () => {
          this.cancelTutor();
        }
      "
    >
      <v-card>
        <v-toolbar color="var(--primary-dark-color)" style="color: white"
          ><v-progress-linear
            v-if="waiting == true"
            indeterminate
          ></v-progress-linear>
          <h5>Gerenciar Tutores</h5></v-toolbar
        >
        <v-card-text class="pt-6">
          <v-form ref="addTutor">
            <div v-if="alocados.length >= 1">
              <p>Tutores previamente designados para a disciplina</p>
              <v-chip
                v-for="item in alocados"
                :key="item.value"
                class="ma-2"
                color="blue"
                text-color="white"
                label
              >
                <v-avatar left>
                  <v-icon>mdi-account-circle</v-icon>
                </v-avatar>
                {{ item.text }}
              </v-chip>
            </div>

            <v-combobox
              v-model="selectedTutores"
              :items="selectableTutores"
              label="Tutores disponíveis"
              multiple
              chips
              no-data-text="Nenhum tutor disponível"
              clearable
              :disabled="selectableTutores.length == 0"
              :persistent-hint="true"
              :hint="
                selectableTutores.length == 0
                  ? 'Nenhum tutor disponível para a disciplina'
                  : ''
              "
            ></v-combobox>
          </v-form>
        </v-card-text>
        <v-card-actions class="justify-end">
          <v-btn
            text
            color="red darken-1"
            @click="
              () => {
                dialog = false;
                this.cancelTutor();
              }
            "
            >Cancelar</v-btn
          >
          <v-btn
            text
            color="light-blue darken-4"
            @click.prevent="handleSubmit"
            :disabled="this.selectedTutores.length == 0"
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
import turmaService from "../../services/turmaService";
import Snackbar from "../Snackbar";
export default {
  components: {
    Snackbar,
  },
  props: ["turma"],
  data() {
    return {
      selectedTutores: [],
      alocados: [],
      dialog: false,
      stored: false,
      tutores: [],
      turma_tutor: [],
      snackText: undefined,
      waiting: false,
    };
  },
  watch: {
    turma() {
      if (this.turma != null) {
        this.getTutores();
      }
    },
  },
  methods: {
    async handleSubmit() {
      try {
        this.waiting = true;
        for (const item of this.selectedTutores) {
          var turma_tutor = { user_id: item.value, turma_id: this.turma.id };
          await turmaService.addTutor(turma_tutor);
        }
        this.dialog = false;
        this.successText(this.selectedTutores.length);
        this.stored = true;
        this.cancelTutor();
        this.waiting = false;
      } catch (error) {
        console.log(error);
      }
    },
    getTutores() {
      this.selectedTutores = [];
      turmaService.getUserByType().then((response) => {
        response.data.map((item) => {
          this.tutores.push({
            value: item.id,
            text: `${item.first_name} ${item.surname}`,
          });
        });
      });
      turmaService.getTutores(this.turma.id).then((response) => {
        this.turma_tutor = response.data;
        this.turma_tutor.map((item) => {
          this.alocados.push({
            value: item.user_id,
            text: `${item.first_name} ${item.surname}`,
          });
        });
      });
      this.dialog = true;
    },
    cancelTutor() {
      this.$emit("cancelTutor");
      this.tutores = [];
      this.turma_tutor = [];
      this.selectedTutores = [];
      this.alocados = [];
    },
    successText(value) {
      value == 1
        ? (this.snackText = "Tutor designado com sucesso!")
        : (this.snackText = "Tutores designados com sucesso!");
    },
  },
  computed: {
    selectableTutores() {
      var tutores = this.tutores;
      this.alocados.map((selected) => {
        tutores = tutores.filter((item) => {
          return item.value != selected.value;
        });
      });
      return tutores;
    },
  },
};
</script>
