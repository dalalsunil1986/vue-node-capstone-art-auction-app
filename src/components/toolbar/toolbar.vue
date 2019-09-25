<template>
  <div>
    <v-toolbar
      color="white"
      extension-height="7"
      style="display: flex; justify-content: center;"
      light
      flat
      dense
      app
    >
      <v-toolbar-side-icon @click.native.stop="sideNav = !sideNav" class="hidden-md-and-up"></v-toolbar-side-icon>
      <!-- <v-toolbar-title>bidi</v-toolbar-title> -->
      <v-spacer></v-spacer>
      <v-toolbar-items v-for="item in menuItems" class="hidden-sm-and-down">
        <v-btn
          style="color: #35495e; outline: none; text-decoration: none;"
          flat
          dark
          :to="item.link"
        >
          <v-icon class="toolbar-top-icon">{{ item.icon }}</v-icon>   
          <v-list-tile-content>{{ item.title }}</v-list-tile-content>
        </v-btn>
      </v-toolbar-items>
    </v-toolbar>
    <v-navigation-drawer v-model="sideNav" clipped disable-resize-watcher app> 
      <v-list>
        <v-list-tile v-for="item in menuItems" :key="item.title" :to="item.link">
          <v-list-tile-action>
            <v-icon>{{ item.icon }}</v-icon>
          </v-list-tile-action>
          <v-list-tile-content>{{ item.title }}</v-list-tile-content>
        </v-list-tile>
      </v-list>
    </v-navigation-drawer>
  </div>
</template>
<script>
export default {
  data: () => ({
    sideNav: false,
    loggedIn: true
  }),
  computed: {
    menuItems() {
      let menuItems = [
        { icon: "face", title: "Sign up", link: "/signup" },
        { icon: "lock_open", title: "Sign in", link: "/signin" }
      ];
      if (this.loggedIn) {
        menuItems = [
          { icon: "account_circle", title: "Profile", link: "/profile" },
          { icon: "watch_later", title: "Auctions", link: "/auctions" },
          { icon: "stars", title: "Watching", link: "/watching" },
          { icon: "group_work", title: "Messages", link: "/messages" },
          // {icon: 'notifications', title: 'Notifications', link: '/notifications'},
          { icon: "cancel", title: "Logout", link: "/logout" }
        ];
      }
      return menuItems;
    }
  },
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
  watch: {
    $route(route) {
      if (route.path === "/logout") {
        return this.$store.dispatch("ownUser/logout").then(() => {
          this.$router.push(`${route.path}`);
        });
      }
    }
  }
};
</script>

<style scoped>
.toolbar-top-icon{
  margin-right: 10px;
}
</style>
