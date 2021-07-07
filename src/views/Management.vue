<template>
  <v-app>
    <v-main
      ><Navbar @clicked="changeComponent" :current="current" />
      <AdmMain
        v-if="user_type == 'administrador'"
        @changeComponent="changeComponent"
        :current="current"
      />
      <TutorMain v-if="user_type == 'tutor'" :current="current" />
    </v-main>
  </v-app>
</template>
<script>
import Navbar from "../components/Navbar";
import AdmMain from "../views/main/AdmMain.vue";
import TutorMain from "../views/main/TutorMain.vue";
export default {
  components: {
    Navbar,
    AdmMain,
    TutorMain,
  },
  data: () => ({
    current: 0,
    user_type: "",
  }),
  methods: {
    changeComponent(value) {
      this.current = value;
    },
  },
  beforeMount() {
    this.user_type = sessionStorage.getItem("user_type");
  },
};
</script>
