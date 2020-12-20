<template>
  <div id="q-app">
    <router-view />
  </div>
</template>
<script>
export default {
  name: "App",
  created() {
    this.$store.commit("warehouse/getRegisters");
    this.$store.commit("warehouse/getUsers");
  },
};
</script>
