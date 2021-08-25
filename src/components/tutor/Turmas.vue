<template>
  <v-container>
    <v-row id="minhas-turmas" class="mt-2">
      <v-col offset-md="2" md="8" sm="12">
        <v-card outlined>
          <v-card-title>
          
            <h4>Turmas</h4>
          </v-card-title>
          <v-card-subtitle>
            <v-row class="mt-2" v-for="item in turmas" :key="item.codigo">
              <v-col sm="12">
                <h6>{{ item.semestre.codigo }}</h6>
                <v-divider/>
              </v-col>
              <v-col
                md="6"
                sm="6"
                v-for="i in item.semestre.turmas"
                :key="i.nome"
                @click="openTurma(i)"
              >
                <v-card max-width="344" class="mt-2 card-turma" outlined>
                  <v-card-title style="background-color: #696969">
                    <p style="color: #ffffff">{{ i.nome }}</p>
                  </v-card-title>
                  <v-list-item three-line>
                    <v-list-item-content>
                      <v-list-item-title class="text-h6 mb-1">
                      </v-list-item-title>
                    </v-list-item-content>
                  </v-list-item>
                </v-card>
              </v-col>
            </v-row>
          </v-card-subtitle>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>
<script>
export default {
  data: () => ({
    turmas: [
      {
        semestre: {
          codigo: "2020.1",
          turmas: [
            { nome: "EXA869 - Compiladores", id: 1 },
            { nome: "EXA437 - Algoritmos II",  id: 2 },
            { nome: "EXA197 - Circuitos Digitais",  id: 3},
          ],
        },
      },
       {
        semestre: {
          codigo: "2019.2",
          turmas: [
            { nome: "EXA869 - Compiladores" },
            { nome: "EXA437 - Algoritmos II" },
            { nome: "EXA197 - Circuitos Digitais" },
          ],
        },
      },
    ],
  }),
  methods: {
    openTurma(turma){
      this.$router.push({path: `turma/${turma.id}`})
    }
  },
};
</script>
<style>
.card-turma:hover {
  cursor: pointer;
}
</style>
