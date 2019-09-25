<template>
  <b-col lg="10" md="12" offset-lg="1" class="checkoutCard">
    <b-row>
      <b-col lg="8" class="pa-5">
        <v-tabs v-model="tab" white grow slider-color="black">
          <v-tab
            v-for="(n, index) in navbarItems"
            :key="n"
            style="font-size: 13px"
            ripple
            @click="changeTab(index)"
          >{{ n }}</v-tab>
        </v-tabs>
        <br />
        <br />
        <customer_info_form v-if="tab === 0"></customer_info_form>
        <shipping_info_form v-if="tab === 1"></shipping_info_form>
        <payment_selection_form v-if="tab === 2"></payment_selection_form>
      </b-col>
      <b-col lg="4" class="pa-4" style="background-color: #f8fafb;">
        <shopping_cart></shopping_cart>
      </b-col>
    </b-row>
  </b-col>
</template>

<script>
import customer_info_form from "../components/forms/customer_information";
import shipping_info_form from "../components/forms/shipping_information";
import payment_selection_form from "../components/forms/payment_selection";
import shopping_cart from "../components/shopping_cart/cart";
export default {
  name: "paymentForm",
  data() {
    return {
      navbarItems: [
        "01 CUSTOMER INFO",
        "02 SHIPPING INFO",
        "03 PAYMENT SELECTION"
      ],
      tab: 0
    };
  },
  methods: {
    changeTab(tab) {
      this.tab = tab;
    }
  },
  components: {
    customer_info_form,
    shipping_info_form,
    payment_selection_form,
    shopping_cart
  }
};
</script>

<style scoped>
.checkoutCard {
  box-shadow: 3px 3px 30px rgba(0, 0, 0, 0.1);
  border-radius: 10px;
  background-color: white;
  overflow: hidden;
}
</style>