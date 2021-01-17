<template>
  <div class="col">
    <div
      v-if="!timerFake"
      id="myCard"
      class="q-pa-md row items-start q-gutter-md small-screen"
    >
      <q-card>
        <div class="q-gutter-sm">
          <div class="row">
            <div class="col-4 text-left">
              <q-checkbox v-model="special" color="purple" label="Special" />
            </div>
            <div class="col-8 text-right q-pa-sm">
              <q-btn
                round
                @click="openMode('Chronometer')"
                class="text-purple"
                flat
                icon="directions_run"
              />
              <q-btn
                round
                @click="openList"
                class="text-purple"
                flat
                icon="receipt_long"
              ></q-btn>
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
            <name :provisionalName="name" mode="home" v-on:name="getName"></name>
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

        <q-card-actions class="text-purple" align="around">
          <q-btn @click="startTimer" flat icon="play_circle_filled"></q-btn>
          <q-btn v-show="sessionNext" @click="sessionComplete" flat icon="check_circle" />
          <q-btn v-show="sessionNext" @click="resetTimer" flat icon="content_cut"></q-btn>
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
            <div class="col-4 text-left">
              <q-btn
                flat
                :disable="timerRun"
                @click="sessionSave"
                class="text-orange"
                icon="pending"
              />
            </div>
            <div class="col-4 text-left">
              <q-btn
                flat
                :disable="timerRun"
                @click="sessionDebt"
                class="text-orange"
                icon="card_travel"
              />
            </div>
            <div class="col-4 text-right">
              <q-btn
                :disable="timerRun"
                flat
                @click="sessionContinue"
                class="text-orange"
                icon="arrow_forward_ios"
              />
            </div>
          </div>
          <div class="text-h6 q-pt-sm content-center">
          <name :provisionalName="name" mode="home" v-on:name="getName"></name>
          </div>
          <div class="text-h6">PC {{ PC }}</div>
          <div class="text-h6">
            <q-circular-progress
              :value="completed"
              show-value
              size="130px"
              color="orange"
              class="q-ma-md"
            >
              <div class="text-h5 text-weight-light">{{ minutes }} : {{ seconds }}</div>
              <q-separator color="orange" />
              <div class="text-subtitle1 text-weight-light">{{ time_end_local }}</div>
            </q-circular-progress>
          </div>
          <div class="row ">
            <div class="col-4">
              <q-badge style="height:20px;" transparent align="middle" color="purple-7">
              <q-input dark
              borderless
              v-model="minutesAccumalator"
              label-color="white"
              color="white"
              :input-style="{
                fontSize:'17px',
                textAlign: 'center',
                fontWeight: 'light',
              }"
              />
              </q-badge>
            </div>
            <div class="col-4"></div>
            <div class="col-4 text-right">
              <q-badge style="height:20px;" transparent align="middle" color="purple-7">
              <q-input dark
              borderless
              disable
              v-model="valueEarn"
              label-color="white"
              color="white"
              :input-style="{
                fontSize:'17px',
                textAlign: 'center',
                fontWeight: 'light',
              }"
              />
              </q-badge>
            </div>
          </div>
        </q-card-section>

        <q-card-actions v-if="session" class="text-purple" align="around">
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
    <pending :owner="PC" v-on:closeDialog="pendingDialog" v-if="openDept"></pending>
  </div>
