<template>
  <div class="constrain" v-if="user">
    <h4 class="text-indigo text-center">{{ user[0].name }}</h4>
    <hr />
    <q-tabs flat v-model="tab" inline-label class="bg-white text-indigo shadow-2">
      <q-tab name="foundation" icon="foundation" label="Basic" />
      <q-tab name="In come" icon="monetization_on" label="In come" />
      <q-tab name="Debt" icon="pause" label="Debt" />
      <q-tab name="Pending" icon="pending_actions" label="Pending" />
    </q-tabs>

    <div v-if="tab == 'In come'" v-for="register in inCome" :key="register.id">
      <card mode="registers" :register="register"></card>
    </div>

    <div v-if="tab == 'Debt'" v-for="register in Debt" :key="register.id">
      <card mode="registers" :register="register"></card>
    </div>

    <div v-if="tab == 'Pending'" v-for="register in Pending" :key="register.id">
      <card mode="registers" :register="register"></card>
    </div>
  </div>
</template>
<script>
import Card from "src/components/Registers/Card.vue";

export default {
  components: { Card },
  name: "UserById",
  data() {
    return {
      tab: null,
    };
  },
  computed: {
    user() {
      let id = this.$route.params.id;
      return this.$store.getters["warehouse/UserById"](id);
    },

    inCome() {
      if (this.user != null) {
        return this.filterByCategory(this.user[0].history, "In come");
      }
    },

    Debt() {
      if (this.user != null) {
        return this.filterByCategory(this.user[0].history, "Debt");
      }
    },

    Pending() {
      if (this.user != null) {
        return this.filterByCategory(this.user[0].history, "Pending");
      }
    },
  },
  methods: {
    filterByCategory(data, category) {
      return data.filter((el) => {
        return el.category == category;
      });
    },

    /* sumMinutes(data, category, value) {
      let filter = data.history.filter((el) => {
        return el.category == category;
      });

      let sum = filter.reduce((acc, cur) => {
        return acc + cur[value];
      }, 0);
      return sum;
    },
    localMoney(value) {
      return new Intl.NumberFormat().format(value);
    },*/
  },
};
</script>
