<template>
  <div>
    <v-card v-for="item in data" flat class="pa-3 mb-3 card" @click="openAuction(item._id)">
      <b-row>
        <b-col lg="5">
          <v-img :src="item.photos[0]" aspect-ratio="1" class="grey lighten-2"></v-img>
        </b-col>
        <b-col lg="7">
          <h1>{{ item.title }}</h1>
          <p>{{ limitLength(item.description) }}</p>
          <b-row>
            <b-col>
              <div style="display:block" class="text-muted">
                <span style="font-size: 13px">
                  <i
                    class="material-icons mr-1"
                    style="font-size: 14px; position: relative; top: 2px"
                  >room</i>
                  {{ item.city }}
                </span>
              </div>
            </b-col>
            <b-col>
              <div style="display:block" class="text-muted">
                <span style="font-size: 13px">
                  <i
                    class="material-icons mr-1"
                    style="font-size: 14px; position: relative; top: 2px"
                  >assignment</i>
                  {{ item.category }}
                </span>
              </div>
            </b-col>
            <!--<b-col lg="2" class="pl-0">-->
            <!--<div style="display:block" class="text-muted">-->
            <!--<span style="font-size: 13px">-->
            <!--<i class="material-icons mr-1"-->
            <!--style="font-size: 14px; position: relative; top: 2px">-->
            <!--notifications-->
            <!--</i> {{ item.bids.length }}</span>-->
            <!--</div>-->
            <!--</b-col>-->
          </b-row>
          <v-divider></v-divider>
          <b-row>
            <b-col>
              <div style="display:block">
                <countDown :time="item.time"></countDown>
              </div>
            </b-col>
            <b-col>
              <b-row>
                <b-col>
                  <div style="display:block">
                    <price :price="item.price"></price>
                  </div>
                </b-col>
                <b-col>
                  <div style="display:block" class="mt-2">
                    <span style="font-size: 13px">
                      <i
                        class="material-icons mr-1"
                        style="font-size: 14px; position: relative; top: 2px"
                      >notifications</i>
                      {{ item.bids.length }}
                    </span>
                  </div>
                </b-col>
              </b-row>
            </b-col>
          </b-row>
        </b-col>
      </b-row>
    </v-card>
  </div>
</template>
<script>
import countDown from "../countDownTimer";
import price from "../price";
export default {
  components: {
    countDown,
    price
  },
  props: ["data"],
  methods: {
    hello(data) {
      console.log(data)
    },
    limitLength(data) {
      let length = 85;
      let string = data;
      let trimmedString =
        string.length > length
          ? string.substring(0, length - 3) + "..."
          : string;
      return trimmedString;
    },
    openAuction(id) {
      this.$store.dispatch("generalStore/getSingleAuction", id).then(() => {
        this.$router.push("/auction");
      });
    }
  },
  created() {
    this.$store.dispatch("ownUser/getOwnAuctions");
  }
};
</script>

<style scoped>
.card:hover {
  cursor: pointer;
  border: 1px solid #d1d3d4;
}
h1 {
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Helvetica, Arial,
    sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol";
  font-weight: 400;
  font-size: 20px;
}
</style>
