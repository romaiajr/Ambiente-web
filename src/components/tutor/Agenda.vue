<template>
  <v-container>
    <v-row id="minhas-turmas" class="mt-2">
      <v-col offset-md="2" md="8" sm="12">
        <v-card>
          <v-card-title>
            <h4>Minha Agenda</h4>
          </v-card-title>
          <v-card-subtitle>
            <v-sheet height="64">
              <v-toolbar flat class="d-flex justify-end">
                <v-btn fab text small color="grey darken-2" @click="prev">
                  <v-icon small>
                    mdi-chevron-left
                  </v-icon>
                </v-btn>
                <v-btn fab text small color="grey darken-2" @click="next">
                  <v-icon small>
                    mdi-chevron-right
                  </v-icon>
                </v-btn>
                <v-toolbar-title v-if="$refs.calendar">
                  <h5>{{ $refs.calendar.title }}</h5>
                </v-toolbar-title>
              </v-toolbar>
            </v-sheet>
            <v-sheet height="550">
              <v-calendar
                ref="calendar"
                v-model="focus"
                color="primary"
                :events="events"
                :event-color="getEventColor"
                :type="type"
                weekdays="1,2,3,4,5"
              ></v-calendar>
            </v-sheet>
          </v-card-subtitle>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>
<script>
import turmaService from "../../services/turmaService";
export default {
  data: () => ({
    turmas: [],
    focus: "",
    type: "month",
    events: [],
    colors: [
      "blue",
      "indigo",
      "deep-purple",
      "cyan",
      "green",
      "orange",
      "grey darken-1",
    ],
    names: ["EXA869", "EXA497", "EXA197"],
  }),
  created() {
    this.getTurmas();
    // this.getEvents();
  },
  mounted() {
    this.$refs.calendar.checkChange();
  },
  methods: {
    async getTurmas({ min, max }) {
      const events = [];
      const turmas = await turmaService.getTurmas();
      turmas.data.forEach((turma) => {
        this.turmas.push({
          name: turma.code,
          classes: turma.class_days.split(","),
          time: turma.class_time.split(","),
        });
      });
      this.turmas.forEach((turma) => {
        console.log(turma);
        turma.classes.forEach((day) => {
          const allDay = this.rnd(0, 3) === 0;
          const firstTimestamp = this.rnd(min.getTime(), max.getTime());
          const first = new Date(firstTimestamp - (firstTimestamp % 900000));
          const secondTimestamp = this.rnd(2, allDay ? 288 : 8) * 900000;
          const second = new Date(first.getTime() + secondTimestamp);
          console.log(day);
          events.push({
            name: turma.name,
            color: this.colors[this.rnd(0, this.colors.length - 1)],
            start: first,
            end: second,
            timed: !allDay,
          });
        });
        this.events = events;
      });
    },
    getEventColor(event) {
      return event.color;
    },
    prev() {
      this.$refs.calendar.prev();
    },
    next() {
      this.$refs.calendar.next();
    },
    getEvents() {
      const events = [];
      console.log(this.turmas);
      this.turmas.forEach((item) => {
        console.log(item);
        item.classes.forEach((i) => {
          console.log(i);
          events.push({
            name: item.code,
            color: this.colors[this.rnd(0, this.colors.length - 1)],
            start: { weekday: 1, time: item.time[0].split("-")[0] },
            end: { weekday: 1, time: item.time[0].split("-")[1] },
          });
        });
      });
      console.log(events);
      this.events = events;
    },
    rnd(a, b) {
      return Math.floor((b - a + 1) * Math.random()) + a;
    },
  },
};
</script>
