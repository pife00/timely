<template>
  <div>
    <div class="constrain">
      <div class="text-center">
        <q-btn
          @click="backCount"
          class="q-mt-sm bg-purple text-white"
          size="md"
          round
          icon="add"
        />
      </div>
      <div @click="touchStart" :class="cardScreen">
        <div class="col-3" v-for="pc in 4" :key="pc">
          <card v-on:timeEnd="myTime" :PC="pc"></card>
        </div>
      </div>
    </div>

    <p>{{ numero }}</p>
    <audio v-show="showAudio" id="sound" controls>
      <source src="../statics/sounds/audio.mp3" type="audio/mp3" />
    </audio>
  </div>
</template>

<script>
import card from "src/components/Home/Card.vue";
import { Dialog } from "quasar";
import { Platform } from "quasar";
export default {
  name: "PageHome",
  components: {
    card,
  },
  created() {},

  data() {
    return {
      numero: null,
      toucheActive: false,
      interval: null,
      showAudio: false,
      /*
       * size screen
       */
      windowWidth: window.innerWidth,
      date: null,
      count: 0,
      interval: null,
    };
  },

  created() {},
  watch: {},

  mounted() {
    window.addEventListener("resize", () => {
      this.windowWidth = window.innerWidth;
    });
  },
  computed: {
    isMobile() {
      return this.windowWidth <= 599;
    },
    cardScreen() {
      return {
        "row large-screen-only": !this.isMobile,
        "small-screen-only": this.isMobile,
      };
    },
  },
  methods: {
    backCount() {
      this.start = new Date().getTime();
      this.interval = setInterval(this.timer, 1000);
    },
    stopTimer() {
      clearInterval(this.interval);
    },
    timer() {
      this.count = parseInt((new Date().getTime() - this.start) / 1000);
    },

    playSound() {
      let el = document.getElementById("sound");
      el.play();
    },
    myTime(payload) {
      this.playSound();
    },
    screen() {
      let el = window.innerWidth;
      console.log(el);
      return el;
    },
    touchStart() {
      if (this.toucheActive == false) {
        let el = document.getElementById("sound");
        el.play();
        el.pause();
        this.toucheActive = true;
      }
    },
  },
};
</script>
<style lang="sass"></style>
