<template>
  <div class="col">
    <div
      v-if="!timerFake"
      id="myCard"
      class="q-pa-md row items-start q-gutter-md small-screen"
    >
      <q-card class="pending">
        <div class="q-gutter-sm">
          <div class="row">
            <div class="col-2 text-left">
              <q-checkbox v-model="special" color="indigo" label="Special" />
            </div>
            <div class="col-10 text-right text-indigo-6 q-pa-sm">
              <q-btn round @click="openMode('Chronometer')" flat icon="directions_run" />
              <q-btn round @click="openMode('Timer')" flat icon="timer"></q-btn>
              <q-btn round @click="openList" flat icon="receipt_long"></q-btn>
            </div>
          </div>
        </div>
        <q-card-section class="my-card" :class="timerActive">
          <div class="text-h6">PC {{ PC }}</div>
          <div class="text-h6">
            <q-input
              label="time"
              dark
              borderless
              v-model="minutes"
              mask="#########"
              label-color="white"
              color="white"
              :input-style="{
                fontSize: '2.5rem',
                textAlign: 'center',
                fontWeight: 'light',
              }"
            />
            <q-input
              dark
              label
              Pending-color="white"
              v-model="name"
              :disable="session"
              color="white"
              borderless
              label="name"
            />
            <q-select
              dark
              label-color="white"
              v-model="category"
              :options="categoryOptions"
              color="white"
              borderless
              label="category"
            />
          </div>
        </q-card-section>

        <q-card-actions class="text-indigo-6" align="around">
          <q-btn @click="startTimer" flat icon="play_circle_filled"></q-btn>
        </q-card-actions>
      </q-card>
    </div>

    <div
      v-if="timerFake"
      id="myCard"
      class="q-pa-md row items-start q-gutter-md small-screen"
    >
      <q-card class="my-card">
        <q-card-section :class="timerActive">
          <div class="row">
            <div class="col-6 text-left">
              <q-btn
                flat
                :disable="timerRun"
                @click="sessionSave"
                class="text-orange"
                icon="save"
              />
            </div>
          </div>
          <div class="text-h6 q-pt-sm">{{ name }}</div>
          <div class="text-h6">PC {{ PC }}</div>
          <div class="text-h6">
            <q-circular-progress
              :value="completed"
              show-value
              size="130px"
              color="orange"
              class="q-ma-md"
            >
              <div class="text-h4 text-weight-light">{{ minutes }} : {{ seconds }}</div>
            </q-circular-progress>
          </div>
        </q-card-section>

        <q-card-actions v-if="session" class="text-indigo-6" align="around">
          <q-btn v-if="timerRun" @click="stopTimer" flat icon="pause" />
          <q-btn
            :disable="time_zero"
            v-if="!timerRun"
            @click="resumenTimer"
            flat
            icon="play_circle_filled"
          />
          <q-btn :disable="timerRun" @click="sessionComplete" flat icon="check_circle" />
          <q-btn :disable="timerRun" @click="resetTimer" flat icon="content_cut"></q-btn>
        </q-card-actions>
      </q-card>
    </div>
    <pending :owner="PC" v-on:closeDialog="pendingDialog" v-if="openDebt"></pending>
  </div>
</template>
<script>
import moment from "moment";
import { uid } from "quasar";
import { Dialog } from "quasar";

