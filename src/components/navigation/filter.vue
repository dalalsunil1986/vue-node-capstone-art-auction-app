<template>
  <div>
    <v-card flat class="p-3">
      <v-select
        v-model="form.item"
        color="#3ba776"
        :items="items"
        @change="itm"
        outline
        background-color="#f5f5f5"
        label="Items"
      ></v-select>
      <v-select
        v-model="form.time"
        :items="time"
        label="Time"
        color="#3ba776"
        @change="tm"
        class="mb-0"
        outline
        background-color="#f5f5f5"
      ></v-select>
      <v-select
        v-model="form.city"
        :items="city"
        outline
        background-color="#f5f5f5"
        label="City"
        color="#3ba776"
      ></v-select>
      <v-select
        v-model="form.category"
        :items="category"
        label="Category"
        color="#3ba776"
        class="mb-0"
        outline
        background-color="#f5f5f5"
      ></v-select>
      <v-btn
        color="#3ba776"
        @click="submitForm"
        style="box-shadow: none;"
        class="mt-0"
        dark
        block
        large
      >Sort</v-btn>
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
      form: {
        city: false,
        item: false,
        category: false,
        time: false
      },
      city: [
        "Denver",
        "",
        "",
        "",
        "",
        "",
        "",
        "",
        "",
        ""
      ],
      items: ["Most to least expensive", "Least to most expensive"],
      category: [
        "Art",
        "Stuff",
        "Electronics",
        "Books",
        "Fun",
        "Clothing",
        "Antiques",
        "Other"
      ],
      time: ["Ending soonest", "Ending latest"]
    };
  },
  methods: {
    submitForm() {
      if (
        this.form.city ||
        this.form.item ||
        this.form.category ||
        this.form.time
      ) {
        let item = false;
        let time = false;
        if (this.form.item === "Most expensive at the top") {
          item = -1;
        }
        if (this.form.item === "Cheapest on top") {
          item = 1;
        }
        if (this.form.time === "Ends soonest") {
          time = 1;
        }
        if (this.form.time === "Ends latest") {
          time = -1;
        }
        return this.$store.dispatch("generalStore/filterAuctions", {
          city: this.form.city,
          category: this.form.category,
          sort: item,
          time: time
        });
      }
    },
    itm() {
      this.form.time = false;
    },
    tm() {
      this.form.item = false;
    }
  },
  destroyed() {
    this.$store.dispatch("generalStore/setFilterToNull", null);
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
