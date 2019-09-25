<template>
  <div>
    <v-card flat>
      <v-list v-if="conversations" two-line>
        <template v-for="(item, index) in conversations">
          <v-list-tile avatar @click="getMessages(item)">
            <v-list-tile-avatar>
              <img :src="item.user.picture" />
            </v-list-tile-avatar>
            <v-list-tile-content>
              <v-list-tile-title v-html="item.user.username"></v-list-tile-title>
              <v-list-tile-sub-title
                v-html=" '<strong>' + item.message.sender + ': </strong>' +  item.message.message"
              ></v-list-tile-sub-title>
            </v-list-tile-content>
            <v-btn
              style="box-shadow: none; outline:none;"
              class="float-right mt-1 mr-3"
              fab
              small
              @click="triggerDelete(item.conversation)"
            >
              <i class="material-icons" style="opacity: 0.5">delete</i>
            </v-btn>
          </v-list-tile>
        </template>
      </v-list>
      <div v-else class="p-3 text-center">
        <i class="material-icons text-muted">email</i>
        <br />
        <span class="text-muted">No new messages</span>
      </div>
      <progress_bar></progress_bar>
    </v-card>
    <v-dialog v-model="dialog" max-width="290">
      <v-card class="text-center p-3">
        <v-card-text>Deleting a conversation will make it impossible to restore it. Are you sure you want to delete it?</v-card-text>

        <v-card-actions>
          <v-btn color="#3ba776" flat="flat" @click="deleteMessage">Delete</v-btn>

          <v-spacer></v-spacer>

          <v-btn color="#3ba776" flat="flat" @click="dialog = false">Cancel</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>


<script>
import progress_bar from "../progress_bar";

export default {
  components: {
    progress_bar
  },
  data() {
    return {
      delete: false,
      dialog: false
    };
  },
  computed: {
    conversations() {
      return this.$store.state.messagesStore.conversations;
    },
    loading() {
      return this.$store.state.generalStore.loading;
    }
  },
  methods: {
    getMessages(val) {
      if (!this.dialog) {
        this.$store.dispatch("otherUser/getOtherUser", val.user._id);
        return this.$emit("getChat", {
          convo: val.conversation,
          chatWith: val.user._id
        });
      }
    },
    triggerDelete(val) {
      this.delete = val;
      this.dialog = true;
    },
    deleteMessage() {
      this.$store
        .dispatch("generalStore/deleteConversation", this.delete)
        .then(() => {
          this.dialog = false;
          return this.$emit("reload");
        });
    }
  }
};
</script>

<style scoped>
h1 {
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Helvetica, Arial,
    sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol";
  font-weight: 400;
  font-size: 17px;
}
</style>
