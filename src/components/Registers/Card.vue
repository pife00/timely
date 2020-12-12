<template>
  <div class="constrain">
    <div v-if="!edit" class="q-pa-md">
      <q-card class="my-card q-pa-md">
        <q-card-section>
          <div class="row">
            <div class="col-12">
              <div v-if="mode == 'pending'" class="text-center large-screen-only">
                <q-btn
                  @click="chooseRegister(articule)"
                  flat
                  icon="follow_the_signs"
                  size="lg"
                  label=""
                />
                <hr />
              </div>
              <div class="text-right small-screen-only">
                <q-btn-dropdown flat class="q-pb-sm" icon="toc">
                  <q-list>
                    <q-item
                      v-if="mode == 'registers'"
                      clickable
                      v-close-popup
                      :to="{ name: 'editMobile', params: { id: articule.id } }"
                    >
                      <q-item-section>
                        <q-item-label>Edit</q-item-label>
                      </q-item-section>
                    </q-item>
                  </q-list>

                  <q-list>
                    <q-item
                      v-if="mode == 'pending'"
                      clickable
                      v-close-popup
                      @click="chooseRegister(articule)"
                    >
                      <q-item-section>
                        <q-item-label>Choose</q-item-label>
                      </q-item-section>
                    </q-item>
                  </q-list>

                  <q-list>
                    <q-item clickable v-close-popup @click="dialogResume(articule)">
                      <q-item-section>
                        <q-item-label>Details</q-item-label>
                      </q-item-section>
                    </q-item>
                  </q-list>

                  <q-list>
                    <q-item
                      v-if="mode == 'registers'"
                      clickable
                      v-close-popup
                      @click="dialog"
                    >
                      <q-item-section>
                        <q-item-label>Delete</q-item-label>
                      </q-item-section>
                    </q-item>
                  </q-list>
                </q-btn-dropdown>
              </div>
            </div>
            <div class="col-2 text-center">
              <p class="text-h6">Name</p>
              <div>
                <small class="text-purple-6 text-subtitle1 text-weight-bold">
                  {{ register.name }}
                </small>
              </div>
              <small class="text-secondary text-subtitle2 text-weight-bold">{{
                register.category
              }}</small>

              <div>
                <small
                  class="text-secondary small-screen-only text-subtitle2 text-weight-bold"
                  >{{ register.time_left }}</small
                >
              </div>
            </div>
            <div class="col-2 text-center large-screen-only">
              <p class="text-h6">Time</p>
              <div>
                <small class="text-purple-6 text-subtitle2 text-weight-bold">
                  {{ register.time_start | datePretty }}</small
                >
              </div>
              <small class="text-purple-6 text-subtitle1 text-weight-bold">{{
                register.time_end | datePretty
              }}</small>
            </div>

            <div class="col-2 text-center large-screen-only">
              <p class="text-h6">Date</p>
              <div>
                <small class="text-purple-6 text-subtitle2 text-weight-bold">{{
                  register.time_start | date
                }}</small>
              </div>
              <div>
                <small class="text-purple-6 text-subtitle1 text-weight-bold">{{
                  register.time_start | dateAgo
                }}</small>
              </div>
            </div>

            <div class="col-10 text-right small-screen-only">
              <p class="text-h6">Date</p>
              <div>
                <small class="text-purple-6 text-subtitle2 text-weight-bold">{{
                  register.time_start | date
                }}</small>
              </div>
              <div>
                <small class="text-purple-6 text-subtitle1 text-weight-bold">{{
                  register.time_start | dateAgo
                }}</small>
              </div>
            </div>

            <div class="col-2 text-center large-screen-only">
              <p class="text-h6">Minutes</p>
              <div>
                <small class="text-purple-6 text-subtitle1 text-weight-bold">{{
                  register.minutes
                }}</small>
              </div>
              <div>
                <small class="text-secondary text-subtitle1 text-weight-bold">{{
                  register.time_left
                }}</small>
              </div>
            </div>
            <div class="col-2 text-center large-screen-only">
              <p class="text-h6">Earn</p>
              <div>
                <small class="text-purple-6 text-subtitle1 text-weight-bold">{{
                  register.earn
                }}</small>
              </div>
              <div>
                <small class="text-purple-6 text-subtitle2 text-weight-bold">{{
                  register.special | discont
                }}</small>
              </div>
            </div>
            <div class="col-2 text-center large-screen-only">
              <p class="text-h6">Actions</p>
              <q-btn
                @click="editRegister"
                class="text-purple-6"
                size="md"
                flat
                icon="edit"
              />
              <q-btn class="text-purple-6" @click="dialog" size="md" flat icon="delete" />
            </div>
          </div>
        </q-card-section>
      </q-card>
    </div>

    <div v-if="edit" class="q-pa-md">
      <q-card class="my-card q-pa-md">
        <q-card-section>
          <div class="row">
            <div class="col-12 text-right small-screen-only"></div>
            <div class="col-2 text-center">
              <p class="text-h6">Name</p>
              <div>
                <q-input
                  color="purple"
                  v-model="articule.name"
                  dense
                  :input-style="{ textAlign: 'center' }"
                />
              </div>
              <q-input
                color="purple"
                v-model="articule.category"
                :input-style="{ textAlign: 'center' }"
                dense
              />
            </div>
            <div class="col-2 text-center large-screen-only">
              <p class="text-h6">Time</p>
              <div>
                <small class="text-purple-6 text-subtitle2 text-weight-bold">
                  {{ articule.time_start | datePretty }}</small
                >
              </div>
              <small class="text-purple-6 text-subtitle1 text-weight-bold">{{
                articule.time_end | datePretty
              }}</small>
            </div>

            <div class="col-2 text-center large-screen-only">
              <p class="text-h6">Date</p>
              <div>
                <small class="text-purple-6 text-subtitle2 text-weight-bold">{{
                  articule.time_start | date
                }}</small>
              </div>
              <div>
                <small class="text-purple-6 text-subtitle1 text-weight-bold">{{
                  articule.time_start | dateAgo
                }}</small>
              </div>
            </div>

            <div class="col-10 text-right small-screen-only">
              <p class="text-h6">Date</p>
              <div>
                <small class="text-purple-6 text-subtitle2 text-weight-bold">{{
                  articule.time_start | date
                }}</small>
              </div>
              <div>
                <small class="text-purple-6 text-subtitle1 text-weight-bold">{{
                  articule.time_start | dateAgo
                }}</small>
              </div>
            </div>

            <div class="col-2 text-center large-screen-only">
              <p class="text-h6">Minutes</p>
              <q-input
                v-model="articule.minutes"
                color="purple"
                dense
                :input-style="{ textAlign: 'center' }"
              />
            </div>
            <div class="col-2 text-center large-screen-only">
              <p class="text-h6">Earn</p>

              <q-input
                v-model="articule.earn"
                color="purple"
                dense
                :input-style="{ textAlign: 'center' }"
              />
            </div>
            <div class="col-2 text-center large-screen-only">
              <p class="text-h6">Actions</p>
              <q-btn
                @click="updateRegister"
                class="text-purple-6"
                size="md"
                flat
                icon="check_circle"
              />
              <q-btn
                @click="edit = false"
                class="text-purple-6"
                size="md"
                flat
                icon="cancel"
              />
            </div>
          </div>
        </q-card-section>
      </q-card>
    </div>
  </div>
