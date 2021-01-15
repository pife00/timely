<template>
  <div>
    <div class="q-pt-md">
      <div class="constrain">
        <div class="justify-center">
          <dates v-on:date="getDate"></dates>
        </div>
        <div :class="cardScreen">
          <card title="Salary" :value="salary"></card>
          <card title="Minutes" :value="minutes"></card>
          <card title="Pending" :value="pending"></card>
          <card title="Debt" :value="debt"></card>
        </div>
        <hr />
        <chart :today="today"></chart>
      </div>
    </div>
  </div>
</template>
<script>
import Card from "src/components/Board/Card.vue";
import Chart from "src/components/Board/Chart.vue";
import Dates from "src/components/Universal/Dates";
export default {
  components: { Card, Chart, Dates },
  name: "board",
  data() {
    return {
      dates: null,
      filter: "Today",
      /*
       *Size Screen
       */
      windowWidth: window.innerWidth,
    };
  },

  mounted() {
    window.addEventListener("resize", () => {
      this.windowWidth = window.innerWidth;
    });
  },
  filter: {},

  computed: {
    reg: {
      get: function () {
        return this.$store.state.warehouse.registers;
      },
      set: function () {},
    },
    salary: {
      get: function () {
        if (this.listWithFilters) {
          return this.localMoney(this.sumAll("earn", this.listWithFilters, "In come"));
        }
      },
      set: function () {},
    },
    minutes: {
      get: function () {
        if (this.listWithFilters) {
          return this.localTime(this.sumAll("minutes", this.listWithFilters, "In come"));
        }
      },
      set: function () {},
    },
    pending: {
      get: function () {
        if (this.listWithFilters) {
          return this.sumAll("minutes", this.listWithFilters, "Pending");
        }
      },
      set: function () {},
    },
    debt: {
      get: function () {
        if (this.listWithFilters) {
          return this.sumAll("earn", this.listWithFilters, "Debt");
        }
      },
      set: function () {},
    },
    cardScreen() {
      return {
        "row large-screen-only": !this.isMobile,
        "small-screen-only": this.isMobile,
      };
    },

    list: {
      get: function () {
        return this.reg;
      },
      set: function () {},
    },

    today() {
      if (this.dates != null) {
        return this.orderToday(this.list);
      }
    },

    listWithFilters() {
      if (this.filter != null) {
        if (this.filter == "Today") {
          return this.today;
        }
      } else {
        return this.list;
      }
    },

    isMobile() {
      return this.windowWidth <= 599;
    },
  },
  methods: {
    sumAll(field, array, category) {
      let filter = array.filter((el) => {
        return el.category == category;
      });

      return filter.reduce((acc, cur) => {
        return acc + cur[field];
      }, 0);
    },

    getDate(payload) {
      this.dates = payload;
      if (this.dates == null) {
        this.filter = null;
      } else {
        this.filter = "Today";
      }
    },

    localMoney(value) {
      return new Intl.NumberFormat().format(value);
    },

    localTime(value) {
      let hour = value / 60;
      let restHour = Math.floor(hour);
      let minutes = Math.round((hour - restHour) * 60);
      let local = restHour + ":" + minutes;
      return local;
    },

    orderToday(array) {
      return array.filter((el) => {
        if (el.date > this.dates.startDay && el.date < this.dates.endToday) {
          return el.date;
        }
      });
    },
  },
};
</script>
