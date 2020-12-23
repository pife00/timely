<template>
  <div>
    <div class="constrain">
      <div class="row">
        <div class="col-4">
          <filters :options="options" :names="names"></filters>
        </div>
        <div class="col-4"></div>
        <div class="col-4 justify-end">
          <q-select v-model="category" :options="categories" label="Category" />
        </div>
      </div>
    </div>
    <div class="col-6 justify-end">
      <dates v-on:date="getDate" :options="options"></dates>
    </div>
    <div v-if="dates" class="constrain row justify-center text-h6 text-indigo">
      {{ prettyTitle(dates)[0] }} - {{ prettyTitle(dates)[1] }}
    </div>
    <div class="constrain">
      <hr />
    </div>
    <div v-for="register in listWithFilters" :key="register.id">
      <card mode="registers" :register="register"></card>
    </div>
  </div>
</template>

<script>
import { openDB } from "idb";
import moment from "moment";
import Card from "src/components/Registers/Card.vue";
import Filters from "src/components/Universal/filters.vue";
import Dates from "src/components/Universal/Dates";
import { Dialog, uid } from "quasar";
export default {
  components: { Card, Filters, Dates },
  name: "PageRegisters",
  data() {
    return {
      options: ["In come", "Debt", "Pending"],
      categories: ["Await", "In come", "Debt", "Pending"],
      filter: "Today",
      dates: null,
      category: "Await",
    };
  },

  activated() {
    this.db();
  },
  mounted() {
    this.listenForOffline();
  },

  computed: {
    Navigator() {
      return navigator.onLine;
    },

    reg: {
      get: function () {
        return this.$store.state.warehouse.registers;
      },
      set: function () {},
    },

    names: {
      get: function () {
        if (this.listWithFilters) {
          return this.namesFilters();
        }
      },
      set: function () {},
    },

    person: {
      get: function () {
        return this.$store.state.warehouse.person;
      },
      set: function () {},
    },

    list: {
      get: function () {
        if (this.person == null) {
          return this.reg;
        } else {
          return this.personFilter();
        }
      },
      set: function () {},
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

    today() {
      if (this.dates != null) {
        let today = this.orderToday(this.list);
        if (this.category != "Await") {
          return today.filter((el) => {
            return el.category == this.category;
          });
        } else {
          return today;
        }
      }
    },
    serviceWorkerSupport() {
      if ("serviceWorker" in navigator) {
        return true;
      } else {
        return false;
      }
    },
  },

  methods: {
    getDate(payload) {
      this.dates = payload;
      if (this.dates == null) {
        this.filter = null;
      } else {
        this.filter = "Today";
      }
    },

    prettyTitle(value) {
      let from = moment(value.startDay).format("dddd Do YYYY");
      let to = moment(value.endToday).format("dddd Do YYYY");

      return [from, to];
    },

    orderToday(array) {
      return array.filter((el) => {
        if (el.date > this.dates.startDay && el.date < this.dates.endToday) {
          return el.date;
        }
      });
    },

    async db() {
      const db = await openDB("workbox-background-sync").then((db) => {
        db.getAll("requests")
          .then((failedRequest) => {
            failedRequest.forEach((fail) => {
              let request = new Request(fail.requestData.url, fail.requestData);

              request
                .formData()
                .then((formData) => {
                  let offlineRegister = {};
                  offlineRegister.id = formData.get("id");
                  offlineRegister.name = formData.get("name");
                  offlineRegister.category = formData.get("category");
                  offlineRegister.date = parseInt(formData.get("date"));

                  offlineRegister.time_start = parseInt(formData.get("time_start"));
                  offlineRegister.time_end = parseInt(formData.get("time_end"));
                  offlineRegister.minutes = parseInt(formData.get("minutes"));
                  offlineRegister.time_left = parseInt(formData.get("time_left"));
                  offlineRegister.earn = formData.get("earn");
                  offlineRegister.off = true;

                  if (!navigator.onLine) {
                    if (this.list.some((id) => id.id == offlineRegister.id)) {
                    } else {
                      this.list.unshift(offlineRegister);
                    }
                  }
                })
                .catch((error) => {
                  console.log(error);
                });
            });
          })
          .catch((error) => {});
      });
    },

    listenForOffline() {
      const channel = new BroadcastChannel("sw-messages");
      channel.addEventListener("message", (event) => {
        if (event.data.msg == "offline post uploaded") {
          console.log("mensaje recibido");
          let postOffline = this.list.filter((post) => post.off == true).length;
          this.list[postOffline - 1].off = false;
        }
      });
    },

    namesFilters() {
      var names = [
        ...new Set(
          this.listWithFilters.map((el) => {
            return el.name;
          })
        ),
      ];
      return names;
    },

    personFilter() {
      return this.reg.filter((el) => {
        return el.name == this.person;
      });
    },
  },
};
</script>
<style lang="sass"></style>
