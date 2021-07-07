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
                @change="updateRange"
              ></v-calendar>
            </v-sheet>
          </v-card-subtitle>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>
<script>
export default {
  data: () => ({
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
  mounted() {
    this.$refs.calendar.checkChange();
  },
  methods: {
    getEventColor(event) {
      return event.color;
    },
    prev() {
      this.$refs.calendar.prev();
    },
    next() {
      this.$refs.calendar.next();
    },
    updateRange({ start, end }) {
      const events = [];
      const min = new Date(`${start.date}T13:30:00`);
      const max = new Date(`${end.date}T17:30:00`);
      const days = (max.getTime() - min.getTime()) / 86400000;
      const eventCount = this.rnd(days, days / 10);

      for (let i = 0; i < eventCount; i++) {
        const allDay = this.rnd(0, 3) === 0;
        const firstTimestamp = this.rnd(min.getTime(), max.getTime());
        const first = new Date(firstTimestamp - (firstTimestamp % 900000));
        events.push({
          name: this.names[this.rnd(0, this.names.length - 1)],
          start: first,

          color: this.colors[this.rnd(0, this.colors.length - 1)],
          timed: !allDay,
        });
      }
      this.events = events;
    },
    rnd(a, b) {
      return Math.floor((b - a + 1) * Math.random()) + a;
    },
  },
};
</script>
