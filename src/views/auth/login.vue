<template>
  <b-col
    lg="4"
    sm="12"
    offset-lg="4"
    class="p-3"
    style="background-color: white; border-radius: 10px; box-shadow: 3px 3px 30px rgba(0,0,0,0.1);"
  >
    <slot></slot>
    <b-row align-h="center" class="p-5 text">
    <h1>Art Auctions</h1><br/>
    </b-row>
    <b-row align-h="center" class="p-5 image">
      <div style="max-width: 80px" class="mt-5">
        <img src="../../assets/logo.png" alt="avatar" style="width: 100%;" />
      </div>
    </b-row>

    <form class="p-3" @submit="login">
      <v-text-field name="email" label="Email" color="#048ad6" v-model="signin.email" required></v-text-field>

      <v-text-field
        name="passowrd"
        label="Password"
        color="#048ad6"
        v-model="signin.password"
        type="password"
        required
      ></v-text-field>

      <v-btn
        color="#048ad6"
        dark
        block
        class="ma-0 mt-3"
        id="formSubmitButton"
        type="submit"
        :loading="loading"
      >
        Login
        <span slot="loader" class="custom-loader">
          <v-icon light>cached</v-icon>
        </span>
      </v-btn>
    </form>

    <ul style="color: grey">
      <li>
        Forgot your password?
        <a href @click="goRecovery">Recover</a>
      </li>
      <li>
        New user?
        <a href @click="goRegister">Register</a>
      </li>
      <li>
      Built by
      <a href="https://davidbrookton.com">David Brookton</a>
    </li>
    </ul>
  </b-col>
</template>

<script>
import { Bus } from "../../main";
export default {
  data() {
    return {
      signin: {
        email: "",
        password: ""
      }
    };
  },
  methods: {
    login(e) {
      e.preventDefault();
      this.$store
        .dispatch("ownUser/login", this.signin)
        .then(res => {
          this.$router.push("/profile");
          Bus.$emit("userLoggedIn", res);
          this.$store.dispatch("ownUser/getOwnAuctions");
          this.$store.dispatch("ownUser/getOwnReviews");
          this.$store.dispatch("ownUser/getOwnSales");
        })
        .catch(e => {
          console.log(e);
        });
    },
    goRecovery(e) {
      e.preventDefault();
      return this.$router.push("/recovery");
    },
    goRegister(e) {
      e.preventDefault();
      return this.$router.push("/register");
    }
  },
  computed: {
    loading() {
      return this.$store.getters.loading;
    }
  }
};
</script>

<style scoped>
h1 {
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Helvetica, Arial,
    sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol";
  font-weight: bold;
  font-size: 28px;
}
div.row.p-5.text {
  margin-bottom: -100px;
}
ul {
  margin-top: 150px;
  font-size: 12.5px;
  color: grey;
}
a {
  color: #048ad6;
}
.custom-loader {
  animation: loader 1s infinite;
  display: flex;
}
@-moz-keyframes loader {
  from {
    transform: rotate(0);
  }
  to {
    transform: rotate(360deg);
  }
}
@-webkit-keyframes loader {
  from {
    transform: rotate(0);
  }
  to {
    transform: rotate(360deg);
  }
}
@-o-keyframes loader {
  from {
    transform: rotate(0);
  }
  to {
    transform: rotate(360deg);
  }
}
@keyframes loader {
  from {
    transform: rotate(0);
  }
  to {
    transform: rotate(360deg);
  }
}
</style>
