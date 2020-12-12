<template>
  <div class="q-pa-md q-gutter-sm">
    <q-dialog
      v-model="dialog"
      persistent
      :maximized="maximizedToggle"
      transition-show="slide-up"
      transition-hide="slide-down"
    >
      <q-card class="bg-white text-purple">
        <q-bar>
          <q-space />

          <q-btn
            dense
            flat
            icon="minimize"
            @click="maximizedToggle = false"
            :disable="!maximizedToggle"
          >
            <q-tooltip v-if="maximizedToggle" content-class="bg-white text-primary"
              >Minimize</q-tooltip
            >
          </q-btn>
          <q-btn
            dense
            flat
            icon="crop_square"
            @click="maximizedToggle = true"
            :disable="maximizedToggle"
          >
            <q-tooltip v-if="!maximizedToggle" content-class="bg-white text-primary"
              >Maximize</q-tooltip
            >
          </q-btn>
          <q-btn @click="closeDialog" dense flat icon="close" v-close-popup>
            <q-tooltip content-class="bg-white text-primary">Close</q-tooltip>
          </q-btn>
        </q-bar>
        <div class="constrain">
          <q-card-section>
            <div class="text-h6">Pending</div>
          </q-card-section>

          <filters :names="names"></filters>

          <q-card-section class="q-pt-none">
            <div v-for="register in list" :key="register.id">
              <card
                :owner="owner"
                v-on:close="closeDialog"
                mode="pending"
                :register="register"
              ></card>
            </div>
          </q-card-section>
        </div>
      </q-card>
    </q-dialog>
  </div>
</template>
<script>
import { Dialog } from "quasar";
import { mapState, mapGetters } from "vuex";
import filters from "../Universal/filters.vue";
import card from "../Registers/Card";
import state from "src/store/warehouse/state";
export default {
  name: "Pending",
  props: {
    owner: Number,
  },
  components: {
    filters,
    card,
  },
  data() {
    return {
      dialog: true,
      maximizedToggle: true,
      category: ["Pending",'Debt'],
    };
  },

  computed: {
    reg: {
      get: function () {
        return this.$store.getters["warehouse/filterByCategory"](this.category);
      },
      set: function () {},
    },
    names: {
      get: function () {
        return this.namesFilters();
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
  },
  mounted() {},

  methods: {
    closeDialog() {
      this.$store.commit("warehouse/pendingPerson", null);
      this.$emit("closeDialog", false);
    },
    namesFilters() {
      var names = [
        ...new Set(
          this.reg.map((el) => {
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
