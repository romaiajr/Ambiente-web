<template>
  <v-app>
    <v-main
      ><Navbar v-on:clicked="changeComponent" />
      <DepartamentoTable v-if="current == 1" />
      <DisciplinaTable v-else-if="current == 2" />
      <SemestreTable v-else-if="current == 3" />
      <TurmaTable v-else-if="current == 4" />
    </v-main>
  </v-app>
</template>
<script>
import Navbar from "../components/Navbar";
import DepartamentoTable from "../components/tables/DepartamentoTable";
import DisciplinaTable from "../components/tables/DisciplinaTable";
import SemestreTable from "../components/tables/SemestreTable";
import TurmaTable from "../components/tables/TurmaTable";
export default {
  components: {
    Navbar,
    DepartamentoTable,
    DisciplinaTable,
    SemestreTable,
    TurmaTable,
  },
  data: () => ({
    current: 1,
  }),
  methods: {
    changeComponent(value) {
      this.current = value;
    },
  },
};
</script>
