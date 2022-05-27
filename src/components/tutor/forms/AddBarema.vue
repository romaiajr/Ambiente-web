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
            {{ update == true ? "Editar barema" : "Adicionar novo barema" }}
          </h5></v-toolbar
        >

        <v-card-text class="pt-6">
          <v-form v-model="validForm" ref="addBarema">
            <v-text-field
              v-model="form.name"
              @keyup.enter="handleSubmit"
              :rules="nameRules"
              label="Nome do Barema"
              required
              :error="errorMessages.name != null"
              :error-messages="errorMessages.name"
            ></v-text-field>
            Critérios do Barema
            <v-card outlined>
              <v-form v-model="validForm" ref="itemBarema">
                <v-row class="ml-1">
                  <v-col md="6" style="padding-bottom: 0px !important;">
                    <v-text-field
                      v-model="item.name"
                      label="Nome"
                      :error="!errorItem"
                      :error-messages="errorItem.name"
                    >
                    </v-text-field>
                  </v-col>
                  <v-col md="4" style="padding-bottom: 0px !important;">
                    <v-text-field
                      v-model="item.amount"
                      :max="maxValue"
                      label="Peso"
                      type="number"
                      :error="errorItem.amount != null"
                      :error-messages="errorItem.amount"
                      :hint="
                        errorItem.amount == null
                          ? `Peso disponível: ${maxValue}`
                          : ''
                      "
                      persistent-hint
                    >
                    </v-text-field>
                  </v-col>
                  <v-col
                    offset-md="1"
                    md="1"
                    class="d-flex justify-end align-center "
                    style="padding-bottom: 0px"
                  >
                    <v-btn icon color="primary" @click="addItem">
                      <v-icon>mdi-plus</v-icon>
                    </v-btn>
                  </v-col>
                </v-row>
              </v-form>
              <v-container>
                <v-chip
                  v-for="item in form.itens"
                  :key="item.name"
                  class="ma-2"
                  color="var(--primary-light-color)"
                  label
                  text-color="white"
                >
                  <v-icon left class="mr-1">
                    mdi-checkbox-marked-outline
                  </v-icon>
                  {{ item.name }}
                  <v-icon right small class="mr-1">
                    {{ item.amount }}
                  </v-icon>
                  <v-icon right small class="mr-1" @click="removeItem(item.id)">
                    mdi-close-circle-outline
                  </v-icon>
                </v-chip>
              </v-container>
            </v-card>
          </v-form>
          <v-alert dense outlined type="error" v-show="noItens" class="mt-2"
            >Não é possível adicionar um barema sem critérios.
          </v-alert>
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
import baremaService from "../../../services/baremaService";
import Snackbar from "../../Snackbar";
export default {
  components: {
    Snackbar,
  },
  props: ["dataToUpdate", "waiting"],
  data() {
    return {
      form: { name: "", itens: [] },
      item: { name: "", amount: "" },
      dialog: false,
      validForm: undefined,
      nameRules: [(v) => !!v || "Nome do Barema é um campo obrigatório"],
      itensRules: [
        (v) => v.length >= 1 || "O Barema deve conter ao menos 1 critério",
      ],
      stored: false,
      update: false,
      updated: false,
      errorMessages: { name: null },
      errorItem: { name: null, amount: null },
      noItens: false,
    };
  },
  methods: {
    async handleSubmit() {
      this.form.name.trim();
      try {
        if (this.form.itens.length == 0) {
          this.noItens = true;
        } else {
          if (this.$refs.addBarema.validate()) {
            this.noItens = false;
            var barema = await baremaService.store(this.form);
            this.dialog = false;
            this.$emit("handleSubmit", barema.data);
            this.stored = true;
            this.form = { name: "", itens: [] };
            this.item = { name: "", amount: "" };
            this.$refs.addBarema.reset();
            this.errorMessages.name = null;
          }
        }
      } catch (error) {
        error.response.data.message.forEach((item) => {
          this.handleError(item);
        });
      }
    },
    async handleUpdate() {
      try {
        if (this.form.itens.length == 0) {
          this.noItens = true;
        } else {
          if (this.$refs.addBarema.validate()) {
            this.noItens = false;
            var updatedData = await baremaService.update(
              this.form,
              this.dataToUpdate
            );
            this.$emit("handleUpdate", updatedData.data);
            this.dialog = false;
            this.updated = true;
            this.update = false;
            this.form = { name: "", itens: [] };
            this.item = { name: "", amount: "" };
            this.$refs.addBarema.reset();
          }
        }
      } catch (error) {
        error.response.data.message.forEach((item) => {
          this.handleError(item);
        });
      }
    },
    getOne() {
      baremaService.getOne(this.dataToUpdate).then((response) => {
        this.form.name = response.data.barema.name;
        this.form.itens = response.data.itens;
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
      this.errorItem = { name: null, amount: null };
      this.$refs.addBarema.reset();
      this.form = { name: "", itens: [] };
      this.item = { name: "", amount: "" };
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
    addItem() {
      if (this.item.name != "" && this.item.amount != "") {
        if (this.item.amount > 100) {
          this.errorItem.amount = "O peso máximo é 100";
        } else if (this.item.amount == 0) {
          this.errorItem.amount = "O peso não pode ser 0";
        } else {
          let total = 0;
          this.form.itens.forEach((item) => {
            console.log(item);
            total += parseInt(item.amount);
          });
          console.log(total);
          if (total >= 100) {
            this.errorItem.amount =
              "O total de pesos dos critérios desse ser no máximo 100";
          } else {
            this.form.itens.push({
              name:
                this.item.name.charAt(0).toUpperCase() +
                this.item.name.slice(1),
              amount: this.item.amount,
            });
            this.item.name = "";
            this.item.amount = "";
          }
        }
      } else if (this.item.name == "" && this.item.amount != "") {
        this.errorItem.name = "Nome do Critério é um campo obrigatório";
      } else if (this.item.name != "" && this.item.amount == "") {
        this.errorItem.amount = "Peso do Critério é um campo obrigatório";
      } else {
        this.errorItem.name = "Nome do Critério é um campo obrigatório";
        this.errorItem.amount = "Peso do Critério é um campo obrigatório";
      }
    },
    removeItem(id) {
      console.log(id);
      this.form.itens = this.form.itens.filter((criterio) => {
        return criterio.id != id;
      });
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
        ? "Barema Adicionado com Sucesso!"
        : "Barema Atualizado com Sucesso!";
    },
    maxValue() {
      let total = 0;
      this.form.itens.forEach((item) => {
        total += parseInt(item.amount);
      });
      return 100 - total;
    },
  },
};
</script>
