<template>
  <div class="col">
    <q-dialog v-model="dialogUser" persistent>
      <q-card>
        <q-card-section style="width: 300px">
          <div class="text-h6 text-center text-purple">Add User</div>
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
          <q-input v-model="user.name" color="indigo" label="name" />
          <q-input v-model="user.nickName" color="indigo" label="nickname" />
        </q-card-section>

        <q-card-actions align="right" class="bg-white text-teal">
          <q-btn @click="closeDialog" color="indigo" flat label="Cancel" v-close-popup />
          <q-btn @click="sendNewUser" color="purple" flat label="Add" />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </div>
</template>
<script>
import { uid } from "quasar";
import fields from "./fields";
export default {
  name: "add-user",
  data() {
    return {
      dialogUser: true,
      error: null,
      user: {
        name: null,
        nickName: null,
      },
    };
  },
  methods: {
    closeDialog() {
      this.$emit("close");
    },

    sendNewUser() {
      let formData = new FormData();
      formData.append("id", uid());
      formData.append("name", this.user.name);
      formData.append("nickname", this.user.nickName);
      this.$axios
        .post(`${process.env.API}/api/new-user`, formData)
        .then((response) => {
          if (response.data.error) {
            this.error = response.data.error;
          }
          if (response.data == "created") {
            this.$store.commit("warehouse/getUsers");
            this.closeDialog();
          }
        })
        .catch((error) => {
          console.log(error);
        });
    },
  },
};
</script>
