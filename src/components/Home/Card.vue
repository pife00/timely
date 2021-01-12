<template>
  <div class="col">
    <timer
      v-if="mode == 'Timer'"
      v-on:timeEnd="myTime"
      v-on:openMode="openMode"
      :PC="PC"
    ></timer>

    <chronometer
      v-if="mode == 'Chronometer'"
      :PC="PC"
      v-on:openMode="openMode"
    ></chronometer>

    <timer-pending
      v-if="mode == 'timerPending'"
      v-on:timeEnd="myTime"
      v-on:openMode="openMode"
      :PC="PC"
    >
    </timer-pending>
  </div>
</template>
<script>
import timer from "./Timer";
import pending from "./Pending";
import chronometer from "./Chronometer";
import timerPending from "./TimerPending";
export default {
  name: "card",
  components: {
    pending,
    timer,
    chronometer,
    timerPending,
  },
  props: {
    PC: Number,
  },
  data() {
    return {
      mode: "Timer",
    };
  },
  created() {},
  watch: {},
  computed: {},
  methods: {
    myTime(payload) {
      this.$emit("timeEnd");
    },

    openChronometer(payload) {
      this.mode = payload;
    },

    openTimer(payload) {
      this.mode = payload;
    },
    openMode(payload) {
      this.mode = payload;
    },
  },
};
</script>
