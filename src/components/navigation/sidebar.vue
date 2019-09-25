<template>
  <div style="width: 100%; background-color: white" class="text-left">
    <v-card flat class="p-2 card" @click="changePage('/profile')">
      <span class="linkText">Profile</span>
    </v-card>
    <v-card flat class="p-2 card" @click="changePage('/auctions')">
      <span class="linkText">Auctions</span>
    </v-card>
    <v-card flat class="p-2 card" @click="changePage('/watching')">
      <span class="linkText">
        Watching
        <small
          v-if="user.watching.length > 0"
          style="background-color: #3ba776;
                      color: white;
                      border-radius: 10px"
          class="pl-2 pr-2 float-right"
        >{{ user.watching.length }}</small>
      </span>
    </v-card>

    <v-card flat class="p-2 card">
      <span class="linkText" @click="changePage('/messages')">Messages</span>
    </v-card>

    <v-card flat class="p-2 card">
      <span class="linkText">Notifications</span>
    </v-card>

    <v-card flat class="p-2 card" @click="changePage('/login')">
      <span class="linkText">Logout</span>
    </v-card>
  </div>
</template>

<script>
export default {
  methods: {
    changePage(page) {
      if (page === "/login") {
        return this.$store.dispatch("ownUser/logout").then(() => {
          this.$router.push(`${page}`);
        });
      }
      this.$router.push(`${page}`);
    }
  },
  computed: {
    user() {
      return this.$store.state.ownUser.user;
    }
  }
};
</script>

<style scoped>
.card:hover {
  background-color: #9369c6;
  color: white;
  cursor: pointer;
}
.linkText {
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Helvetica, Arial,
    sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol";
  font-weight: 400;
  font-size: 50px;
}
</style>