//import worker from "../../statics/js/time.worker";
import { Notify } from "quasar";
import Pending from "./Pending.vue";
export default {
  name: "Timer-pending",
  components: {
    Pending,
  },
  props: {
    PC: Number,
  },
  data() {
    return {
      /*
       *Global
       */
      id: null,
      idUser: null,
      mode: null,
      special: false,
      openDebt: false,
      date: null,
      earn: null,
      /*
       *Timer
       */
      time_rest: null,
      time_zero: null,
      seconds: null,
      minutes: null,
      minutesReal: null,
      secondsRun: null,
      interval: null,
      setMinutes: null,
      setSeconds: null,
      setMilliseconds: null,
      accumulator: 0,
      timerFake: false,
      timerRun: null,
      completed: null,
      time_start: null,
      time_end: null,
      time_left: null,
      /*

      /*
       *Session and User
       */
      session: null,
      sessionStart: null,
      sessionEnd: null,
      category: null,
      categoryOptions: ["In come", "Debt", "Pending"],
      status: null,
      moneyPerMinutes: 33.33333333333333,
      minutesAccumalator: null,
      name: null,
    };
  },
  created() {
    this.resumenPending();
  },
  watch: {
    personPending(value) {
      if (value == null || value == undefined) {
      } else {
        this.resumenPending();
      }
    },
  },

  computed: {
    timerActive() {
      if (!this.timerFake) {
        return "bg-indigo text-white text-center";
      } else {
        return "bg-indigo-6 text-white text-center";
      }
    },
    personPending() {
      if (this.$store.state.warehouse.personRegistersPending) {
        let pc = this.$store.state.warehouse.personRegistersPending[0].PC;
        let payload = this.$store.state.warehouse.personRegistersPending[1].data;
        if (pc === this.PC) {
          return payload;
        }
      }
    },
  },
  methods: {
    resumenPending() {
      this.category = this.personPending.category;
      this.date = this.personPending.date;

      this.id = this.personPending.id;
      this.idUser = this.personPending.idUser;
      this.minutesReal = this.personPending.minutes;
      this.minutes = parseInt(this.personPending.time_left);
      this.mode = this.personPending.mode;
      this.name = this.personPending.name;
      this.earn = this.personPending.earn;

      this.special = this.personPending.special;
      this.status = this.personPending.status;
      this.time_end = this.personPending.time_end;
      this.time_left = this.personPending.time_left;
      this.time_start = this.personPending.time_start;
      //this.$store.commit("warehouse/personRegistersPending", null);
    },

    startTimer() {
      if (this.minutes != null) {
        this.mode = "timer";
        this.sessionActive();
        this.timerRun = true;
        this.setSeconds = this.minutes * 60;

        this.setMinutes = parseInt(this.minutes);
        this.minutesAccumalator = this.minutesAccumalator + this.setMinutes;
        this.setMilliseconds = this.getMillisecondsFromMinutes(this.setMinutes);

        this.interval = setInterval(this.timer, 1000);
      }
    },

    timer() {
      this.timerFake = true;

      this.secondsRun = parseInt((new Date().getTime() - this.sessionStart) / 1000);

      if (this.secondsRun >= this.setSeconds) {
        this.stopTimer();
        this.status = "completed";
        this.$emit("timeEnd");
        this.time_zero = true;
        this.$q.notify({
          color: "purple",
          message: `PC${this.PC} time ended`,
          icon: "announcement",
        });
      }

      this.convertTimer(this.secondsRun);
      this.accumulator =(this.secondsRun/this.setSeconds)*100;
      this.completed = this.accumulator; 
    },

    convertTimer(value) {
      let hour = value / 60;
      let restHour = Math.floor(hour);
      let minutes = Math.round((hour - restHour) * 60);
      this.minutes = restHour;
      this.seconds = minutes;
    },

    restTimer(value) {
      let hour = value / 60;
      let restHour = Math.floor(hour);
      let minutes = Math.round((hour - restHour) * 60);
      let total = restHour + ":" + minutes;
      return total;
    },

    resumenTimer() {
      if (this.session) {
        this.sessionStart = Date.now() - this.secondsRun * 1000;
        this.interval = setInterval(this.timer, 1000);
        this.timerRun = true;
      }
    },

    stopTimer() {
      clearInterval(this.interval);
      this.sessionStart = null;
      this.timerRun = false;
    },
    resetTimer() {
      this.mode = null;
      this.discount = false;
      this.time_zero = null;
      this.timerFake = false;
      this.minutes = null;
      this.seconds = null;
      this.accumulator = 0;
      this.completed = null;
      this.setMilliseconds = null;
      this.setMinutes = null;
      this.interval = null;
      this.secondsRun = null;
      this.session = null;
      this.sessionStart = null;
      this.sessionEnd = null;
      this.status = null;
      this.time_left = null;
      this.minutesAccumalator = null;
      this.name = null;
    },

    sessionActive() {
      this.session = true;
      this.sessionStart = Date.now();
    },

    sessionSave() {
      if (this.category != "Debt") {
        this.category = this.categoryOptions[2];
        this.status = "still pending";
        let register = this.newRegister();
        this.dialogResume(register);
      } else {
        this.status = "still debt";
        let register = this.newRegister();
        this.dialogResume(register);
      }
    },

    sessionComplete() {
      if (this.session) {
        if (this.status == "completed") {
          this.category = "In come";
        }

        let register = this.newRegister();
        this.dialogResume(register);
      }
    },

    getMillisecondsFromMinutes(data) {
      return data * 60000;
    },
    openList() {
      this.openDebt = true;
    },

    newRegister() {
      this.sessionEnd = Date.now();
      let timeRest = this.setSeconds - this.secondsRun;
      this.time_left = this.restTimer(timeRest);
      return {
        id: this.id,
        idUser: this.idUser,
        special: this.special,
        mode: this.mode,
        pc: this.PC,
        name: this.name,
        date: this.date,
        time_start: this.date,
        time_end: this.time_end,
        minutes: this.minutesReal,
        earn: this.earn,
        category: this.category,
        time_left: this.time_left,
        status: this.status,
        money_minutes: this.moneyPerMinutes,
      };
    },

    dialogResume(data) {
      moment.locale("es-mx");
      let start = moment(data.time_start).format("LLLL");
      let end = moment(data.time_end).format("LLLL");
      this.$q
        .dialog({
          title: "Are you sure?",
          cancel: true,
          html: true,
          ok: {
            push: true,
            color: "purple",
          },

          cancel: {
            push: true,
            color: "deep-purple-10",
          },
          message: `<p> <b>name:</b> ${data.name}</p>
        <p> <b>PC:</b> ${data.pc}</p>
        <p> <b>earn:</b> ${data.earn}</p>
        <p> <b>discount:</b> ${data.special}</p>
        <p> <b>minutes:</b> ${data.minutes}</p>
        <p> <b>time_left:</b> ${data.time_left}</p>
        <p> <b>status:</b> ${data.status}</p>
        <p> <b>category:</b> ${data.category}</p>
        <p> <b>time_start:</b> ${start}</p>
        <p> <b>time_end:</b> ${end}</p>`,
          position: "bottom",
        })
        .onOk(() => {
          this.updateRegister(data);
        })
        .onCancel(() => {
          console.log("cancel");
        })
        .onDismiss(() => {});
    },

    pendingDialog(payload) {
      this.openDebt = payload;
    },

    openMode(payload) {
      this.$emit("openMode", payload);
    },

    updateRegister(data) {
      let formData = new FormData();
      formData.append("id", data.id);
      formData.append("idUser", data.idUser);
      formData.append("special", data.special);
      formData.append("mode", data.mode);
      formData.append("pc", data.pc);
      formData.append("name", data.name);
      formData.append("date", data.date);
      formData.append("time_start", data.time_start);
      formData.append("time_end", data.time_end);
      formData.append("minutes", data.minutes);
      formData.append("earn", data.earn);
      formData.append("category", data.category);
      formData.append("time_left", data.time_left);
      formData.append("status", data.status);
      formData.append("money_minutes", data.money_minutes);
      this.$axios
        .post(`${process.env.API}/api/update-time`, formData)
        .then((response) => {
          this.$store.commit("warehouse/getRegisters");
          this.$store.commit("warehouse/getUsers");
          console.log(response.data);
        })
        .catch((error) => {
          console.log(error);
        });
    },
  },
};
</script>

<style lang="sass">

.pending
  @media(min-width: $breakpoint-md-min )
    width: 220px

.tamaño
    font-size:30px

#myCard

  @media(max-width: $breakpoint-xs-max )
        display: block
</style>
