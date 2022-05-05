<template>
  <div>
    <Turmas v-if="current == 0" />
    <Agenda v-if="current == 1" />
    <Barema v-if="current == 2" />
    <div v-if="current == 3">REPOSITORIO</div>
    <Turma v-if="current == 4" />
  </div>
</template>
<script>
import Turmas from "../../components/tutor/Turmas.vue";
import Agenda from "../../components/tutor/Agenda.vue";
import Barema from "../../components/tutor/Barema.vue";
import Turma from "../../components/tutor/Turma.vue";
export default {
  props: ["current"],
  components: {
    Turmas,
    Agenda,
    Barema,
    Turma,
  },
};
</script>
