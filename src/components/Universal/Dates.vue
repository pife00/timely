<template>
  <div>
    <div class="constrain row justify-end">
      <q-btn icon="event" round color="purple">
        <q-popup-proxy transition-show="scale" transition-hide="scale">
          <q-date range color="purple" v-model="date">
            <div class="row justify-end">
              <q-btn flat color="purple" v-close-popup label="CANCEL"></q-btn>
              <q-btn @click="dates" flat color="indigo" v-close-popup label="OK"></q-btn>
            </div>
          </q-date>
        </q-popup-proxy>
      </q-btn>
    </div>
  </div>
</template>
<script>
import moment from "moment";
export default {
  props: ["options"],
  name: "dates",
  data() {
    return {
      choose: "Today",
      showDate: false,
      date: moment().format("YYYY/M/D"),
    };
  },
  created() {
    this.dates();
  },
  computed: {
    unixValue() {},
  },
  methods: {
    dates() {
      if (this.date == null) {
        this.$emit("date", null);
      } else {
        if (this.date.hasOwnProperty("to") && this.date.hasOwnProperty("from")) {
          let startDay = new Date(this.date.from);
          let endToday = new Date(this.date.to);

          let el = {
            startDay: startDay,
            endToday: endToday,
          };
          this.$emit("date", el);
          return el;
        } else {
          let date = new Date(this.date);
          let startDay = moment(date).startOf("day");
          let endToday = moment(date).endOf("day");
          let el = {
            startDay: startDay._d,
            endToday: endToday._d,
          };
          this.$emit("date", el);
          return el;
        }
      }
    },
  },
};
</script>
