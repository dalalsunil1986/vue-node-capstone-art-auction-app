<template>
  <b-row>
    <b-col lg="3" class="hidden-sm-and-down pr-0">
      <!--<sidebar></sidebar>-->
      <userProfile class="mb-3"></userProfile>
    </b-col>
    <b-col lg="6" class="mb-3">
      <singleAuction></singleAuction>
    </b-col>
    <b-col lg="3" class="pl-0">
      <otherUserProfile v-if="!auction.active && bids.length > 0"></otherUserProfile>
      <v-btn
        v-if="!auction.active && bids.length > 0 && auction.userId === user.Id"
        block
        color="#3ba776"
        class="mt-3"
        style="box-shadow: none;"
        dark
        large
      >Contact buyer</v-btn>
      <v-btn
        v-if="!auction.active && bids.length > 0 && auction.userId !== user.Id"
        block
        color="#3ba776"
        class="mt-3"
        style="box-shadow: none;"
        dark
        large
      >Contact seller</v-btn>
      <v-btn
        v-if="!auction.active && bids.length > 0"
        block
        color="#3ba776"
        class="mt-3"
        @click="reviewDialog = true"
        style="box-shadow: none;"
        dark
        large
      >Write a review</v-btn>
      <bids v-if="auction.active" :data="bids"></bids>
      <v-dialog v-model="reviewDialog" max-width="500">
        <v-card class>
          <v-card-text>
            <makeReview :auction="auction._id" @closeDialog="reviewDialog = false"></makeReview>
          </v-card-text>
        </v-card>
      </v-dialog>
    </b-col>
  </b-row>
</template>

<script>
import sidebar from "../components/navigation/sidebar";
import singleAuction from "../components/auctions/auction_view";
import bids from "../components/auctions/bids_sidebar";
import userProfile from "../components/user_profile/profile";
import makeReview from "../components/user_profile/makeReview";
import otherUserProfile from "../components/user_profile/otherUserProfile";
export default {
  components: {
    sidebar,
    singleAuction,
    bids,
    userProfile,
    otherUserProfile,
    makeReview
  },
  data() {
    return {
      reviewDialog: false
    };
  },
  computed: {
    auction() {
      return this.$store.state.generalStore.singleAuction.auction;
    },
    loading() {
      return this.$store.state.generalStore.loading;
    },
    bids() {
      return this.$store.state.generalStore.singleAuction.auction.bids.reverse();
    },
    user() {
      return this.$store.state.ownUser.user;
    }
  },
  created() {
    if (
      !this.auction.active &&
      this.bids.length > 0 &&
      this.auction.userId === this.user.Id
    ) {
      return this.$store.dispatch(
        "otherUser/getOtherUser",
        this.bids[0].userId
      );
      // console.log('Auction sold')
      // console.log(this.bids[0])
    }
  }
};
</script>

<style scoped>
</style>
