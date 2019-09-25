<template>
  <div>
    <h1 class="mb-3">Payment selection</h1>
    <form>
      <b-row>
        <b-col sm="12" lg="6">
          <v-text-field label="First name" color="primary"></v-text-field>
        </b-col>
        <b-col sm="12" lg="6">
          <v-text-field label="Last name" color="primary"></v-text-field>
        </b-col>
        <b-col lg="12">
          <v-text-field label="Adress" color="primary"></v-text-field>
        </b-col>
        <b-col sm="12" lg="6">
          <v-select :items="countryList" label="Country" color="primary" required></v-select>
        </b-col>
        <b-col sm="12" lg="6">
          <v-text-field label="City" color="primary"></v-text-field>
        </b-col>
        <b-col sm="12" lg="6">
          <v-text-field label="Postal code" color="primary"></v-text-field>
        </b-col>
        <b-col sm="12" lg="6">
          <v-text-field label="Phone" color="primary"></v-text-field>
        </b-col>
        <b-col sm="12" lg="6" class="pa-0 mt-2">
          <v-btn flat style="color: grey; font-size: 12px;" @click="back">
            <i class="material-icons" style="font-size: 15px;">arrow_back_ios</i>
            Back to shop
          </v-btn>
        </b-col>
        <b-col sm="12" lg="6" class="text-right p-2">
          <v-btn color="primary">Make a payment</v-btn>
        </b-col>
      </b-row>
    </form>
  </div>
</template>
<script>
export default {
  name: "customer_information",
  data() {
    return {
      countryList: ["USA", "Canada", "Mexico", "Other"]
    };
  },
  methods: {
    back() {
      return this.$router.push("/login");
    }
  }
};
</script>

<style scoped>
h1 {
  font-weight: inherit;
  font-size: 17px;
}
</style>