</template>
<script>
import moment from "moment";
import { uid } from "quasar";
import { Dialog } from "quasar";
import name from "src/components/Universal/fields";
import { Platform } from "quasar";
import { Notify } from "quasar";
import Pending from "./Pending.vue";
export default {
  name: "timer",
  components: {
    Pending,
    name,
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
      openDept: false,
      date: null,
      /*
       *Timer
       */
      time_end_local: null,
      time_end_local_unix:null,
      time_origin: null,
      time_rest: null,
      time_zero: null,
      seconds: null,
      secondsRun: null,
      minutes: null,
      interval: null,
      setMinutes: null,
      setSeconds: null,
      setMilliseconds: null,
      accumulator: 0,
      timerFake: false,
      timerRun: null,
      completed: null,
      time_start: null,
      time_left: null,

      /*
       *Session and User
       */
      sessionNext: null,
      session: null,
      sessionStart: null,
      sessionEnd: null,
      category: null,
      categoryOptions: ["In come", "Debt", "Pending"],
      status: null,
      moneyPerMinutes: 33.33333333333333,
      minutesAccumalator: 0,
      name: null,
    };
  },
  created() {},
  watch: {},
  computed: {
    timerActive() {
      if (!this.timerFake) {
        return "bg-purple text-white text-center";
      } else {
        return "bg-purple-6 text-white text-center";
      }
    },
    valueEarn() {
      if (this.setMinutes) {
        if (this.special == true) {
          this.moneyPerMinutes = 26.667;
        }
        if (this.minutesAccumalator >= 180) {
          this.special = true;
          this.moneyPerMinutes = 26.667;
        }
        return Math.round(this.minutesAccumalator * this.moneyPerMinutes);
      }
    },
  },
  methods: {
    getName(payload) {
      this.name = payload[0].name;
      this.idUser = payload[0].id;
    },

    startTimer() {
      if (this.minutes != null) {
        moment.locale("en");
        this.time_origin = this.minutes;
        this.mode = "timer";
        this.sessionActive();
       // this.minutesAccumalator = parseInt(this.minutesAccumalator);
        this.timerRun = true;
        this.setSeconds = this.minutes * 60;

        this.setMinutes = parseInt(this.minutes);
        this.minutesAccumalator = parseInt(this.minutesAccumalator) + this.setMinutes;
        this.setMilliseconds = this.getMillisecondsFromMinutes(this.setMinutes);

        this.time_end_local = new Date().getTime() + this.setMilliseconds;
        this.time_end_local_unix = new Date().getTime() + this.setMilliseconds;
        
        this.time_end_local = moment(this.time_end_local).format("LT");

        if (this.name == null) {
          this.name = "Anonymous";
          let user = this.$store.getters["warehouse/UserByName"](this.name);
          this.idUser = user[0].id;
        }
        if (this.category == null) {
          this.category = this.categoryOptions[0];
        }
        this.newNotify();
        this.interval = setInterval(this.timer, 1000);
      }
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

    timer() {
      this.timerFake = true;

      this.secondsRun = parseInt((new Date().getTime() - this.sessionStart) / 1000);

      if (this.secondsRun >= this.setSeconds) {
        this.stopTimer();
        this.$emit("timeEnd");
        this.time_zero = true;
        this.$q.notify({
          color: "purple",
          message: `PC${this.PC} time ended`,
          icon: "announcement",
        });
      }

      this.convertTimer(this.secondsRun);
      this.accumulator = (this.secondsRun / this.setSeconds) * 100;

      this.completed = this.accumulator;
    },

    resumenTimer() {
      if (this.session) {
        this.time_end_local = new Date().getTime() + this.setMilliseconds;
        this.time_end_local = moment(this.time_end_local).format("LT");
        this.sessionStart = Date.now() - this.secondsRun * 1000;
        this.interval = setInterval(this.timer, 1000);
        this.timerRun = true;
      }
    },

    stopTimer() {
      this.sessionStart = null;
      this.timerRun = false;
      clearInterval(this.interval);
    },
    resetTimer() {
      this.mode = null;
      this.special = false;
      this.time_zero = null;
      this.time_rest = null;
      this.secondsRun = null;
      this.timerFake = false;
      this.minutes = null;
      this.seconds = null;
      this.accumulator = 0;
      this.completed = null;
      this.setMilliseconds = null;
      this.setMinutes = null;
      this.interval = null;
      this.date = null;
      this.session = null;
      this.sessionStart = null;
      this.sessionEnd = null;
      this.status = null;
      this.time_left = null;
      this.minutesAccumalator = 0;
      this.name = null;
      this.category = null;
      this.time_end_local_unix = 0
      this.time_end_local = null;
    },

    sessionActive() {
      this.session = true;
      this.sessionStart = Date.now();
      this.date = Date.now();
    },

    sessionContinue() {
      if (this.session == true) {
        this.sessionNext = true;
        this.timerFake = false;
        this.minutes = null;
        this.seconds = null;
        this.accumulator = 0;
        this.completed = null;
        this.setMilliseconds = null;
        // this.setMinutes = null;
        this.interval = null;
      }
    },

    sessionSave() {
      if (this.session) {
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
      }
    },

    sessionDebt() {
      if (this.session) {
          this.category = 'Debt'
          this.status = "still debt";
          let register = this.newRegister();
          this.dialogResume(register);
      }
    },

    sessionComplete() {
      if (this.session) {
        this.category = "In come";
        let register = this.newRegister();
        this.dialogResume(register);
      }
    },

    getMillisecondsFromMinutes(data) {
      return data * 60000;
    },
    openList() {
      this.openDept = true;
    },

    newRegister() {
      this.sessionEnd = Date.now();
      let timeRest = this.setSeconds - this.secondsRun;
      this.time_left = this.restTimer(timeRest);
      return {
        id: uid(),
        idUser: this.idUser,
        special: this.special,
        mode: this.mode,
        pc: this.PC,
        name: this.name,
        date: this.date,
        time_start: this.date,
        time_end: this.sessionEnd,
        minutes: this.minutesAccumalator,
        earn: this.valueEarn,
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
          this.sendNewRegister(data);
        })
        .onCancel(() => {})
        .onDismiss(() => {});
    },

    sendNewRegister(data) {
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
        .post(`${process.env.API}/api/new-time`, formData)
        .then((response) => {
          this.$store.commit("warehouse/getRegisters");
          this.$store.commit("warehouse/getUsers");
          this.$q.notify({
            color: "purple",
            message: `register created`,
            icon: "announcement",
          });
          console.log(response.data);
        })
        .catch((error) => {
          this.$store.commit("warehouse/getRegisters");
          console.log(error);
          this.$q.notify({
            color: "indigo",
            message: `register created offline`,
            icon: "announcement",
          });
        });
    },
    pendingDialog(payload) {
      this.openMode("timerPending");
      this.openDept = payload;
    },

    openMode(payload) {
      this.$emit("openMode", payload);
    },

    newNotify(){
      let formData = new FormData();

      formData.append("pc", this.PC);
      formData.append("name", this.name);
      formData.append("date", this.time_end_local_unix);
      formData.append("minutes", this.minutesAccumalator);
      formData.append("earn", this.valueEarn);
      formData.append("category", this.category);
      this.$axios
        .post(`${process.env.API}/api/new-notify`, formData)
        .then((response)=>{
          console.log(response)
        }).catch(error=>{
          console.log(error);
        });
    }
  },
};
</script>

<style lang="sass">
.tamaño
    font-size:30px

#myCard
  @media(max-width: $breakpoint-xs-max )
        display: block
</style>
