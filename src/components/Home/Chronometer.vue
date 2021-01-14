<template>
  <div class="col">
    <div
      v-if="!timerFake"
      id="myCard"
      class="q-pa-md row items-start q-gutter-md small-screen"
    >
      <q-card>
        <div class="q-gutter-sm">
          <div class="col-6 text-right text-orange-10 q-pa-sm">
            <q-btn round @click="openMode('Timer')" flat icon="timer" />
            <q-btn round @click="openList" flat icon="receipt_long"></q-btn>
          </div>
        </div>
        <q-card-section class="my-card" :class="timerActive">
          <div class="text-h6">PC {{ PC }}</div>
          <div class="text-h6">
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

        <q-card-actions class="text-orange-10" align="around">
          <q-btn @click="startChronometer" flat icon="play_circle_filled"></q-btn>
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

        <q-card-actions v-if="session" class="text-orange-10" align="around">
          <q-btn v-if="chronometerRun" @click="stopChronometer" flat icon="pause" />
          <q-btn
            v-if="!chronometerRun"
            @click="resumenChronometer"
            flat
            icon="play_circle_filled"
          />
          <q-btn
            :disable="chronometerRun"
            @click="sessionComplete"
            flat
            icon="check_circle"
          />
          <q-btn
            :disable="chronometerRun"
            @click="resetTimer"
            flat
            icon="content_cut"
          ></q-btn>
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
import { Notify } from "quasar";
import Pending from "./Pending.vue";
export default {
  name: "chronometer",
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
       *Time
       */
      seconds: null,
      minutes: null,
      interval: null,
      setMinutes: null,
      setMilliseconds: null,
      setSeconds: null,
      secondsRun: null,
      accumulator: 0,
      timerFake: false,
      chronometerRun: null,
      completed: null,
      time_start: null,
      time_left: null,
      time_rest: null,

      /*
       *Session and User
       */
      session: null,
      sessionStart: null,
      sessionEnd: null,
      category: "In come",
      categoryOptions: ["In come", "Debt", "Pending"],
      status: null,
      moneyPerMinutes: 0.000555555,
      minutesAccumalator: null,
      name: null,
    };
  },
  created() {},
  watch: {},
  computed: {
    timerActive() {
      if (!this.timerFake) {
        return "bg-orange-10 text-white text-center";
      } else {
        return "bg-orange-7 text-white text-center";
      }
    },
    valueEarn() {
      if (this.accumulator) {
        let value = Math.round(this.accumulator * this.moneyPerMinutes);
        return value;
      }
    },
  },
  methods: {
    getName(payload) {
      this.name = payload[0].name;
      this.idUser = payload[0].id;
    },

    startChronometer() {
      this.mode = "chronometer";
      this.chronometerRun = true;
      this.sessionActive();

      if (this.name == null) {
        this.name = "Anonymous";
        let user = this.$store.getters["warehouse/UserByName"](this.name);
        this.idUser = user[0].id;
      }
      if (this.category == null) {
        this.category = "In come";
      }
      this.interval = setInterval(this.chronometer, 1000);
    },

    resumenChronometer() {
      if (this.session) {
        this.interval = setInterval(this.chronometer, 1000);
        this.sessionStart = Date.now() - this.secondsRun * 1000;
        this.chronometerRun = true;
      }
    },

    convertTimer(value) {
      let hour = value / 60;
      let restHour = Math.floor(hour);
      let minutes = Math.round((hour - restHour) * 60);
      this.minutes = restHour;
      this.seconds = minutes;
    },

    stopChronometer() {
      clearInterval(this.interval);
      this.chronometerRun = false;
      this.sessionStart = null;
    },

    chronometer() {
      this.timerFake = true;
      this.secondsRun = parseInt((new Date().getTime() - this.sessionStart) / 1000);

      this.convertTimer(this.secondsRun);

      this.accumulator = this.accumulator + 1000;
    },

    sessionActive() {
      this.session = true;
      this.sessionStart = Date.now();
      this.date = Date.now();
    },

    resetTimer() {
      this.mode = null;
      this.special = false;
      this.secondsRun = null;
      this.timerFake = false;
      this.minutes = null;
      this.seconds = null;
      this.accumulator = 0;
      this.completed = null;
      this.setMilliseconds = null;
      this.setMinutes = null;
      this.interval = null;
      this.session = null;
      this.sessionStart = null;
      this.sessionEnd = null;
      this.status = null;
      this.time_left = null;
      this.minutesAccumalator = null;
      this.name = null;
    },

    sessionComplete() {
      if (this.session) {
        let register = this.newRegisterChronometer();
        this.dialogResume(register);
      }
    },

    getMillisecondsFromMinutes(data) {
      return data * 60000;
    },
    openList() {
      this.openDept = true;
    },

    newRegisterChronometer() {
      return {
        id: uid(),
        idUser: this.idUser,
        name: this.name,
        special: this.special,
        pc: this.PC,
        date: this.date,
        mode: this.mode,
        time_start: this.date,
        time_end: Date.now(),
        minutes: this.minutes,
        earn: this.valueEarn,
        time_left: 0,
        category: this.category,
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
         <p> <b>mode:</b> ${data.mode}</p>
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
        .onCancel(() => {
          console.log("cancel");
        })
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
          console.log(response.data);
        })
        .catch((error) => {
          this.$store.commit("warehouse/getRegisters");
          this.$store.commit("warehouse/getUsers");
          console.log(error);
        });
    },
    pendingDialog(payload) {
      this.openMode("timerPending");
      this.openDept = payload;
    },
    openMode(payload) {
      this.$emit("openMode", payload);
    },
  },
};
</script>

<style lang="sass">
.tamaño
    font-size:30px

#myCard
  @media(max-width: $breakpoint-md-max )
        display: block
  @media(max-width: $breakpoint-xs-max )
        display: block
</style>
