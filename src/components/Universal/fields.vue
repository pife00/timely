<template>
  <div>
    <q-select
      v-if="mode != null"
      :dark="dark"
      borderless
      color="white"
      use-input
      input-debounce="0"
      label="name"
      v-model="choose"
      :options="optionsPeople"
      @filter="filterFn"
      style="width: 250px"
    >
      <template v-slot:no-option>
        <q-item>
          <q-item-section class="text-grey"> No results </q-item-section>
        </q-item>
      </template>
    </q-select>
  </div>
</template>
<script>
export default {
  name: "fields",
  props: ["provisionalName","mode"],
  data() {
    return {
      choose: this.provisionalName ? this.provisionalName : null,
      optionsPeople: null,   
    };
  },

  mounted() {},

  watch: {
    choose(newValue) {
      if (newValue != null) {
        this.sendName();
      }
      if(this.mode == 'user'){
        if(newValue == null){
          this.$emit("name", null);
        }
      }
    },
    provisionalName(newValue){
      this.choose = newValue;
    }
  },
  created() {

  },

  computed: {
    dark:{
      get:function () {
        if(this.mode == 'home'){
          return true
        }
        if(this.mode == 'user'){
          return false
        }
      }
    },
    
    data: {
      get: function () {
        return this.$store.getters["warehouse/filterByName"];
      },
    },
    names: {
      get: function () {
        return this.data.map((el) => {
          return el.name;
        });
      },
    },
  },
  methods: {
    sendName() {
      let el = this.data.filter((el) => {
        return el.name == this.choose;
      });
      this.$emit("name", el);
    },

    filterFn(val, update) {
      if (val === "") {
        update(() => {
          this.optionsPeople = this.names;
        });
        return;
      }

      update(() => {
        const needle = val.toLowerCase();
        this.optionsPeople = this.names.filter(
          (v) => v.toLowerCase().indexOf(needle) > -1
        );
      });
    },
  },
};
</script>
