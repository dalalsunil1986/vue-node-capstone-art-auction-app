<template>
  <v-app style="background-color: #eaeaea">
    <b-container>
      <toolbar v-if="user.loggedIn"></toolbar>
      <router-view class="mt-5">
        <alert v-if="alert"></alert>
      </router-view>
    </b-container>
  </v-app>
</template>
<script>
import alert from "./components/alert/notifications";
import toolbar from "./components/toolbar/toolbar";
import { Bus } from "./main";
import io from "socket.io-client";
export default {
  components: {
    alert,
    toolbar
  },
  data() {
    return {
      socket: io("localhost:8080"),
      socketRoom: null
    };
  },
  created() {
    //BID SOCKET
    Bus.$on("enterAuctionRoom", data => {
      this.socketRoom = data;
      this.socket.emit("enterAuctionRoom", data);
    });
    Bus.$on("leaveAuctionRoom", data => {
      this.socket.emit("leaveAuctionRoom", data);
    });
    this.socket.on("auctionRoomGetBid", bid => {
      if (bid.userId !== this.user.user.Id) {
        return this.$store.dispatch("generalStore/getBidFromSocket", bid);
      }
    });
    //NOTIFICATIONS SOCKET
    this.socket.on("notification", noti => {
      return this.$store
        .dispatch("notificationsStore/pushNewNotification", noti)
        .then(() => {
          this.$store.dispatch("ownUser/getOwnAuctions");
          this.$store.dispatch("ownUser/getOwnSales");
        });
    });
    //USER LOGIN
    Bus.$on("userLoggedIn", data => {
      this.socket.emit("userLoggedIn", data);
    });
    //MESSAGES SOCKET
    this.socket.on("message", data => {
      if (data.from === this.currentChatWith) {
        return this.$store.dispatch(
          "messagesStore/addNewMessage",
          data.message
        );
      } else {
        return this.$store.dispatch(
          "alert/success",
          "You have received a new message"
        );
      }
    });
    //FOR FAST LOGIN
    this.$router.push("/login");
  },
  computed: {
    alert() {
      return this.$store.state.alert.message;
    },
    user() {
      return this.$store.state.ownUser;
    },
    currentChatWith() {
      return this.$store.state.messagesStore.currentChatWith;
    },
    otherUser() {
      return this.$store.state.otherUser;
    }
  },
  watch: {
    //
    // $route (e){
    //     console.log(e)
    // }
  }
};
</script>