</template>
<script>
import moment from "moment";
import { Dialog } from "quasar";
export default {
  props: {
    owner: Number,
    register: Object,
    mode: String,
  },
  name: "card",
  data() {
    return {
      edit: false,
      articule: null,
    };
  },
  created() {
    this.articule = this.dataComputed;
  },
  watch: {
    dataComputed() {
      this.articule = this.dataComputed;
    },
  },

  computed: {
    dataComputed() {
      return {
        id: this.register.id,
        pc: this.register.pc,
        special: this.register.special,
        category: this.register.category,
        time_end: this.register.time_end,
        name: this.register.name,
        mode: this.register.mode,
        time_start: this.register.time_start,
        time_left: this.register.time_left,
        status: this.register.status,
        minutes: this.register.minutes,
        earn: this.register.earn,
        date: this.register.date,
      };
    },
  },
  filters: {
    date(value) {
      if (!value) {
        return "";
      }
      return moment(value).format("LL");
    },
    datePretty(value) {
      if (!value) {
        return "";
      }

      return moment(value).format("LT");
    },
    dateAgo(value) {
      if (!value) {
        return "";
      }
      return moment(value).startOf("minutes").fromNow();
    },

    discont(value) {
      if (!value) {
        return "discount not applied";
      }
      return "discount applied";
    },
  },

  methods: {
    chooseRegister(data) {
      let payload = [{ PC: this.owner }, { data }];
      this.$store.commit("warehouse/personRegistersPending", payload);
      this.$emit("close");
    },

    editRegister() {
      this.edit = true;
    },
    updateRegister() {
      this.articule.minutes = parseInt(this.articule.minutes);
      this.articule.earn = parseInt(this.articule.earn);
      // console.log(this.articule);
      this.$axios
        .post(`${process.env.API}/api/update-time`, this.articule)
        .then((response) => {
          this.$store.commit("warehouse/getRegisters");
          this.edit = false;
          console.log(response.data);
        })
        .catch((error) => {
          console.log(error);
        });
    },
    dialog() {
      this.$q
        .dialog({
          cancel: true,
          title: "Are you sure to delete this?",
          ok: {
            push: true,
            color: "purple",
          },
          cancel: {
            push: true,
            color: "deep-purple-10",
          },
          persistent: true,
        })
        .onOk(() => {
          this.deleteRegister();
        })
        .onCancel(() => {});
    },
    deleteRegister() {
      let id = {
        id: this.articule.id,
      };
      this.$axios
        .post(`${process.env.API}/api/delete-time`, id)
        .then((response) => {
          this.$store.commit("warehouse/getRegisters");
          console.log(response.data);
        })
        .catch((error) => {
          console.log(error);
        });
    },

    dialogResume(data) {
      moment.locale("es-mx");
      let start = moment(data.time_start).format("LLLL");
      let end = moment(data.time_end).format("LLLL");
      this.$q
        .dialog({
          title: "Are you sure?",
          cancel: false,
          ok: {
            push: true,
            color: "purple",
          },
          html: true,
          message: `<p> <b>name:</b> ${data.name}</p>
          <p> <b>PC:</b> ${data.pc}</p>
        <p> <b>earn:</b> ${data.earn}</p> 
        <p> <b>discount:</b> ${data.special}</p>
        <p> <b>minutes:</b> ${data.minutes}</p>
        <p> <b>time_left:</b> ${data.time_left}</p> 
        <p> <b>category:</b> ${data.category}</p>
        <p> <b>time_start:</b> ${start}</p>
        <p> <b>time_end:</b> ${end}</p>`,
          position: "bottom",
        })
        .onOk(() => {})
        .onCancel(() => {})
        .onDismiss(() => {});
    },
  },
};
</script>
