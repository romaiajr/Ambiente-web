<template>
  <MainMenu @clicked="changeComponent" v-if="current == 0" />
  <DepartamentoTable v-else-if="current == 1" />
  <DisciplinaTable v-else-if="current == 2" />
  <SemestreTable v-else-if="current == 3" />
  <TurmaTable v-else-if="current == 4" />
  <LogTable v-else-if="current == 5" />
</template>
<script>
import MainMenu from "../../components/MainMenu";
import DepartamentoTable from "../../components/tables/DepartamentoTable";
import DisciplinaTable from "../../components/tables/DisciplinaTable";
import SemestreTable from "../../components/tables/SemestreTable";
import TurmaTable from "../../components/tables/TurmaTable";
import LogTable from "../../components/tables/LogTable";

export default {
  props: ["current"],
  components: {
    MainMenu,
    DepartamentoTable,
    DisciplinaTable,
    SemestreTable,
    TurmaTable,
    LogTable,
  },
  watch: {
    current() {
      this.data = this.current;
    },
  },
  methods: {
    changeComponent(value) {
      this.data = value;
      this.$emit("changeComponent", value);
    },
  },
};
</script>
