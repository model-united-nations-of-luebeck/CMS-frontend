<template>
  <div>
    <v-container>
      <v-toolbar flat>
        <!-- {{ this.events }} -->
        <!-- {{ this.locations }} -->
        <v-btn
          outlined
          class="mr-4"
          color="grey darken-2"
          @click="setMUNOLWeek"
        >
          MUNOL Week
        </v-btn>
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
          {{ $refs.calendar.title }}
        </v-toolbar-title>
        <v-spacer></v-spacer>
        <v-menu bottom right>
          <template v-slot:activator="{ on, attrs }">
            <v-btn outlined color="grey darken-2" v-bind="attrs" v-on="on">
              <span>{{ typeToLabel[type] }}</span>
              <v-icon right>
                mdi-menu-down
              </v-icon>
            </v-btn>
          </template>
          <v-list>
            <v-list-item @click="type = 'day'">
              <v-list-item-title>Day</v-list-item-title>
            </v-list-item>
            <v-list-item @click="type = 'week'">
              <v-list-item-title>Week</v-list-item-title>
            </v-list-item>
            <v-list-item @click="type = 'month'">
              <v-list-item-title>Month</v-list-item-title>
            </v-list-item>
            <v-list-item @click="type = '4day'">
              <v-list-item-title>4 days</v-list-item-title>
            </v-list-item>
          </v-list>
        </v-menu>
      </v-toolbar>

      <event-dialog
        ref="eventDialog"
        :event="selectedEvent"
        :locations="locations"
        @changed="updateEvent"
        @deleted="deleteEvent"
      ></event-dialog>

      <v-calendar
        ref="calendar"
        v-model="value"
        color="primary"
        :type="type"
        locale="en-EN"
        :start="start"
        :end="end"
        first-time="6:00"
        interval-count="18"
        :short-weekdays="false"
        :show-week="true"
        :events="events"
        :event-ripple="true"
        @click:date="viewDay"
        @click:event="showEvent"
        @mousedown:event="startDrag"
        @mousedown:time="startTime"
        @mousemove:time="mouseMove"
        @mouseup:time="endDrag"
        @mouseleave.native="cancelDrag"
      >
        <template v-slot:event="{ event, timed, eventSummary }">
          <div class="v-event-draggable" v-html="eventSummary()"></div>
          <p
            class="v-event-draggable"
            v-if="event.location"
            style="padding-left: 6px;"
          >
            <v-icon small color="white">mdi-map-marker</v-icon
            >{{ event.location_name }}
          </p>
          <p
            class="v-event-draggable"
            v-if="event.info"
            style="padding-left: 6px;"
          >
            <v-icon small color="white">mdi-information-variant</v-icon
            >{{ event.info }}
          </p>

          <div
            v-if="timed"
            class="v-event-drag-bottom"
            @mousedown.stop="extendBottom(event)"
          ></div>
        </template>
      </v-calendar>
    </v-container>
  </div>
</template>

