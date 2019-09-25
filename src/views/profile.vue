<template>
  <b-row>
    <b-col lg="3" class="pr-0">
      <!--<sidebar></sidebar>-->
      <userProfile color="#3ba776" :loading="loading" class="mb-3"></userProfile>
    </b-col>
    <b-col lg="6">
      <uploadAuction
        class="mb-3"
        @changed="changeStatus"
        :loading="loading"
        v-if="status === 'upload'"
      ></uploadAuction>
      <reviewOnUser class="mb-3" v-if="status === 'reviews'"></reviewOnUser>
      <soldAuctions v-if="status === 'sales'"></soldAuctions>
      <auctionPost class="mb-3" :data="userData" v-if="status === 'active'"></auctionPost>
      <!--<pagination></pagination>-->
    </b-col>
    <b-col lg="3" class="pl-0">
      <notifications></notifications>
    </b-col>
  </b-row>
</template>

<script>
import userProfile from "../components/user_profile/profile";
import auctionPost from "../components/auctions/auction_post";
import sidebar from "../components/navigation/sidebar";
import reviewOnUser from "../components/user_profile/reviews";
import uploadAuction from "../components/user_profile/uploadAuction";
import notifications from "../components/user_profile/notifications";
import soldAuctions from "../components/user_profile/sold_auctions";
// import makeReview from '../components/user_profile/makeReview'
// import messages from '../components/messages/messages'
// import chat from '../components/messages/chatWindow'
// import pagination from '../components/navigation/pagination'
// import filterSidebar from '../components/navigation/filter'
// import auctionView from '../components/auctions/auction_view'
import { Bus } from "../main";
export default {
  components: {
    userProfile,
    auctionPost,
    sidebar,
    reviewOnUser,
    uploadAuction,
    notifications,
    soldAuctions
    // auctionView,
    // pagination,
    // filterSidebar,
    // makeReview,
    // messages,
    // chat,
  },
  data() {
    return {
      status: "active"
    };
  },
  created() {
    Bus.$on("profileStatus", status => {
      return (this.status = status);
    });
  },
  methods: {
    changeStatus(status) {
      return (this.status = status);
    }
  },
  computed: {
    userData() {
      return this.$store.state.ownUser.activeAuctions;
    },
    loading() {
      return this.$store.state.generalStore.loading;
    }
  }
};
</script>

<style scoped>
</style>