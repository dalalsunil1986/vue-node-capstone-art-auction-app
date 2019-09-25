<template>
  <b-row>
    <b-col lg="3" class="pr-0">
      <userProfile></userProfile>
    </b-col>
    <b-col lg="6">
      <auctionPost :data="allAuctions" class="mb-3"></auctionPost>
      <pagination
        v-if="allAuctionsLength > 10"
        :allAuctionsLength="allAuctionsLength"
        @changePage="changePage"
      ></pagination>
    </b-col>
    <b-col lg="3" class="pl-0">
      <dataFilter></dataFilter>
    </b-col>
  </b-row>
</template>

<script>
import sidebar from "../components/navigation/sidebar";
import auctionPost from "../components/auctions/auction_post";
import pagination from "../components/navigation/pagination";
import dataFilter from "../components/navigation/filter";
import userProfile from "../components/user_profile/profile";
export default {
  components: {
    sidebar,
    auctionPost,
    pagination,
    dataFilter,
    userProfile
  },
  created() {
    this.changePage(0);
  },
  computed: {
    allAuctions() {
      return this.$store.state.generalStore.allAuctions;
    },
    allAuctionsLength() {
      return this.$store.state.generalStore.allAuctionsCount;
    }
  },
  methods: {
    changePage(e) {
      this.$store.dispatch("generalStore/getAllAuctions", e);
    }
  }
};
</script>

<style scoped>
</style>