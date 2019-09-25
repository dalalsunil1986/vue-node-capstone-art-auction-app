<template>
  <div>
    <v-card flat class="p-3">
      <b-row>
        <b-col lg="12" class="text-center">
          <div>
            <div style="width: 100%;">
              <img :src="user.picture" style="width: 100%; height: 100%" alt="avatar" />
            </div>
          </div>
        </b-col>
        <b-col lg="12" class="mt-2">
          <span v-if="!chat" class="float-right mt-1 bt" @click="message = !message">
            <i class="material-icons" style="font-size: 17px; opacity: 0.7">email</i>
          </span>
          <h1 class="mt-0 mb-0">{{ user.username }}</h1>
          <ratingComponent :rating="user.rating"></ratingComponent>
          <p style="opacity: 0.8" class="mt-1">{{ user.description }}</p>
          <v-divider></v-divider>
          <b-row>
            <b-col>
              <div class="text-center bt" @click="emitProfileStatus('active')">
                <h2 class="mb-0" style="font-size: 21px">{{ activeAuctions.length }}</h2>
                <span style="opacity: 0.7; font-size: 12px">Listings</span>
              </div>
            </b-col>
            <b-col>
              <div class="text-center bt" @click="emitProfileStatus('sales')">
                <h2 class="mb-0" style="font-size: 21px">{{ user.sales}}</h2>
                <span style="opacity: 0.7; font-size: 12px">Sales</span>
              </div>
            </b-col>
            <b-col>
              <div class="text-center bt" @click="emitProfileStatus('reviews')">
                <h2 class="mb-0" style="font-size: 21px">{{ user.reviews }}</h2>
                <span style="opacity: 0.7; font-size: 12px">Reviews</span>
              </div>
            </b-col>
          </b-row>
        </b-col>
      </b-row>
    </v-card>
    <v-card flat class="mt-3 p-3" v-if="message">
      <v-textarea
        name="description"
        label="Description"
        counter="500"
        v-model="messageText"
        :rules="rules"
        required
        outline
        background-color="#d8d8d8"
        color="#3ba776"
      ></v-textarea>
      <v-btn
        color="#3ba776"
        @click="send"
        style="box-shadow: none;"
        :loading="loading"
        large
        dark
        block
      >
        Send
        <span slot="loader" class="custom-loader">
          <v-icon light>cached</v-icon>
        </span>
      </v-btn>
    </v-card>
    <!--<messageDialog @toggler="changeToggle" :toggle="message"></messageDialog>-->
  </div>
</template>
<script>
import ratingComponent from "./rating_component";
import { Bus } from "../../main";
import messageDialog from "./message_dialog";
export default {
  data() {
    return {
      message: false,
      messageText: "",
      rules: []
    };
  },
  components: {
    ratingComponent,
    messageDialog
  },
  methods: {
    emitProfileStatus(status) {
      if (status === "reviews") {
        this.$store.dispatch("otherUser/getOtherUserReviews", this.user.userId);
      }
      return Bus.$emit("profileStatus", status);
    },
    send() {
      if (this.messageText.length > 0 && this.messageText.length < 500) {
        return this.$store
          .dispatch("messagesStore/sendMessage", this.messageText)
          .then(() => {
            this.rules = [];
            this.messageText = "";
            return (this.message = false);
          });
      } else {
        return (this.rules = [
          v => v.length < 500 || "Message content too long",
          v => v.length > 0 || "The message content too short"
        ]);
      }
    }
  },
  props: ["chat"],
  computed: {
    user() {
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
h1 {
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Helvetica, Arial,
    sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol";
  font-weight: 400;
  font-size: 20px;
}
.bt {
  cursor: pointer;
}
#uploadWrapper input[type="file"] {
  font-size: 30px;
  position: absolute;
  left: 0;
  top: 0;
  opacity: 0;
}
.custom-loader {
  animation: loader 1s infinite;
  display: flex;
}
@-moz-keyframes loader {
  from {
    transform: rotate(0);
  }
  to {
    transform: rotate(360deg);
  }
}
@-webkit-keyframes loader {
  from {
    transform: rotate(0);
  }
  to {
    transform: rotate(360deg);
  }
}
@-o-keyframes loader {
  from {
    transform: rotate(0);
  }
  to {
    transform: rotate(360deg);
  }
}
@keyframes loader {
  from {
    transform: rotate(0);
  }
  to {
    transform: rotate(360deg);
  }
}
</style>
