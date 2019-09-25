<template>
  <b-col
    lg="4"
    sm="12"
    offset-lg="4"
    class="p-3"
    style="background-color: white; border-radius: 10px; box-shadow: 3px 3px 30px rgba(0,0,0,0.1);"
  >
    <b-row align-h="center" class="p-5">
      <div style="max-width: 80px" class="mt-5">
        <img src="../../assets/logo.png" alt="avatar" style="width: 100%;" />
      </div>
    </b-row>
    <form class="p-3" @submit="recover">
      <v-text-field name="email" label="Email" color="#048ad6" v-model="email" required></v-text-field>
      <v-btn
        color="#048ad6"
        dark
        block
        class="ma-0 mt-3"
        id="formSubmitButton"
        type="submit"
        :loading="loading"
      >
        Recover password
        <span slot="loader" class="custom-loader">
          <v-icon light>cached</v-icon>
        </span>
      </v-btn>
    </form>
    <ul style="color: grey">
      <li>
        Return to Login?
        <a href @click="goBack">Go Back</a>
      </li>
    </ul>
  </b-col>
</template>
<script>
export default {
  data() {
    return {
      email: ""
    };
  },
  methods: {
    recover() {},
    goBack(e) {
      e.preventDefault();
      return this.$router.push("/login");
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
