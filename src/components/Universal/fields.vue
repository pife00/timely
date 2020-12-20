<template>
  <div>
    <q-select
      dark
      borderless
      color="white"
      :options="names"
      v-model="choose"
      label="name"
    />
  </div>
</template>
<script>
export default {
  name: "fields",
  data() {
    return {
      choose: "",
    };
  },

  watch: {
    choose(newValue) {
      this.sendName();
    },
  },

  computed: {
    data: {
      get: function () {
        return this.$store.getters["warehouse/filterByName"];
      },
    },
    names: {
      get: function () {
        return this.data.map((el) => {
          return [el.name];
        });
      },
    },
  },
  methods: {
    sendName() {
      let el = this.data.filter((el) => {
        return el.name == this.choose[0];
      });
      this.$emit("name", el);
    },
  },
};
</script>
