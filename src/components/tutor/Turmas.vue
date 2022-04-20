<template>
  <v-container>
    <v-row id="minhas-turmas" class="mt-2">
      <v-col offset-md="2" md="8" sm="12">
        <v-card outlined>
          <v-card-title>
            <h4>Turmas</h4>
          </v-card-title>
          <v-card-subtitle>
            <v-row class="mt-2" v-for="item in turmas" :key="item.semestre.codigo">
              <v-col sm="12">
                <h6>{{ item.semestre.codigo }}</h6>
                <v-divider/>
              </v-col>
              <v-col
                md="6"
                sm="6"
                v-for="turma in item.semestre.turmas"
                :key="turma.turma_id"
                @click="openTurma(turma.turma_id)"
              >
                <v-card max-width="344" class="mt-2 card-turma" outlined>
                  <v-card-title style="background-color: #696969">
                    <p style="color: #ffffff">{{turma.disciplina_code}} - {{turma.disciplina_name}}</p>
                  </v-card-title>
                  <v-list-item three-line>
                    <v-list-item-content>
                      <v-list-item-title class="text-h6 mb-1">
                        {{turma.turma_code}} {{turma.class_days}}: {{turma.class_time}}
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
import turmaService from "../../services/turmaService";
export default {
  data: () => ({
    turmas: []
  }),

  created(){
    turmaService.getTurmas().then((response) => {
      this.groupBy(response.data, semestre => semestre.semestre_code).forEach((turmas, index) => {
          this.turmas.push({ semestre: {
            codigo: index,
            turmas: turmas
          }});
        });
    });
  },

  methods: {
    openTurma(turma_id){
      this.$router.push({path: `turma/${turma_id}`})
    },

    groupBy(list, keyGetter) {
      const map = new Map();
      list.forEach((item) => {
        const key = keyGetter(item);
        const collection = map.get(key);
        if (!collection) {
          map.set(key, [item]);
        } else {
          collection.push(item);
        }
      });
      return map;
    }
  },
};
</script>
<style>
.card-turma:hover {
  cursor: pointer;
}
</style>
