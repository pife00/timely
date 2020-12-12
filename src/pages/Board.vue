<template>
  <div>
    <div class="q-pt-md">
      <div class="constrain">
        <div class="row">
          <card title="Salary" :value="salary" ></card>
          <card title="Minutes" :value="minutes" ></card>
          <card title="Pending" :value="pending" ></card>
          <card title="Debt" :value="debt" ></card>
        </div>
        <hr />
        <chart></chart>
      </div>
    </div>
  </div>
</template>
<script>
import Card from "src/components/Board/Card.vue";
import Chart from 'src/components/Board/Chart.vue';

export default {
  components: { Card, Chart },
  name: "board",
  data() {
    return {
      
    }
  },

   computed: {
    reg:{
      get:function(){
        return this.$store.state.warehouse.registers
      },
      set:function(){

      }
    },
    salary:{
      get:function(){
        return this.sumAll('earn',this.reg,'In come')
      },
      set:function(){

      }
    },
    minutes:{
      get:function(){
        return this.sumAll('minutes',this.reg,'In come')
      },
      set:function(){

      }
    },
    pending:{
      get:function(){
        return this.sumAll('minutes',this.reg,'Pending')
      },
      set:function(){

      }
    },
    debt:{
      get:function(){
        return this.sumAll('earn',this.reg,'Debt')
      },
      set:function(){

      }
    }
  },
  methods: {
    sumAll(field,array,category){
      let filter = array.filter(el=>{
        return el.category == category
      });

      return filter.reduce((acc,cur)=>{
        return acc + cur[field];
      },0);
    }
  },
};
</script>
