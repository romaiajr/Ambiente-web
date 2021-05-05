<template>
  <v-app>
    <v-main
      ><Navbar @clicked="changeComponent" :current="current" />
      <MainMenu @clicked="changeComponent" v-if="current == 0" />
      <DepartamentoTable v-else-if="current == 1" />
      <DisciplinaTable v-else-if="current == 2" />
      <SemestreTable v-else-if="current == 3" />
      <TurmaTable v-else-if="current == 4" />
      <LogTable v-else-if="current == 5" />
    </v-main>
  </v-app>
</template>
<script>
import Navbar from "../components/Navbar";
import DepartamentoTable from "../components/tables/DepartamentoTable";
import DisciplinaTable from "../components/tables/DisciplinaTable";
import SemestreTable from "../components/tables/SemestreTable";
import TurmaTable from "../components/tables/TurmaTable";
import MainMenu from "../components/MainMenu";
import LogTable from "../components/tables/LogTable";
export default {
  components: {
    Navbar,
    MainMenu,
    DepartamentoTable,
    DisciplinaTable,
    SemestreTable,
    TurmaTable,
    LogTable,
  },
  data: () => ({
    current: 0,
  }),
  methods: {
    changeComponent(value) {
      this.current = value;
    },
  },
};
</script>
