<template>
  <v-app>
    <v-main>
      <v-container class="fill-height" fluid>
        <v-row align="center" justify="center">
          <v-col cols="12" md="8" sm="8">
            <v-card class="elevation-12">
              <v-window v-model="step">
                <v-window-item :value="1">
                  <v-row>
                    <v-col cols="12" md="8">
                      <v-card-text
                        class="mt-12"
                        v-on:keyup.enter="handleSubmit"
                      >
                        <h2 class="text-center display-2 ">
                          LOGIN
                        </h2>
                        <h3 class="text-center ">
                          Ambiente Web de Gerenciamento PBL
                        </h3>
                        <v-alert
                          v-show="loginError && validLogin"
                          text
                          dense
                          type="error"
                          class="mt-3 mb-3 "
                          transition="fade-transition"
                        >
                          Usuário e Senha não correspondem às informações em
                          nossos registros. Tente novamente.
                        </v-alert>
                        <v-form
                          v-model="validLogin"
                          lazy-validation
                          ref="signin"
                        >
                          <v-text-field
                            id="user"
                            v-model="formLogin.username"
                            label="Nome de usuário ou email"
                            prepend-icon="mdi-account"
                            type="text"
                            :rules="usernameRules"
                          />
                          <v-text-field
                            id="password"
                            v-model="formLogin.password"
                            label="Senha"
                            prepend-icon="mdi-lock"
                            type="password"
                            :rules="passwordRules"
                          />
                        </v-form>
                        <a
                          ><h4 class="text-center mt-4">
                            Esqueceu a senha?
                          </h4></a
                        >
                        <div class="text-center mt-3">
                          <v-btn block dark @click.prevent="handleSubmit"
                            >ENTRAR</v-btn
                          >
                        </div>
                      </v-card-text>
                    </v-col>
                    <v-col cols="12" md="4" class="black">
                      <v-card-text class="white--text mt-12">
                        <h1 class="text-center display-1">Olá, Amigo(a)!</h1>
                        <h4 class="text-center">
                          Ainda não faz parte da nossa plataforma? Faça o
                          cadastro e participe desta jornada com a gente!
                        </h4>
                        <div class="text-center mt-3">
                          <v-btn
                            block
                            outlined
                            dark
                            @click="
                              () => {
                                step++;
                                loginError = false;
                                formLogin = '';
                                this.$refs.signin.reset();
                              }
                            "
                            >CRIAR NOVA CONTA</v-btn
                          >
                        </div>
                      </v-card-text>
                    </v-col>
                  </v-row>
                </v-window-item>
                <v-window-item :value="2">
                  <v-row class="fill-height">
                    <v-col cols="12" md="4" class="black">
                      <v-card-text class="white--text mt-12">
                        <h1 class="text-center display-1">
                          Bem-vindo de volta!
                        </h1>
                        <h4 class="text-center">
                          Para se manter conectado com a gente, por favor insira
                          suas informações pessoais
                        </h4>
                        <div class="text-center">
                          <v-btn
                            block
                            outlined
                            dark
                            @click="
                              () => {
                                step--;
                                formRegistration = '';
                                this.$refs.signup.reset();
                              }
                            "
                            class="mt-3"
                            >REALIZAR LOGIN</v-btn
                          >
                        </div>
                      </v-card-text>
                    </v-col>
                    <v-col cols="12" md="8">
                      <v-card-text
                        class="mt-12"
                        v-on:keyup.enter="handleSubmit"
                      >
                        <h1 class="text-center display-2">
                          CRIAR CONTA
                        </h1>
                        <!-- <div class="text-center mt-4"></div> -->
                        <v-form
                          ref="signup"
                          v-model="validRegistration"
                          lazy-validation
                        >
                          <v-text-field
                            v-model="formRegistration.fullName"
                            :rules="nameRules"
                            label="Nome completo"
                            prepend-icon="mdi-account"
                            type="text"
                          />
                          <v-text-field
                            v-model="formRegistration.email"
                            :rules="emailRules"
                            label="Email"
                            prepend-icon="mdi-email"
                            type="email"
                          />
                          <v-text-field
                            v-model="formRegistration.enrollment"
                            :rules="enrollmentRules"
                            label="Número de matrícula"
                            prepend-icon="mdi-school"
                            type="number"
                          />
                          <v-text-field
                            :rules="passwordRules"
                            v-model="formRegistration.password"
                            label="Senha"
                            prepend-icon="mdi-lock"
                            type="password"
                          />
                        </v-form>
                        <div class="text-center mt-3">
                          <v-btn block dark @click.prevent="handleSubmit"
                            >CADASTRAR</v-btn
                          >
                        </div>
                      </v-card-text>
                    </v-col>
                  </v-row>
                </v-window-item>
              </v-window>
            </v-card>
          </v-col>
        </v-row>
      </v-container>
    </v-main>
  </v-app>
</template>
<script>
import authService from "../services/authService";
import router from "../router";
export default {
  data: () => ({
    formLogin: { username: "", password: "" },
    validLogin: undefined,
    formRegistration: { email: "", password: "", enrollment: "", fullName: "" },
    validRegistration: "",
    step: 1,
    nameRules: [],
    emailRules: [],
    enrollmentRules: [],
    passwordRules: [],
    usernameRules: [],
    loginError: false,
  }),
  methods: {
    async handleSubmit() {
      try {
        // Login Form
        if (this.step == 1) {
          this.usernameRules = [(v) => !!v || "Insira um nome de usuário"];
          this.passwordRules = [(v) => !!v || "Insira uma senha"];
          if (this.$refs.signin.validate()) {
            await authService.login(this.formLogin);
            router.push("user");
          }
        }
        // Registration Form
        else if (this.step == 2) {
          // Rules for form validation after submit to prevent error while writing
          this.nameRules = [(v) => !!v || "Nome é requerido"];
          this.emailRules = [
            (v) => !!v || "Email é requerido",
            (v) => /.+@.+\..+/.test(v) || "Email deve ser válido",
          ];
          this.enrollmentRules = [
            (v) => !!v || "Matrícula é requerida",
            (v) => (v && v.length == 8) || "Matrícula Inválida",
          ];
          this.passwordRules = [(v) => !!v || "Senha é requerida"];

          // Form Validation
          this.$refs.signup.validate();

          //Error, estado do valid tá true desde o início
          if (this.validRegistration == true) {
            console.log(this.formRegistration);
          }
        }
      } catch (error) {
        if (this.step == 1) {
          console.log(error);
          if (this.validLogin) this.loginError = true;
        } else if (this.step == 2) {
          console.log(error);
        }
      }
    },
  },
};
</script>
<style scoped></style>
