<template>
  <div style="max-height: 88vh; overflow: auto; overflow-x: hidden;">
    <v-card flat class="p-3 mb-3" v-for="item in reviews">
      <b-row>
        <b-col cols="2" class="text-center pr-0">
          <div style="width: 100%">
            <v-avatar size="50px" color="grey lighten-4">
              <img :src="item.userPhoto" alt="avatar" />
            </v-avatar>
          </div>
        </b-col>
        <b-col cols="10" class>
          <small class="float-right text-muted mt-1">{{updateTimer(item.time)}}</small>
          <h1
            style="font-size: 18px; cursor: pointer;"
            class="mb-0"
            @click="toUserProfile(item.userId)"
          >{{ item.username }}</h1>
          <ratingComponent :rating="Number(item.points)"></ratingComponent>
          <h1 class="mb-0">{{ item.review }}</h1>
          <b-row class="mt-3">
            <b-col lg="2" sm="3">
              <div style="width: 100%">
                <v-img :src="item.postPhoto" aspect-ratio="1" class="grey lighten-2"></v-img>
              </div>
            </b-col>
            <b-col lg="9" sm="9">
              <h1 style="font-size: 18px" class="mb-0 text-muted">{{item.postTitle}}</h1>
            </b-col>
          </b-row>
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
  computed: {
    reviews() {
      if (this.otherUser) {
        return this.$store.state.otherUser.reviews.reverse();
      } else {
        return this.$store.state.ownUser.reviews.reverse();
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
    },
    toUserProfile(to) {
      if (to === this.$store.state.ownUser.user.Id) {
        return this.$router.push(`/profile`);
      }
      this.$store.dispatch("otherUser/getOtherUser", to);
      this.$router.push(`/user/${to}`);
    }
  },
  props: ["otherUser"],
  created() {
    this.$store.dispatch("ownUser/getOwnReviews");
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