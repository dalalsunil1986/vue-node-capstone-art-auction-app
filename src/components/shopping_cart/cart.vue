<template>
  <div class="mt-3 p-3">
    <span class="cartHeader">Shopping Cart</span>
    <v-badge right class="mt-3 mr-4 float-right">
      <span slot="badge">{{ items.length }}</span>
    </v-badge>
    <v-divider></v-divider>
    <b-row v-for="x in items">
      <b-col lg="12" class="p-3">
        <b-row>
          <b-col cols="5">
            <v-img :src="x.photo" aspect-ratio="1" class="grey lighten-2"></v-img>
          </b-col>
          <b-col cols="7">
            <p class="itemTitle">{{ x.name }}</p>
            <p class="itemPrice">€ {{ x.price }}</p>
          </b-col>
        </b-row>
      </b-col>
    </b-row>
    <v-divider></v-divider>
    <div class="ml-1 voucherDiv">
      <span v-b-toggle.collapse @click="haveVoucher = !haveVoucher">Have a Voucher?</span>
      <i class="material-icons float-right">{{ haveVoucher ? 'expand_less' : 'expand_more'}}</i>
    </div>
    <b-collapse invisible id="collapse" class="mt-2">
      <b-form-input type="text" placeholder="Enter Voucher Code"></b-form-input>
    </b-collapse>
    <v-divider></v-divider>
    <div class="ml-1 mb-2">
      <span class="itemTitle">Subtotal</span>
      <span class="itemPrice float-right">€ {{ countTotal }}</span>
    </div>
    <div class="ml-1">
      <span class="itemTitle">Shipping</span>
      <span class="itemPrice float-right">Free</span>
    </div>
    <v-divider></v-divider>
    <div class="ml-1">
      <span class="itemPrice">Total</span>
      <span class="itemPrice float-right">€ {{ countTotal }}</span>
    </div>
  </div>
</template>
<script>
export default {
  name: "cart",
  data() {
    return {
      items: [
        {
          price: 16.99,
          name: "Spongebob pants, with no pockets",
          photo:
            "https://pp.userapi.com/c837424/v837424181/56a1c/dwaG9Xkb9qY.jpg"
        },
        {
          price: 28.99,
          name: "White woman jacket",
          photo:
            "https://pp.userapi.com/c639626/v639626991/3af6/fOQGARCNkpA.jpg"
        }
      ],
      haveVoucher: false,
      totalPrice: 0
    };
  },
  computed: {
    countTotal() {
      this.items.map(x => (this.totalPrice += x.price));
      return this.totalPrice;
    }
  }
};
</script>
<style scoped>
.cartHeader {
  font-weight: normal;
  font-size: 19px;
}
ul {
  list-style-type: none;
}
.itemTitle {
  font-weight: 500;
  font-size: 14px;
  color: darkgray;
}
.itemPrice {
  font-weight: 700;
  font-size: 14px;
  color: gray;
}
.voucherDiv {
  font-weight: 500;
  cursor: pointer;
  color: darkgray;
}
</style>