<template>
  <div style="max-height: 88vh; overflow: auto; overflow-x: hidden;">
    <v-card flat class="p-3 mb-3" v-for="item in sold">
      <b-row>
        <b-col cols="2" class="text-center pr-0">
          <div style="width: 100%">
            <v-img :src="item.picture" aspect-ratio="1" class="grey lighten-2"></v-img>
          </div>
        </b-col>
        <b-col cols="10" class>
          <h1 style="font-size: 18px" class="mb-0">{{ item.title }}</h1>
          <small class="text-muted">{{updateTimer(item.time)}}</small>
        </b-col>
      </b-row>
    </v-card>
  </div>
</template>
<script>
import ratingComponent from "../user_profile/rating_component";
export default {
  components: {
    ratingComponent
  },
  data() {
    return {
      rating: 2
    };
  },
  props: ["otherUser"],
  computed: {
    sold() {
      if (this.otherUser) {
        return this.$store.state.otherUser.sales;
      } else {
        return this.$store.state.ownUser.sales;
      }
    }
  },
  methods: {
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
    }
  },
  created() {
    if (this.otherUser) {
      this.$store.dispatch(
        "otherUser/getOtherUserSales",
        this.$store.state.otherUser.user.userId
      );
    } else {
      this.$store.dispatch("ownUser/getOwnSales");
    }
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