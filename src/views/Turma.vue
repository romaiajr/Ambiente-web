<template>
   <v-container>
    <v-row id="turma-title" class="mt-2">
      <v-col offset-md="12">
        <v-card >
          <v-card-title>
            <h4>{{turma.nome}}</h4>
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
                <v-card outlined v-for="problema in problemas" :key="problema.id" class="mt-4">
                    <v-card-title>
                        <p>{{problema.nome}}</p>
                        
                    </v-card-title>
                    <v-card-subtitle>
                        <p>{{problema.data}}</p>
                        <v-divider class="mt-1"/>
                        <v-chip class="mt-3" outlined color="red" label :href="problema.anexo" target="_blank">
                            <v-icon left>
                                mdi-pdf-box
                            </v-icon>
                            Anexo do problema
                        </v-chip>
                    </v-card-subtitle>
                    <v-card-actions>
                        <v-spacer></v-spacer>
                        <v-btn
                            icon
                            @click="problema.expand = !problema.expand"
                        >
                            <v-icon>{{ show ? 'mdi-chevron-up' : 'mdi-chevron-down' }}</v-icon>
                        </v-btn>
                    </v-card-actions>
                        <v-expand-transition>
                        <div v-show="problema.expand">
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
export default{
    data: () => ({
        turma: {
            nome: "EXA869 - Compiladores", id: 1
        },
        problemas: [
            {
                nome: "Problema 4: Analisador Semântico", data: "29/08/2021", anexo: "https://eppg.fgv.br/sites/default/files/teste.pdf", expand: false
            },
            {
                nome: "Problema 3: Analisador Semântico", data: "10/06/2021", anexo: "https://eppg.fgv.br/sites/default/files/teste.pdf", expand: false
            }
        ],
    })
}
</script>