<script>
import EventDialog from "./EventDialog.vue";
// import TooltippedIcon from "../generic/TooltippedIcon.vue";
export default {
  components: { EventDialog },
  // components: { TooltippedIcon },
  name: "Events",

  data: () => ({
    conference: null,
    value: "",
    events: [],
    locations: [],
    colors: [
      "#2196F3",
      "#3F51B5",
      "#673AB7",
      "#00BCD4",
      "#4CAF50",
      "#FF9800",
      "#757575",
    ],
    names: [
      "Meeting",
      "Holiday",
      "PTO",
      "Travel",
      "Event",
      "Birthday",
      "Conference",
      "Party",
    ],
    dragEvent: null,
    dragStart: null,
    createEvent: null,
    createStart: null,
    extendOriginal: null,
    focus: "",
    start: Date.now(),
    end: "",
    type: "week",
    typeToLabel: {
      month: "Month",
      week: "Week",
      day: "Day",
      "4day": "4 Days",
    },
    selectedEvent: null,
  }),
  mounted() {
    // fetch required data for this page
    this.$http
      .get("https://munoltom.pythonanywhere.com/api/locations/")
      .then((response) => {
        this.locations = response.data;

        this.$http
          .get("https://munoltom.pythonanywhere.com/api/events/")
          .then((response) => {
            this.raw_events = response.data;
            this.raw_events.forEach((event) => {
              event.start = new Date(`${event.day} ${event.start_time}`);
              event.end = new Date(`${event.day} ${event.end_time}`);
              event.timed = true;
              event.color = "red";
              if (event.location) {
                event.location_name = this.locations[event.location].name;
              }
            });
            this.events = this.raw_events;
          })
          .catch((error) => alert(error));
      });

    this.$http
      .get("https://munoltom.pythonanywhere.com/api/conferences/")
      .then((response) => {
        [this.conference] = response.data;
        this.setMUNOLWeek();
      })
      .catch((error) => alert(error));
  },
  computed: {},
  methods: {
    startDrag({ event, timed }) {
      if (event && timed) {
        this.dragEvent = event;
        this.dragTime = null;
        this.extendOriginal = null;
      }
    },
    startTime(tms) {
      const mouse = this.toTime(tms);
      if (this.dragEvent && this.dragTime === null) {
        const { start } = this.dragEvent;

        this.dragTime = mouse - start;
      } else {
        this.createStart = this.roundTime(mouse);
        this.createEvent = {
          name: `Event #${this.events.length}`,
          color: this.rndElement(this.colors),
          start: this.createStart,
          end: this.createStart,
          timed: true,
        };
        this.addEvent(this.createEvent);
      }
    },
    addEvent(event) {
      event.day = this.toDay(event.start);
      event.start_time = this.toHoursMinutes(event.start);
      event.end_time = this.toHoursMinutes(event.end);
      this.events.push(event);
      this.$http
        .post("https://munoltom.pythonanywhere.com/api/events/", event)
        .then((r) => {
          if (r.status == 201) {
            const i = this.events.indexOf(event);
            this.events[i].id = r.data.id;
            console.log(r.data.id);
            this.successSnackbar = true;
          } else {
            console.log(r.status);
          }
        })
        .catch((e) => {
          console.log(e);
          this.errorMessage = e.message;
          this.errorSnackbar = true;
        });
    },
    updateEvent(newEvent) {
      console.log("updated");
      if (newEvent.id == undefined) {
        console.log("keine ID");
      } else {
        console.log(newEvent);
        this.$http
          .put(
            `https://munoltom.pythonanywhere.com/api/events/${newEvent.id}/`,
            newEvent
          )
          .then((r) => {
            if (r.status == 200) {
              this.successSnackbar = true;
            } else {
              console.log(r.status);
            }
          })
          .catch((e) => {
            console.log(e);
            this.errorMessage = e.message;
            this.errorSnackbar = true;
          });
      }
    },
    deleteEvent(event) {
      console.log("delete");
      this.$http
        .delete(`https://munoltom.pythonanywhere.com/api/events/${event.id}/`)
        .then((r) => {
          if (r.status == 204) {
            const i = this.events.indexOf(event);
            if (i != -1) {
              this.events.splice(i, 1);
            }
            this.successSnackbar = true;
          } else {
            console.log(r.status);
          }
        })
        .catch((e) => {
          console.log(e);
          this.errorMessage = e.message;
          this.errorSnackbar = true;
        });
    },
    extendBottom(event) {
      this.createEvent = event;
      this.createStart = event.start;
      this.extendOriginal = event.end;
    },
    mouseMove(tms) {
      const mouse = this.toTime(tms);

      if (this.dragEvent && this.dragTime !== null) {
        const { start } = this.dragEvent;
        const { end } = this.dragEvent;
        const duration = end - start;
        const newStartTime = mouse - this.dragTime;
        const newStart = this.roundTime(newStartTime);
        const newEnd = newStart + duration;

        this.dragEvent.start = newStart;
        this.dragEvent.end = newEnd;
        this.dragEvent.start_time = this.toHoursMinutes(this.dragEvent.start);
        this.dragEvent.end_time = this.toHoursMinutes(this.dragEvent.end);
        this.dragEvent.day = this.toDay(this.dragEvent.start);
        this.updateEvent(this.dragEvent);
      } else if (this.createEvent && this.createStart !== null) {
        // during creation of event when dragging until end time
        const mouseRounded = this.roundTime(mouse, false);
        const min = Math.min(mouseRounded, this.createStart);
        const max = Math.max(mouseRounded, this.createStart);

        this.createEvent.start = min;
        this.createEvent.end = max;
        const i = this.events.indexOf(this.createEvent);
        if (i != -1) {
          this.events[i].end_time = this.toHoursMinutes(this.createEvent.end);
          console.log("mousemove");
          this.updateEvent(this.events[i]);
        }
      }
    },
    endDrag() {
      this.dragTime = null;
      this.dragEvent = null;
      this.createEvent = null;
      this.createStart = null;
      this.extendOriginal = null;
    },
    cancelDrag() {
      if (this.createEvent) {
        if (this.extendOriginal) {
          this.createEvent.end = this.extendOriginal;
        } else {
          const i = this.events.indexOf(this.createEvent);
          if (i !== -1) {
            this.events.splice(i, 1);
          }
        }
      }

      this.createEvent = null;
      this.createStart = null;
      this.dragTime = null;
      this.dragEvent = null;
    },
    roundTime(time, down = true) {
      const roundTo = 15; // minutes
      const roundDownTime = roundTo * 60 * 1000;

      return down
        ? time - (time % roundDownTime)
        : time + (roundDownTime - (time % roundDownTime));
    },
    toTime(tms) {
      return new Date(
        tms.year,
        tms.month - 1,
        tms.day,
        tms.hour,
        tms.minute
      ).getTime();
    },
    toHoursMinutes(tms) {
      return new Date(tms + 60 * 1000 * 2 * 60)
        .toISOString()
        .split("T")[1]
        .split(".")[0];
    },
    toDay(tms) {
      return new Date(tms).toISOString().split("T")[0];
    },
    getEventColor(event) {
      const rgb = parseInt(event.color.substring(1), 16);
      const r = (rgb >> 16) & 0xff;
      const g = (rgb >> 8) & 0xff;
      const b = (rgb >> 0) & 0xff;

      return event === this.dragEvent
        ? `rgba(${r}, ${g}, ${b}, 0.7)`
        : event === this.createEvent
        ? `rgba(${r}, ${g}, ${b}, 0.7)`
        : event.color;
    },
    getEvents({ start, end }) {
      const events = [];

      const min = new Date(`${start.date}T00:00:00`).getTime();
      const max = new Date(`${end.date}T23:59:59`).getTime();
      const days = (max - min) / 86400000;
      const eventCount = this.rnd(days, days + 20);

      for (let i = 0; i < eventCount; i++) {
        const timed = this.rnd(0, 3) !== 0;
        const firstTimestamp = this.rnd(min, max);
        const secondTimestamp = this.rnd(2, timed ? 8 : 288) * 900000;
        const start = firstTimestamp - (firstTimestamp % 900000);
        const end = start + secondTimestamp;

        events.push({
          name: this.rndElement(this.names),
          color: this.rndElement(this.colors),
          start,
          end,
          timed,
        });
      }

      this.events = events;
    },
    rnd(a, b) {
      return Math.floor((b - a + 1) * Math.random()) + a;
    },
    rndElement(arr) {
      return arr[this.rnd(0, arr.length - 1)];
    },
    setMUNOLWeek() {
      // this.start = this.conference.startdate;
      // this.end = this.conference.enddate;
      this.value = this.conference.startdate;
    },
    viewDay({ date }) {
      this.focus = date;
      this.type = "day";
    },
    prev() {
      this.$refs.calendar.prev();
    },
    next() {
      this.$refs.calendar.next();
    },
    showEvent({ nativeEvent, event }) {
      this.selectedEvent = event;
      this.$refs.eventDialog.open();
      nativeEvent.stopPropagation();
    },
  },
};
</script>
<style scoped lang="scss">
.v-event-draggable {
  padding-left: 6px;
}

.v-event-timed {
  user-select: none;
  -webkit-user-select: none;
}

.v-event-drag-bottom {
  position: absolute;
  left: 0;
  right: 0;
  bottom: 4px;
  height: 4px;
  cursor: ns-resize;

  &::after {
    display: none;
    position: absolute;
    left: 50%;
    height: 4px;
    border-top: 1px solid white;
    border-bottom: 1px solid white;
    width: 16px;
    margin-left: -8px;
    opacity: 0.8;
    content: "";
  }

  &:hover::after {
    display: block;
  }
}

.v-application p {
  margin-bottom: 0px !important;
}
</style>
