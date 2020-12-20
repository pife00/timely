<template>
  <div>
    <div class="constrain q-pl-sm q-pr-sm">
      <div>
        <small class="text-h6 text-purple-6">Name</small>
        <q-input v-model="articule[0].name" label="Name" />
      </div>
      <div class="q-pt-sm">
        <small class="text-h6 text-purple-6">Time</small>
      </div>
      <div class="row">
        <q-input disable v-model="articule[0].time_start" label="time-start" />
        <q-input disable v-model="articule[0].time_end" label="time-end" />
      </div>

      <q-input disable v-model="articule[0].time_start" label="Date" />

      <div class="q-pt-sm">
        <small class="text-h6 text-purple-6">Minutes</small>
      </div>
      <div class="row">
        <q-input v-model="articule[0].minutes" label="Quantity" />
        <q-input v-model="articule[0].earn" label="Earn" />
      </div>
      <div class="q-gutter-sm q-pa-sm">
        <q-btn @click="updateRegister" color="purple" class="full-width" label="Edit" />
        <q-btn @click="cancel" color="purple-10" class="full-width" label="Cancel" />
      </div>
    </div>
  </div>
</template>
<script>
import { mapGetters } from "vuex";
export default {
  name: "editMobile",
  data() {
    return {
      id: this.$route.params.id,
    };
  },

  computed: {
    articule() {
      return this.$store.getters["warehouse/filterById"](this.id);
    },
  },
  methods: {
    updateRegister() {
      let data = this.articule[0];
      let formData = new FormData();

      formData.append("id", data.id);
      formData.append("special", data.special);
      formData.append("mode", data.mode);
      formData.append("pc", data.pc);
      formData.append("name", data.name);
      formData.append("date", data.date);
      formData.append("time_start", data.time_start);
      formData.append("time_end", data.time_end);
      formData.append("minutes", data.minutes);
      formData.append("earn", data.earn);
      formData.append("category", data.category);
      formData.append("time_left", data.time_left);
      formData.append("status", data.status);
      formData.append("money_minutes", data.money_minutes);

      this.$axios
        .post(`${process.env.API}/api/update-time`, formData)
        .then((response) => {
          console.log(response.data);
          this.$store.commit("warehouse/getRegisters");
          this.edit = false;
          this.$router.go(-1);
          console.log(response.data);
        })
        .catch((error) => {
          console.log(error);
        });
    },
    cancel() {
      this.$router.go(-1);
    },
  },
};
</script>
