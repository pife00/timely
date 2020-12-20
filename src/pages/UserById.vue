<template>
  <div class="constrain" v-if="user">
    <h4 class="text-indigo text-center">{{ user[0].name }}</h4>
    <div class="row" v-if="tab == 'In come'">
      <div class="col-6">
        <resume title="In come" :value="inComeEarn"></resume>
      </div>
      <div class="col-6">
        <resume title="Minutes" :value="inComeMinutes"></resume>
      </div>
    </div>

    <div class="row" v-if="tab == 'Debt'">
      <div class="col-6">
        <resume title="Debt" :value="debtEarn"></resume>
      </div>
      <div class="col-6">
        <resume title="Minutes" :value="debtMinutes"></resume>
      </div>
    </div>

    <div class="row" v-if="tab == 'Pending'">
      <div class="col-6">
        <resume title="Pending" :value="pendingEarn"></resume>
      </div>
      <div class="col-6">
        <resume title="Minutes" :value="pendingMinutes"></resume>
      </div>
    </div>
    <hr />
    <q-tabs flat v-model="tab" inline-label class="bg-white text-indigo shadow-2">
      <q-tab name="foundation" icon="foundation" label="Basic" />
      <q-tab name="In come" icon="monetization_on" label="In come" />
      <q-tab name="Debt" icon="pause" label="Debt" />
      <q-tab name="Pending" icon="pending_actions" label="Pending" />
    </q-tabs>

    <div v-if="tab == 'In come'" v-for="register in inCome" :key="register.id">
      <card mode="registers" :register="register"></card>
    </div>

    <div v-if="tab == 'Debt'" v-for="register in Debt" :key="register.id">
      <card mode="registers" :register="register"></card>
    </div>

    <div v-if="tab == 'Pending'" v-for="register in Pending" :key="register.id">
      <card mode="registers" :register="register"></card>
    </div>

    <div class="row">
      <div class="col-3"></div>
      <div class="col-6 justify-center q-pa-md" v-if="tab == 'foundation'">
        <q-card>
          <q-card-section>
            <div class="text-h5 text-center text-purple">Edit User</div>
          </q-card-section>
          <q-card-section>
            <div class="text-center text-purple">
              <q-icon name="account_box" size="8rem" />
            </div>
            <div v-if="error" class="text-center text-indigo text-weight-bold">
              <p>{{ error }}</p>
            </div>
          </q-card-section>
          <q-card-section class="q-pt-none">
            <q-input v-model="editUser.name" color="indigo" label="name" />
            <q-input v-model="editUser.nickname" color="indigo" label="nickname" />
          </q-card-section>

          <q-card-actions align="center" class="bg-white text-teal">
            <q-btn color="indigo" flat label="Cancel" />
            <q-btn @click="sendUpdateUser" color="purple" flat label="Update" />
          </q-card-actions>
        </q-card>
      </div>
      <div class="col-3"></div>
    </div>
  </div>
</template>
<script>
import Card from "src/components/Registers/Card.vue";
import resume from "src/components/Board/Card";
export default {
  components: { Card, resume },
  name: "UserById",
  data() {
    return {
      tab: "In come",
      dialogUser: true,
      error: null,
      editUser: {
        name: null,
        nickname: null,
      },
    };
  },
  mounted() {
    this.editUser.name = this.user[0].name;
    this.editUser.nickname = this.user[0].nickname;
  },

  computed: {
    user() {
      let id = this.$route.params.id;
      return this.$store.getters["warehouse/UserById"](id);
    },

    inCome() {
      if (this.user != null) {
        return this.filterByCategory(this.user[0].history, "In come");
      }
    },

    Debt() {
      if (this.user != null) {
        return this.filterByCategory(this.user[0].history, "Debt");
      }
    },

    Pending() {
      if (this.user != null) {
        return this.filterByCategory(this.user[0].history, "Pending");
      }
    },

    inComeMinutes() {
      return this.localTime(this.sumMinutes(this.user[0], "In come", "minutes"));
    },
    pendingMinutes() {
      return this.localTime(this.sumMinutes(this.user[0], "Pending", "minutes"));
    },
    debtMinutes() {
      return this.localTime(this.sumMinutes(this.user[0], "Debt", "minutes"));
    },

    inComeEarn() {
      return this.localMoney(this.sumMinutes(this.user[0], "In come", "earn"));
    },
    debtEarn() {
      return this.localMoney(this.sumMinutes(this.user[0], "Debt", "earn"));
    },
    pendingEarn() {
      return this.localMoney(this.sumMinutes(this.user[0], "Pending", "earn"));
    },
  },
  methods: {
    filterByCategory(data, category) {
      return data.filter((el) => {
        return el.category == category;
      });
    },

    sendUpdateUser() {
      let formData = new FormData();
      formData.append("id", this.user[0].id);
      formData.append("name", this.editUser.name);
      formData.append("nickname", this.editUser.nickName);
      this.$axios
        .post(`${process.env.API}/api/update-user`, formData)
        .then((response) => {
          if (response.data.error) {
            this.error = response.data.error;
          }
          if (response.data == "created") {
            this.$store.commit("warehouse/getUsers");
          }
        })
        .catch((error) => {
          console.log(error);
        });
    },

    sumMinutes(data, category, value) {
      let filter = data.history.filter((el) => {
        return el.category == category;
      });

      let sum = filter.reduce((acc, cur) => {
        return acc + cur[value];
      }, 0);
      return sum;
    },

    localTime(value) {
      let hour = value / 60;
      let restHour = Math.floor(hour);
      let minutes = Math.round((hour - restHour) * 60);
      let local = restHour + ":" + minutes;
      return local;
    },
    localMoney(value) {
      return new Intl.NumberFormat().format(value);
    },
  },
};
</script>
