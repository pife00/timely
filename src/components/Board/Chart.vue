<template>
  <div v-if="dataKit">
    <vue-frappe
      id="test"
      :labels="times"
      title="Activity"
      type="axis-mixed"
      :height="300"
      :colors="['purple', '#ffa3ef', 'grey']"
      :dataSets="this.dataKit"
    >
    </vue-frappe>
  </div>
</template>
<script>
import moment from "moment";
export default {
  name: "chart",
  props: ["today"],
  data() {
    return {
    };
  },
  computed: {
    todayComputed: {
      get: function () {
        return this.today;
      },
    },

    dataKit: {
      get: function () {
        if (this.todayComputed != null) {
          return this.kit();
        }
      },
    },

    inCome:{
      get: function () {
        if(this.todayComputed){
          return this.kitCategory('In come','earn')
        }
      }
    },
    pending:{
      get: function () {
        if(this.todayComputed){
          return this.kitCategory('Pending','earn')
        }
      }
    },
    debt:{
      get: function () {
        if(this.todayComputed){
          return this.kitCategory('Debt','earn')
        }
      }
    },
    times:{
      get: function () {
        if(this.todayComputed){
          return this.kitTimes();
        }
      }
    }
  },
  methods: {
    kit() {

      return [
        {
          name: "In come",
          chartType: "bar",
          values: [...this.inCome],
        },
        {
          name: "Pending",
          chartType: "bar",
          values: [...this.pending],
        },
        {
          name: "Debt",
          chartType: "bar",
          values: [...this.debt],
        },
      ];
    },

    kitCategory(category,value){
      return this.todayComputed.map(el=>{
        if(el.category == category){
          return el[value];
        }else{
          return 0;
        }
      })
    },
    kitTimes(){
      return this.todayComputed.map(el=>{
        return moment(el.time_start).format("LT") +' | '+el.name;
      });
    }
  },
};
</script>
