<template>
  <b-row>
    <b-col lg="3" class="hidden-sm-and-down pr-0">
      <!--<sidebar></sidebar>-->
      <userProfile></userProfile>
    </b-col>
    <b-col lg="6" class="mb-3">
      <conversations @reload="reload" :key="key" @getChat="getChat" v-if="!chat"></conversations>
      <chat :conversation="conversationId" @goBack="chat = !chat" v-if="chat"></chat>
    </b-col>
    <b-col lg="3" class="pl-0">
      <otherUserProfile :chat="true" v-if="chat"></otherUserProfile>
    </b-col>
  </b-row>
</template>

<script>
import sidebar from "../components/navigation/sidebar";
import conversations from "../components/messages/conversations";
import chat from "../components/messages/chatWindow";
import userProfile from "../components/user_profile/profile";
import otherUserProfile from "../components/user_profile/otherUserProfile";
export default {
  components: {
    sidebar,
    conversations,
    chat,
    userProfile,
    otherUserProfile
  },
  data() {
    return {
      chat: false,
      conversationId: null,
      key: 1
    };
  },
  created() {
    this.$store.dispatch("messagesStore/getConversations");
  },
  methods: {
    getChat(val) {
      this.$store.commit("messagesStore/setCurrentChatId", val.chatWith);
      this.$store
        .dispatch("messagesStore/getChat", {
          id: val.convo,
          allMessages: false
        })
        .then(res => {
          if (res) {
            return this.$store.dispatch("messagesStore/getConversations");
          }
          this.conversationId = val;
          return (this.chat = true);
        });
    },
    reload() {
      return this.$store.dispatch("messagesStore/getConversations");
    }
  }
};
</script>

<style scoped>
</style>