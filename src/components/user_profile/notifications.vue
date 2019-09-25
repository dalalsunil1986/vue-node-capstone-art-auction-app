<template>
  <div>
    <v-card flat class="pt-1 text-center">
      <i class="material-icons mt-1 mb-2 text-muted" style="font-size: 25px;">notifications</i>
    </v-card>
    <div v-for="item in notifications">
      <v-card
        v-if="item.sold"
        flat
        dark
        @click="openAuction(item.postId)"
        class="text-left p-2 crd mt-2"
        style="background-color: #3ba776"
      >
        <b-row>
          <b-col sm="4" xs="4">
            <v-img aspect-ratio="1" :src="item.postPhoto"></v-img>
          </b-col>
          <b-col sm="6" class="pl-0 pr-0" xs="6">
            <span class="mt-0">
              The auction already ended.
              <small style="color: white">{{ updateTimer(item.time) }}</small>
            </span>
          </b-col>
          <!--<b-col sm="2" class="pl-0 text-center" xs="1">-->
          <!--<i class="material-icons mb-2 mt-4 text-muted;"-->
          <!--@click="click('delete')"-->
          <!--style="font-size: 21px; cursor: pointer; color: white">-->
          <!--highlight_off-->
          <!--</i>-->
          <!--</b-col>-->
        </b-row>
      </v-card>
      <v-card
        v-else-if="!item.sold && item.sellerId"
        flat
        dark
        @click="openAuction(item.postId)"
        class="text-left p-2 crd mt-2"
        style="background-color: #3ba776"
      >
        <b-row>
          <b-col sm="4" xs="4">
            <v-img aspect-ratio="1" :src="item.postPhoto"></v-img>
          </b-col>
          <b-col sm="6" class="pl-0 pr-0" xs="6">
            <span class="mt-0">
              Your bet won the auction.
              <br />
              <small style="color: white">{{ updateTimer(item.time) }}</small>
            </span>
          </b-col>
          <!--<b-col sm="2" class="pl-0 text-center" xs="1">-->
          <!--<i class="material-icons mb-2 mt-4 text-muted;"-->
          <!--@click="click('delete')"-->
          <!--style="font-size: 21px; cursor: pointer; color: white">-->
          <!--highlight_off-->
          <!--</i>-->
          <!--</b-col>-->
        </b-row>
      </v-card>
      <v-card
        v-else-if="!item.sold && !item.sellerId"
        flat
        @click="openAuction(item.postId)"
        class="text-left p-2 crd mt-2"
      >
        <b-row>
          <b-col sm="4" xs="4">
            <v-img aspect-ratio="1" :src="item.postPhoto"></v-img>
          </b-col>
          <b-col sm="6" class="pl-0 pr-0" xs="6">
            <span class="mt-0">
              The auction ended with no offers.
              <br />
              <small class="text-muted">{{ updateTimer(item.time) }}</small>
            </span>
          </b-col>
          <b-col sm="2" class="pl-0 text-center" xs="1">
            <i
              class="material-icons mb-2 mt-4 text-muted"
              @click="deleteModal(item.postId)"
              style="font-size: 21px; cursor: pointer;"
            >highlight_off</i>
          </b-col>
        </b-row>
      </v-card>
    </div>
    <v-dialog v-model="dialog" max-width="290">
      <v-card class="text-center p-3">
        <v-card-text>Deleting this message will also delete the active auction.</v-card-text>
        <v-card-actions>
          <v-btn color="#3ba776" @click="deleteNotification" flat="flat">Ištrinti</v-btn>
          <v-spacer></v-spacer>
          <v-btn color="#3ba776" flat="flat" @click="dialog = false">Atšaukti</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>
<script>
import BRow from "bootstrap-vue/src/components/layout/row";
export default {
  name: "notifications",
  components: { BRow },
  data() {
    return {
      dialog: false,
      currentNoti: null
    };
  },
  methods: {
    openAuction(id) {
      if (!this.dialog) {
        this.$store.dispatch("generalStore/getSingleAuction", id).then(() => {
          this.$router.push("/auction");
        });
      }
    },
    updateTimer(time) {
      let date = new Date(time);
      let options = {
        year: "numeric",
        month: "numeric",
        day: "numeric",
        hour: "numeric",
        minute: "numeric",
        second: "numeric"
      };
      return `${date.toLocaleDateString("lt-LT", options)}`;
    },
    deleteModal(id) {
      this.dialog = true;
      return (this.currentNoti = id);
    },
    deleteNotification() {
      return this.$store
        .dispatch("ownUser/deletePost", this.currentNoti)
        .then(() => {
          return (this.dialog = false);
        });
    }
  },
  computed: {
    notifications() {
      return this.$store.state.notificationsStore.notifications;
    }
  }
};
</script>
<style scoped>
.crd {
  cursor: pointer;
}
.crd:hover {
  background-color: #f5f5f5;
}
</style>
