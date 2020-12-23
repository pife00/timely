<template>
  <q-layout view="lHh Lpr lFf">
    <q-header class="bg bg-deep-purple-8" bordered>
      <q-toolbar class="constrain">
        <q-btn
          @click="resetPersonStore"
          size="18px"
          class="large-screen-only"
          icon="alarm"
          to="/"
        />
        <q-separator
          color="purple-3"
          class="large-screen-only"
          size="1px"
          vertical
          spaced
        />

        <q-toolbar-title class="q-mr-sm">Timely</q-toolbar-title>
        <q-btn
          @click="resetPersonStore"
          size="18px"
          class="large-screen-only"
          icon="assignment"
          to="/registers"
        />
        <q-btn
          @click="resetPersonStore"
          size="18px"
          class="large-screen-only"
          icon="dashboard"
          to="/board"
        />
        <q-btn
          @click="resetPersonStore"
          class="large-screen-only"
          label="users"
          to="/users"
        />
      </q-toolbar>
    </q-header>

    <q-page-container>
      <keep-alive :include="['PageHome', 'PageRegisters']">
        <router-view />
      </keep-alive>
    </q-page-container>

    <q-footer elevated class="bg bg-deep-purple-8">
      <div>
        <q-banner v-if="showBannerInstaller" inline-actions class="text-white bg-red">
          You can Install Timely app, do you want?.
          <template v-slot:action>
            <q-btn @click="neverShowAppInstaller" flat color="white" label="Never" />
            <q-btn
              @click="showBannerInstaller = false"
              flat
              color="white"
              label="later"
            />
            <q-btn @click="installApp" flat color="white" label="Yes" />
          </template>
        </q-banner>
      </div>
      <q-tabs class="small-screen-only">
        <q-route-tab @click="resetPersonStore" label="HOME" icon="alarm" to="/" exact />
        <q-route-tab
          @click="resetPersonStore"
          label="Registers"
          icon="assignment"
          to="/registers"
          exact
        />
        <q-route-tab
          @click="resetPersonStore"
          label="dashboard"
          icon="dashboard"
          to="/board"
          exact
        />
        <q-route-tab
          @click="resetPersonStore"
          label="users"
          icon="account_box"
          to="/users"
          exact
        />
      </q-tabs>
    </q-footer>
  </q-layout>
</template>

<script>
let deferredPrompt;
export default {
  name: "MainLayout",
  components: {},

  data() {
    return {
      showBannerInstaller: false,
    };
  },

  mounted() {
    let bannerStatus = this.$q.localStorage.getItem("neverShowAppInstallerBanner");

    if (!bannerStatus) {
      window.addEventListener("beforeinstallprompt", (e) => {
        // Prevent the mini-infobar from appearing on mobile
        e.preventDefault();
        // Stash the event so it can be triggered later.
        deferredPrompt = e;
        // Update UI notify the user they can install the PWA
        this.showBannerInstaller = true;
      });
    }
  },

  methods: {
    resetPersonStore() {
      let person = this.$store.state.warehouse.person;

      if (person != null) {
        this.$store.commit("warehouse/pendingPerson", null);
      }
    },

    installApp() {
      // Hide the app provided install promotion
      this.showBannerInstaller = false;
      // Show the install prompt
      deferredPrompt.prompt();
      // Wait for the user to respond to the prompt
      deferredPrompt.userChoice.then((choiceResult) => {
        if (choiceResult.outcome === "accepted") {
          this.neverShowAppInstaller();
          console.log("User accepted the install prompt");
        } else {
          console.log("User dismissed the install prompt");
        }
      });
    },

    neverShowAppInstaller() {
      this.showBannerInstaller = false;
      this.$q.localStorage.set("neverShowAppInstallerBanner", true);
    },
  },
};
</script>
<style lang="sass">
.q-toolbar
  @media(max-width: $breakpoint-xs-max )
    height: 50px

.q-toolbar__title
  font-size: 30px
  @media (max-width: $breakpoint-xs-max)
    text-align: center

.q-footer
  .q-tab__icon
    font-size: 30px
</style>
