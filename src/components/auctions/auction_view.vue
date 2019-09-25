<template>
  <div>
    <v-card flat class="pa-2">
      <b-row v-if="user.Id !== auction.userId">
        <b-col cols="2" class="text-center pr-0">
          <v-avatar size="40px" color="grey lighten-4">
            <img :src="auctionOwner.picture" alt="avatar" />
          </v-avatar>
        </b-col>
        <b-col cols="10" class="pl-0">
          <div @click="addToFavorites" v-if="auction.active" class="mt-2 mr-2">
            <i
              class="material-icons text-muted float-right"
              v-if="icon"
              style="font-size: 30px; cursor: pointer"
            >visibility</i>
            <i
              class="material-icons text-muted float-right"
              v-else
              style="font-size: 30px; cursor: pointer"
            >visibility_off</i>
          </div>
          <div @click="toUserProfile(auction.userId)" style="max-width: 200px">
            <h1 class="mb-0 ml-1 userName">{{ auctionOwner.username }}</h1>
            <ratingComponent class="ml-1" :rating="auctionOwner.rating"></ratingComponent>
          </div>
        </b-col>
      </b-row>
      <b-row v-else>
        <b-col cols="2" class="text-center pr-0">
          <v-avatar size="40px" color="grey lighten-4">
            <img :src="user.picture" alt="avatar" />
          </v-avatar>
        </b-col>
        <b-col cols="10" class="pl-0">
          <div @click="toOwnProfile" style="max-width: 200px">
            <h1 class="mb-0 ml-1 userName" @click="toOwnProfile">{{ user.username }}</h1>
            <ratingComponent class="ml-1" :rating="user.rating"></ratingComponent>
          </div>
        </b-col>
      </b-row>
    </v-card>
    <v-card flat>
      <div style="width: 100%">
        <v-carousel>
          <v-carousel-item v-for="(item,i) in auction.photos" :key="i" :src="item"></v-carousel-item>
        </v-carousel>
      </div>
      <v-card flat class="p-3">
        <h1 id="cardTitle">{{ auction.title }}</h1>
        <p>{{ auction.description }}</p>
        <b-row>
          <b-col>
            <div style="display:block" class="text-muted">
              <span style="font-size: 13px">
                <i
                  class="material-icons mr-1"
                  style="font-size: 14px; position: relative; top: 2px"
                >room</i>
                {{ auction.city }}
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
                Category - {{ auction.category }}
              </span>
            </div>
          </b-col>
        </b-row>
        <v-divider></v-divider>
        <b-row>
          <b-col>
            <div style="display:block">
              <countDown :time="auction.time"></countDown>
            </div>
          </b-col>
          <b-col>
            <div style="display:block" class="ml-1">
              <price :price="auction.price"></price>
            </div>
          </b-col>
        </b-row>
        <b-row v-if="user.Id !== auction.userId && auction.active" class="mt-3">
          <b-col>
            <v-text-field
              v-model="price"
              class="mt-1"
              label="Bid"
              required
              outline
              background-color="#f5f5f5"
              color="#3ba776"
              type="number"
              :rules="rule"
            ></v-text-field>
          </b-col>
          <b-col>
            <v-btn
              block
              color="#3ba776"
              style="box-shadow: none;"
              dark
              large
              @click="makeBid"
            >Make Bid</v-btn>
          </b-col>
        </b-row>
        <b-row
          v-if="user.Id === auction.userId && !auction.active && auction.bids.length === 0"
          class="mt-3"
        >
          <b-col>
            <v-btn
              block
              color="#3ba776"
              style="box-shadow: none;"
              dark
              large
              @click="dialog = true"
            >Update</v-btn>
          </b-col>
        </b-row>
      </v-card>
    </v-card>
    <v-dialog v-model="dialog" max-width="290">
      <v-card class="text-center p-3">
        <v-card-text>Once the auction is renewed, it will automatically be set for a maximum of 7 days.</v-card-text>
        <v-card-actions>
          <v-btn color="#3ba776" @click="renewPost(auction._id)" flat="flat">Update</v-btn>
          <v-spacer></v-spacer>
          <v-btn color="#3ba776" flat="flat" @click="dialog = false">Cancel</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>
<script>
import ratingComponent from "../user_profile/rating_component";
import countDown from "../countDownTimer";
import price from "../price";
import { Bus } from "../../main";
export default {
  components: {
    ratingComponent,
    countDown,
    price
  },
  data() {
    return {
      dialog: false,
      rating: 3,
      icon: true,
      price: 0,
      rule: []
    };
  },
  computed: {
    auction() {
      return this.$store.state.generalStore.singleAuction.auction;
    },
    auctionOwner() {
      return this.$store.state.generalStore.singleAuction.user;
    },
    user() {
      return this.$store.state.ownUser.user;
    }
  },
  methods: {
    toOwnProfile() {
      this.$router.push("/profile");
    },
    toUserProfile(to) {
      this.$router.push(`/user/${to}`);
    },
    addToFavorites() {
      if (this.icon) {
        this.$store
          .dispatch("ownUser/addWatching", { postId: this.auction._id })
          .then(() => {
            return (this.icon = !this.icon);
          });
      } else {
        this.$store
          .dispatch("ownUser/removeWatching", { postId: this.auction._id })
          .then(() => {
            return (this.icon = !this.icon);
          });
      }
    },
    makeBid() {
      if (this.price > this.auction.price) {
        return this.$store
          .dispatch("generalStore/makeBid", {
            price: this.price,
            postId: this.auction._id
          })
          .then(() => {
            this.rule = [];
            return (this.price = 0);
          });
      } else {
        return (this.rule = [
          v =>
            this.price > this.auction.price ||
            "The bid must be higher than the current auction price"
        ]);
      }
    },
    renewPost(postId) {
      return this.$store.dispatch("ownUser/renewPost", postId).then(() => {
        this.$router.push("/profile");
      });
    }
  },
  created() {
    if (this.auction.active) {
      Bus.$emit("enterAuctionRoom", this.auction._id);
    }
    if (this.auction.userId !== this.user.Id) {
      this.$store.dispatch("otherUser/getOtherUser", this.auction.userId);
    }
    this.user.watching.find(element => {
      if (element === this.auction._id) {
        return (this.icon = false);
      }
    });
  },
  destroyed: function() {
    if (this.auction.active) {
      Bus.$emit("leaveAuctionRoom", this.auction._id);
    }
  }
};
</script>
<style scoped>
.userName {
  cursor: pointer;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Helvetica, Arial,
    sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol";
  font-weight: 400;
  font-size: 17px;
}
#cardTitle {
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Helvetica, Arial,
    sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol";
  font-weight: 400;
  font-size: 25px;
}
</style>
