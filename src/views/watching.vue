<template>
  <b-row>
    <b-col lg="3" class="hidden-sm-and-down pr-0">
      <!--<sidebar></sidebar>-->
      <userProfile></userProfile>
    </b-col>
    <b-col lg="6">
      <v-card v-if="watching.length < 1" flat class="p-3">
        <div class="text-center">
          <i class="material-icons text-muted">visibility</i>
          <br />
          <span class="text-muted">There are no monitored auctions</span>
        </div>
      </v-card>
      <auctionPost :data="watching" class="mb-3"></auctionPost>
      <!--<pagination></pagination>-->
    </b-col>
    <b-col lg="3" class="pl-0"></b-col>
  </b-row>
</template>

<script>
import sidebar from "../components/navigation/sidebar";
import auctionPost from "../components/auctions/auction_post";
import pagination from "../components/navigation/pagination";
import userProfile from "../components/user_profile/profile";
export default {
  components: {
    sidebar,
    auctionPost,
    pagination,
    userProfile
  },
  created() {
    this.$store.dispatch("ownUser/getWatching");
  },
  computed: {
    watching() {
      return this.$store.state.ownUser.watching;
    }
  }
};
</script>

<style scoped>
</style>
