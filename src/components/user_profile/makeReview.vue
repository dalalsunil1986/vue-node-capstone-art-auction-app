<template>
  <div>
    <v-card flat class="p-3">
      <v-card class="p-2 mb-3" flat>
        <span>Feedback rules:</span>

        <ul>
          <li>Leave feedback only after the exchange.</li>
        </ul>
      </v-card>

      <v-rating
        v-model="rating"
        :full-icon="fullIcon"
        :empty-icon="emptyIcon"
        color="#3ba776"
        background-color="black"
        dense
        size="20"
        hover
      ></v-rating>

      <span class="ml-1 mb-3">Rating ( {{rating}} / 5 )</span>
      <br />
      <small class="ml-1" v-if="rules.length > 0">You must select a rating from 1 to 5</small>

      <v-textarea
        class="mt-3"
        label="Atsiliepimas"
        v-model="reviewText"
        required
        outline
        :rules="rules"
        background-color="#f5f5f5"
        color="#3ba776"
        counter="500"
        type="text"
      ></v-textarea>

      <v-btn
        block
        color="#3ba776"
        dark
        @click="submitReview"
        style="box-shadow: none;"
        large
      >Leave a review</v-btn>
    </v-card>
  </div>
</template>

<script>
export default {
  data() {
    return {
      reviewText: "",
      fullIcon: "fiber_manual_record",
      emptyIcon: "fiber_manual_record",
      rating: 0,
      rules: []
    };
  },
  props: ["auction"],
  computed: {
    user() {
      return this.$store.state.otherUser.user;
    }
  },
  methods: {
    submitReview() {
      if (
        this.reviewText.length > 0 &&
        this.reviewText.length < 500 &&
        this.rating !== 0
      ) {
        this.rules = [];

        this.$store
          .dispatch("generalStore/makeReview", {
            userId: this.user.userId,
            auctionId: this.auction,
            points: this.rating,
            review: this.reviewText
          })
          .then(() => {
            this.reviewText = "";
            this.$emit("closeDialog");
            return this.$router.push("/profile");
          });
      } else {
        return (this.rules = [
          v => v.length < 500 || "Atsiliepimo turinys per ilgas",
          v => v.length > 0 || "Atsiliepimo turinys per trumpas"
        ]);
      }
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
</style>
