<template>
  <q-layout view="lHh Lpr lFf">
    <q-header class="bg bg-deep-purple-8" bordered>
      <q-toolbar class="constrain">
      <q-btn @click="resetPersonStore" size="18px" class="large-screen-only" icon="alarm" to="/" />
      <q-separator  color="purple-3" class="large-screen-only" size="1px" vertical spaced />

      <q-toolbar-title class=" q-mr-sm" >Timely</q-toolbar-title>
      <q-btn @click="resetPersonStore" size="18px" class="large-screen-only" icon="assignment" to="/registers" />
      <q-btn @click="resetPersonStore"  size="18px" class="large-screen-only" icon="dashboard" to="/board" />
      </q-toolbar>
    </q-header>

    <q-page-container>
      <keep-alive :include="['PageHome']">
          <router-view />
    </keep-alive>
    </q-page-container>

    <q-footer elevated class="bg bg-deep-purple-8 small-screen-only">
      <q-tabs>
        <q-route-tab @click="resetPersonStore" label="HOME" icon="alarm" to="/" exact />
        <q-route-tab @click="resetPersonStore" label="Registers" icon="assignment" to="/registers" exact />
        <q-route-tab @click="resetPersonStore" label="dashboard" icon="dashboard" to="/board" exact />
      </q-tabs>
    </q-footer>
  </q-layout>
</template>

<script>
export default {
  name: "MainLayout",
  components: {},
  data() {
    return {
       
    };
  },

  methods: {
      resetPersonStore(){
        let person = this.$store.state.warehouse.person;
        
        if(person != null){
          this.$store.commit('warehouse/pendingPerson',null);
        }
         
      }
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
