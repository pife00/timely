<template>
  <div class="col">
    <div class="col-3 q-pa-md">
      <q-card class="my-card custom" bordered>
        <q-card-section>
          <div class="text-purple text-center q-gutter-md" style="font-size: 5em">
            <q-icon :name="icon" />
          </div>
          <div class="text-center">
            <small class="text-h6 text-purple"> {{ title }} </small>
          </div>
          <div class="text-center">
            <small class="text-subtitle2 text-indigo-2">From Now</small>
          </div>

          <div class="text-center">
            <small class="text-subtitle2 text-indigo"> {{ value }} </small>
          </div>
        </q-card-section>
      </q-card>
    </div>
  </div>
</template>
<script>
export default {
  props: ["title", "value"],
  computed: {
    icon() {
      switch (this.title) {
        case "Salary":
          return "local_atm";
          break;
        case "Minutes":
          return "timer";
          break;
        case "Debt":
          return "pause";
          break;
        case "In come":
          return "monetization_on";
          break;
        case "Debt":
          return "pause";
          break;
        case "Pending":
          return "pending_actions";
          break;
      }
    },
  },
};
</script>
<style lang="sass"></style>
