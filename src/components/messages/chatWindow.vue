<template>
  <div>
    <v-card flat class="pt-3 pb-3 pl-1">
      <v-btn flat small color="#3ba776" @click="back">
        <v-icon left>navigate_before</v-icon>
        Back
      </v-btn>
      <v-btn
        flat
        v-if="messages.length === 10 || messages.length >= 10"
        small
        color="#3ba776"
        class="float-right"
        @click="getAllMessages"
      >all messages</v-btn>
    </v-card>

    <v-card class="p-1 chatCard" flat style="height: 60vh; overflow: auto">
      <v-card v-for="item in messages" class="pl-3 pr-3" flat>
        <b-row>
          <b-col lg="2" sm="2" cols="3" class="text-center">
            <v-avatar v-if="item.sender === otherUser.username" size="45px" color="grey lighten-4">
              <img :src="otherUser.picture" alt="avatar" />
            </v-avatar>

            <v-avatar v-else size="45px" color="grey lighten-4">
              <img :src="user.picture" alt="avatar" />
            </v-avatar>
          </b-col>

          <b-col lg="10" sm="10" cols="9">
            <small class="text-muted float-right">{{ updateTimer(item.timestamp) }}</small>

            <h1 class="mb-0">{{ item.sender }}</h1>

            <h1 class="mt-1 text-muted">{{ item.message }}</h1>
          </b-col>
        </b-row>

        <v-divider></v-divider>
      </v-card>
    </v-card>

    <v-card flat class="p-3">
      <b-row>
        <b-col lg="12">
          <v-text-field
            label="Message"
            counter="500"
            v-model="messageText"
            required
            color="#3ba776"
            type="text"
            :rules="rules"
            outline
            background-color="#f5f5f5"
          ></v-text-field>
        </b-col>

        <b-col lg="12">
          <v-btn
            color="#3ba776"
            block
            dark
            large
            class="mt-0"
            style="box-shadow: none;"
            @click="sendMessage"
          >
            <i class="material-icons">email</i>
          </v-btn>
        </b-col>
      </b-row>
    </v-card>
  </div>
</template>

<script>
export default {
  data() {
    return {
      messageText: "",
      rules: []
    };
  },
  props: ["conversation"],
  computed: {
    messages() {
      return this.$store.state.messagesStore.messages;
    },
    otherUser() {
      return this.$store.state.otherUser.user;
    },
    loading() {
      return this.$store.state.generalStore.loading;
    },
    user() {
      return this.$store.state.ownUser.user;
    }
  },
  watch: {
    messages() {
      let container = this.$el.querySelector(".chatCard");
      container.scrollTop = container.scrollHeight;
    }
  },
  methods: {
    back() {
      this.$emit("goBack");
    },
    getAllMessages() {
      this.$store.dispatch("messagesStore/getChat", {
        id: this.conversation.convo,
        allMessages: true
      });
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
    sendMessage() {
      if (this.messageText.length > 0 && this.messageText.length < 500) {
        return this.$store
          .dispatch("messagesStore/sendMessage", this.messageText)
          .then(() => {
            this.messageText = "";
            this.rules = [];
            return (this.message = false);
          });
      } else {
        this.rules = [
          v => v.length < 500 || "Message content is too long",
          v => v.length > 0 || "Message content is too short"
        ];
      }
    }
  },
  destroyed: function() {
    this.$store.commit("messagesStore/setCurrentChatId", null);
  }
};
</script>

<style scoped>
h1 {
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Helvetica, Arial,
    sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol";
  font-weight: 400;
  font-size: 15px;
}
/* width */
::-webkit-scrollbar {
  width: 10px;
}
/* Track */
::-webkit-scrollbar-track {
  background: #f1f1f1;
}
/* Handle */
::-webkit-scrollbar-thumb {
  background: #888;
}
/* Handle on hover */
::-webkit-scrollbar-thumb:hover {
  background: #555;
}
</style>
