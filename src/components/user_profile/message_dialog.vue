<template>
  <v-dialog v-model="dialog" width="500">
    <v-card>
      <v-card-text>
        <v-textarea
          name="description"
          label="Content of the message"
          counter="500"
          v-model="message"
          :rules="rules"
          required
          color="#3ba776"
        ></v-textarea>
      </v-card-text>
      <v-card-actions>
        <v-btn color="#3ba776" @click="send" block>Siųsti</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
export default {
  props: ["toggle"],
  data() {
    return {
      dialog: false,
      message: "",
      rules: [
        v => v.length < 500 || "Content is too long",
        v => v.length > 0 || "Content is too short"
      ]
    };
  },
  methods: {
    send() {
      if (this.message.length > 0 && this.message.length < 500) {
        return this.$store
          .dispatch("messagesStore/sendMessage", this.message)
          .then(() => {
            return (this.dialog = false);
          });
      }
    }
  },
  watch: {
    toggle(val) {
      return (this.dialog = val);
    },
    dialog(val) {
      this.$emit("toggler", val);
    }
  }
};
</script>

<style scoped>
</style>
