import Vue from "vue";
import "./plugins/vuetify";
import App from "./App.vue";
import VueRouter from "vue-router";
import BootstrapVue from "bootstrap-vue";
import "bootstrap/dist/css/bootstrap.css";
import "bootstrap-vue/dist/bootstrap-vue.css";
// import "./App.css"
import { routes } from "./router";
import axios from "axios";
import VueAxios from "vue-axios";
import { store } from "./store/index";

//SOCKET.IO
// import socketio from 'socket.io-client'
// import VueSocketIO from 'vue-socket.io'
// export const SocketInstance = socketio('http://localhost:8081')
// Vue.use(VueSocketIO, SocketInstance, store)

Vue.use(VueAxios, axios);
Vue.use(VueRouter);
Vue.use(BootstrapVue);

axios.defaults.withCredentials = true;

export const Bus = new Vue();

const router = new VueRouter({
  routes,
  mode: "history"
});

Vue.config.productionTip = false;

new Vue({
  render: h => h(App),
  router,
  store
}).$mount("#app");
