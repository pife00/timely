<template>
  <div class="constrain">
    <filters></filters>
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
    <div v-for="user in users" :key="user.id" class="col">
      <card :user="user"></card>
    </div>
  </div>
</template>
<script>
import { Dialog } from "quasar";
import card from "../components/Users/Card";
import addUser from "../components/Universal/AddUser";
import filters from "../components/Universal/filters";
export default {
  name: "users",
  components: {
    filters,
    card,
    addUser,
  },

  data() {
    return {
      dialogUser: false,
    };
  },
  computed: {
    users: {
      get: function () {
        return this.$store.state.warehouse.users;
      },
      set: function () {},
    },
  },
  methods: {
    addUser() {
      this.dialogUser = true;
    },
    closeUserDialog() {
      this.dialogUser = false;
    },
  },
};
</script>
