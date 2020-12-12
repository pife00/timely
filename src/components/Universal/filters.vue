<template>
  <div class="constrain q-pl-lg">
    <div class="row justify-between">
        <q-select
        v-model="choosePerson"
        color="purple"
        use-input
        input-debounce="0"
        label="Search"
        :options="optionsPeople"
        @filter="filterFn"
        style="width: 250px"
      >
        <template v-slot:no-option>
          <q-item>
            <q-item-section class="text-grey">
              No results
            </q-item-section>
          </q-item>
        </template>
      </q-select>
      <q-select borderless v-model="choose" :options="options" />
    </div>
  </div>
</template>
<script>
export default {
  name: "filters",
  props:{
    names:Array,
  },
  data() {
    return {
      options: ["Today", "Yesterday", "Rest"],
      choose: "Today",
      choosePerson:null,
      optionsPeople:null,
    };
  },

  watch: {
    choosePerson(newValue){
      if(newValue != ''){
        this.$store.commit('warehouse/pendingPerson',newValue);
      }
    }
  },

  created() {
    this.optionsPeople = this.people;
  },
  computed: {
    people:{
      get:function(){
        return this.names
      },
      set:function(){
        
      }
    },
  },

   methods: {
    filterFn (val, update) {
      if (val === '') {
        update(() => {
          this.optionsPeople = this.people
        })
        return
      }

      update(() => {
        const needle = val.toLowerCase()
        this.optionsPeople = this.people.filter(v => v.toLowerCase().indexOf(needle) > -1)
      })
    },
    
  }
};
</script>
