<template>
   <v-container>
    <v-row id="turma-title" class="mt-2">
      <v-col offset-md="12">
        <v-card >
          <v-card-title>
            <h4>{{turma.disciplina_code}} - {{turma.disciplina_name}} </h4>
          </v-card-title>
        </v-card>
      </v-col>
    </v-row>
    <v-row id="turma-title" class="mt-2">
      <v-col offset-md="12">
        <v-card >
            <v-card-title>
                <h5>Problemas</h5>
                <v-spacer></v-spacer>
                <v-btn color="primary">Novo Problema</v-btn>
            </v-card-title>

            <v-card-subtitle >
                <v-card outlined v-for="problema in problemas" :key="problema.problema_id" class="mt-4">
                    <v-card-title>
                        <p>{{problema.title}}</p>
                    </v-card-title>
                    <v-card-subtitle>
                        <p>{{problema.created_at}}</p>
                        <v-divider class="mt-1"/>
                        <v-chip class="mt-3" outlined color="red" label :href="problema.anexo" target="_blank">
                            <v-icon left>
                                mdi-pdf-box
                            </v-icon>
                            Anexo do problema
                        </v-chip>
                    </v-card-subtitle>
                    <!-- <v-card-actions>
                        <v-spacer></v-spacer>
                        <v-btn
                            icon
                            @click="problema.expand = !problema.expand"
                        >
                            <v-icon>{{ show ? 'mdi-chevron-up' : 'mdi-chevron-down' }}</v-icon>
                        </v-btn>
                    </v-card-actions> -->
                        <v-expand-transition>
                        <!-- <div v-show="problema.expand"> -->
                        <div>
                            <v-card-text class="d-flex flex-row-reverse">
                                <v-btn small color="primary">Atribuir Nota</v-btn>
                                <v-btn small class="mr-2" color="warning">Editar Problema</v-btn>
                            </v-card-text>
                        </div>
                        </v-expand-transition>
                </v-card>
            </v-card-subtitle>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>
<script>
import turmaService from "../services/turmaService";
export default{
    data: () => ({
        turma:[],
        problemas: []
    }),
      created(){
        turmaService.getProblemas(this.$route.params.id).then((response) => {
            this.problemas = response.data.problemas;
            this.turma = response.data.turma;
        });
  },
}
</script>