<template>
  <div>
    <Turmas v-if="current == 0" />
    <Agenda v-if="current == 1" />
    <div v-if="current == 2">BAREMA</div>
    <div v-if="current == 3">REPOSITORIO</div>
  </div>
</template>
<script>
import Turmas from "../../components/tutor/Turmas.vue";
import Agenda from "../../components/tutor/Agenda.vue";
export default {
  props: ["current"],
  components: {
    Turmas,
    Agenda,
  },
};
</script>
