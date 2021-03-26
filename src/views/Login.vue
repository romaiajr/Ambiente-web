<template>
  <v-container id="login">
    <v-row>
      <v-col md="6" offset-md="3"
        ><v-card id="login-card" elevation="2" class="mx-auto my-12">
          <v-card-title>
            <h2>ENTRAR NO AMBIENTE WEB</h2>
          </v-card-title>
          <v-form ref="form">
            <v-text-field label="Usuário" v-model="form.user"></v-text-field>
            <v-text-field label="Senha" v-model="form.password"></v-text-field>
            <a><small>Esqueci a senha</small></a>
            <v-btn block>
              Login
            </v-btn></v-form
          >
          <h5>Não tem uma conta? <a>Criar Conta</a></h5>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>
<script>
export default {
  data: () => ({
    form: { user: "", password: "" },
  }),
};
</script>
<style scoped>
#login-card {
  height: 100% !important;
  width: 100%;
}
#login-content {
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>
