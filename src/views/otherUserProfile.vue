<template>
  <b-row>
    <b-col lg="3" class="pr-0">
      <!--<ownProfile></ownProfile>-->
      <otherUserProfile class="mb-3"></otherUserProfile>
      <!--<sidebar></sidebar>-->
    </b-col>
    <b-col lg="6">
      <reviewOnUser class="mb-3" :otherUser="true" v-if="status === 'reviews'"></reviewOnUser>
      <auctionPost class="mb-3" :data="activeAuctions" v-if="status === 'active'"></auctionPost>
      <soldAuctions :otherUser="true" v-if="status === 'sales'"></soldAuctions>
      <!--<pagination></pagination>-->
    </b-col>

    <b-col lg="3" class="pl-0"></b-col>
  </b-row>
</template>

<script>
import otherUserProfile from "../components/user_profile/otherUserProfile";
import auctionPost from "../components/auctions/auction_post";
import sidebar from "../components/navigation/sidebar";
import reviewOnUser from "../components/user_profile/reviews";
import ownProfile from "../components/user_profile/profile";
import soldAuctions from "../components/user_profile/sold_auctions";
// import auctionView from '../components/auctions/auction_view'
// import pagination from '../components/navigation/pagination'
// import filterSidebar from '../components/navigation/filter'
// import makeReview from '../components/user_profile/makeReview'
// import messages from '../components/messages/messages'
// import chat from '../components/messages/chatWindow'
import { Bus } from "../main";
export default {
  components: {
    otherUserProfile,
    auctionPost,
    sidebar,
    reviewOnUser,
    ownProfile,
    soldAuctions
    // pagination,
    // filterSidebar,
    // makeReview,
    // messages,
    // chat,
    // auctionView,
  },
  props: ["id"],
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
    // changeStatus(status) {
    //     return this.status = status
    // }
  },
  computed: {
    otherUser() {
      return this.$store.state.otherUser.user;
    },
    loading() {
      return this.$store.state.generalStore.loading;
    },
    activeAuctions() {
      return this.$store.state.otherUser.activeAuctions;
    }
  }
};
</script>

<style scoped>
</style>