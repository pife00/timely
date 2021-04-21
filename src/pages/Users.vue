<template>
  <div class="constrain">
    <div class="row">
      <div class="col-4">
        <name v-on:name="getName" mode="user" :names="names"></name>
      </div>
      <div class="col-4 text-center">
        <h1 class="text-h5">USERS DETAILS</h1>
        <q-btn @click="fetchUser" color="purple" label="Click me" />
      </div>
      <div class="col-4">
        <q-select v-model="category" :options="categories" label="Category" />
      </div>
    </div>
    <div class="text-right q-pa-sm text-white">
      <q-btn
        @click="dialogUser = true"
        size="md"
        label="Add User"
        class="bg-purple"
        flat
        icon="add"
      />
    </div>
    <add-user v-if="dialogUser" v-on:close="closeUserDialog"></add-user>
    <div v-for="user in list" :key="user.id" class="col">
      <card :user="user"></card>
    </div>
  </div>
</template>
<script>
import { Dialog } from "quasar";
import card from "../components/Users/Card";
import addUser from "../components/Universal/AddUser";
import name from "src/components/Universal/fields";
import filters from "../components/Universal/filters";
export default {
  name: "users",
  components: {
    filters,
    card,
    addUser,
    name,
  },

  data() {
    return {
      nameChoose: null,
      idUser: null,
      dialogUser: false,
      category: "Alphabet",
      categories: ["Alphabet", "In come", "Debt", "Pending"],
    };
  },

  mounted() {
   // this.$store.commit("warehouse/getUsersDetails");
  },

  watch: {
    users(val){
      if(val.length > 0){
         this.$q.loading.hide()
      }
    }
  },

  computed: {
    listCategory: {
      get: function () {
        return this.valueRaw();
      },
      set: function () {},
    },

    order: {
      get: function () {
        if (this.category == "Alphabet") {
          let el = this.listCategory.sort(function (a, b) {
            return a.name.localeCompare(b.name);
          });
          return el;
        }
        if (this.category == "In come") {
          return this.listCategory.sort(function (a, b) {
            return b.inCome - a.inCome;
          });
        }

        if (this.category == "Pending") {
          return this.listCategory.sort(function (a, b) {
            return b.pending - a.pending;
          });
        }

        if (this.category == "Debt") {
          return this.listCategory.sort(function (a, b) {
            return b.debt - a.debt;
          });
        }
      },
      set: function () {},
    },

    users: {
      get: function () {
        return this.$store.state.warehouse.usersDetails;
      },
      set: function () {},
    },
    names: {
      get: function () {
        return this.namesFilters();
      },
      set: function () {},
    },
    list: {
      get: function () {
        if (this.nameChoose != null) {
          return this.filterByPerson(this.nameChoose);
        } else {
          return this.order;
        }
      },
      set: function () {},
    },
  },
  methods: {
    valueRaw() {
      let people = this.users.map((el) => {
        return {
          id: el.id,
          name: el.name,
          inCome: sum(el.history, "In come", "earn"),
          debt: sum(el.history, "Debt", "earn"),
          pending: sum(el.history, "Pending", "earn"),
          inComeMinutes: sum(el.history, "In come", "minutes"),
          pendingMinutes: sum(el.history, "Pending", "minutes"),
          debtMinutes: sum(el.history, "Debt", "minutes"),
        };
      });
      function sum(array, filter, value) {
        let el = array.filter((el) => {
          return el.category == filter;
        });
        return el.reduce((acc, cur) => {
          return acc + cur[value];
        }, 0);
      }
      return people;
    },

    fetchUser() {
      this.$q.loading.show({
        delay: 400, // ms
        message:'loading a lot of people'
      });
      this.$store.commit("warehouse/getUsersDetails")
    },

    filterByPerson(payload) {
      return this.order.filter((el) => {
        return el.name == payload;
      });
    },

    getName(payload) {
      console.log(payload);
      if (payload != null) {
        this.nameChoose = payload[0].name;
        this.idUser = payload[0].id;
      }
      if (payload == null) {
        this.nameChoose = null;
      }
    },

    addUser() {
      this.dialogUser = true;
    },
    closeUserDialog() {
      this.dialogUser = false;
    },

    namesFilters() {
      var names = [
        ...new Set(
          this.users.map((el) => {
            return el.name;
          })
        ),
      ];
      return names;
    },
  },
};
</script>
