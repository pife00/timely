<template>
  <div>
    
      <div class="col-6 q-mt-md">
        <filters :names="names" ></filters>
     
    </div>
    <div v-for="register in list" :key="register.id">
      <card mode='registers' :register="register"></card>
    </div>
  </div>
</template>

<script>
import Card from "src/components/Registers/Card.vue";
import Filters from "src/components/Universal/filters.vue";
import { Dialog } from "quasar";
export default {
  components: { Card, Filters },
  name: "PageRegisters",
  data() {
    return {
      
    };
  },

  computed: {

    reg:{
      get:function(){
        return this.$store.state.warehouse.registers
      },
      set:function(){

      }
    },

    names:{
        get:function(){
           return this.namesFilters()
      },
      set:function(){
      }
    },

    person:{
      get:function(){
        return this.$store.state.warehouse.person;
      },
      set:function(){
      }
    },

    list:{
      get:function(){
        if(this.person == null ){
          return this.reg;
        }else{
          return this.personFilter();
        }

      },
      set:function(){

      },
    },

    today(){

    },
    yesterday(){
      
    }
  },

  methods: {
    
    namesFilters(){
         var names = [...new Set(this.reg.map((el) => {
            return el.name;
          })
        ),
      ]; 
      return names
    },

    personFilter(){
      return this.reg.filter(el=>{
        return el.name == this.person
      });
    },

    editar() {
      console.log("editar");
    },
    eliminar() {
      console.log("eliminar");
    },
  },
};
</script>
<style lang="sass"></style>
