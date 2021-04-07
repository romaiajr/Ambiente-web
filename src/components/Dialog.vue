<template>
  <div class="text-center">
    <v-dialog max-width="500">
      <v-btn slot="activator" slot-scope="props" v-on="props.on">
        + Adicionar
      </v-btn>
      <template v-slot:default="dialog">
        <v-card>
          <v-toolbar color="primary" dark
            ><h2>{{ title }}</h2></v-toolbar
          >
          <v-card-text class="pt-6">
            <v-form>
              <v-text-field
                v-for="(field, idx) in fields"
                :key="idx"
                :label="field.field"
                v-model="form[field.value]"
              ></v-text-field>
            </v-form>
          </v-card-text>
          <v-card-actions class="justify-end">
            <v-btn
              text
              color="red darken-1"
              @click="
                () => {
                  dialog.value = false;
                  form = {};
                }
              "
              >Cancelar</v-btn
            >
            <v-btn
              text
              color="light-blue darken-4"
              @click.prevent="handleSubmit"
              >Adicionar</v-btn
            >
          </v-card-actions>
        </v-card>
      </template>
    </v-dialog>
  </div>
</template>
<script>
export default {
  props: ["fields", "title"],
  data() {
    return { form: {} };
  },
  methods: {
    handleSubmit(form) {
      form = this.form;
      this.$emit("handleSubmit", form);
    },
  },
};
</script>
