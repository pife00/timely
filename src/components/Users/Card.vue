<template>
  <div>
    <div class="col-3 q-pa-md">
      <q-card class="my-card custom" bordered>
        <q-card-section>
          <div class="row">
            <div class="text-left col-4">
              <p class="text-indigo text-weight-bold text-h6">Name</p>
              <q-btn
                flat
                to="/registers"
                class="text-body1 text-purple text-weight-bold"
                :to="{ name: 'userById', params: { id: articule.id } }"
              >
                {{ articule.name }}
              </q-btn>
            </div>
            <div class="text-center col-4 text-indigo text-weight-bold">
              <p class="text-indigo text-weight-bold text-h6">Minutes</p>
              <div class="text-green">
                <small class="text-body1 text-weight-bold"> {{ inComeMinutes }} </small>
              </div>
              <div>
                <small class="text-body1 text-purple text-weight-bold">
                  {{ pendingMinutes }}
                </small>
              </div>
              <div class="text-grey">
                <small class="text-body1 text-weight-bold"> {{ debtMinutes }} </small>
              </div>
            </div>
            <div class="text-right col-4 text-indigo text-weight-bold">
              <p class="text-indigo text-weight-bold text-h6">Money</p>
              <div>
                <small class="text-body1 text-secondary text-weight-bold">
                  {{ localMoney(inCome) }}
                </small>
              </div>
              <div>
                <small class="text-body1 text-purple text-weight-bold">
                  {{ localMoney(pending) }}
                </small>
              </div>
              <div>
                <small class="text-body1 text-grey text-weight-bold">
                  {{ localMoney(debt) }}
                </small>
              </div>
            </div>
          </div>
        </q-card-section>
      </q-card>
    </div>
  </div>
</template>
<script>
export default {
  props: ["user"],
  name: "card",
  data() {
    return {};
  },
  computed: {
    articule() {
      return this.user;
    },
    inComeMinutes() {
      return this.sumMinutes(this.articule, "In come", "minutes");
    },
    pendingMinutes() {
      return this.sumMinutes(this.articule, "Pending", "minutes");
    },
    debtMinutes() {
      return this.sumMinutes(this.articule, "Debt", "minutes");
    },

    inCome() {
      return this.sumMinutes(this.articule, "In come", "earn");
    },
    debt() {
      return this.sumMinutes(this.articule, "Debt", "earn");
    },
    pending() {
      return this.sumMinutes(this.articule, "Pending", "earn");
    },
  },
  methods: {
    sumMinutes(data, category, value) {
      let filter = data.history.filter((el) => {
        return el.category == category;
      });

      let sum = filter.reduce((acc, cur) => {
        return acc + cur[value];
      }, 0);
      return sum;
    },
    localMoney(value) {
      return new Intl.NumberFormat().format(value);
    },
  },
};
</script>
