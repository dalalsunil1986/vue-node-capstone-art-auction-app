import axios from "axios/index";
// import VueAxios from 'vue-axios';
// Vue.use(VueAxios, axios)
let http = "http://localhost:8080";
export const otherUser = {
  namespaced: true,
  state: {
    user: {
      userId: null,
      username: null,
      email: null,
      rating: null,
      sales: null,
      reviews: null,
      description: null,
      picture: null
    },
    activeAuctions: [],
    reviews: [],
    sales: []
  },
  mutations: {
    //OTHER USER SETTERS
    setOtherUser(state, payload) {
      state.user = payload;
    },
    setReviews(state, payload) {
      state.reviews = payload;
    },
    setActiveAuciotns(state, payload) {
      state.activeAuctions = payload;
    },
    setSales(state, payload) {
      state.sales = payload;
    }
  },
  actions: {
    //GET OTHER USER
    getOtherUser({ commit, dispatch }, payload) {
      return new Promise((resolve, reject) => {
        if (this.state.otherUser.user) {
          if (this.state.otherUser.user.userId === payload) {
            return resolve();
          }
        }
        dispatch("generalStore/setLoading", true, { root: true });
        axios
          .get(http + "/get/user", {
            headers: { id: payload }
          })
          .then(res => {
            if (res.data.success) {
              commit("setActiveAuciotns", res.data.success.activeAuctions);
              commit("setOtherUser", res.data.success.user);
              dispatch("generalStore/setLoading", false, { root: true });
              return resolve();
            }
          })
          .catch(e => {
            reject(e);
          });
      });
    },
    getOtherUserReviews({ commit, dispatch }, payload) {
      return new Promise((resolve, reject) => {
        if (
          this.state.otherUser.user.reviews ===
          this.state.otherUser.reviews.length
        ) {
          return resolve();
        }
        dispatch("generalStore/setLoading", true, { root: true });
        axios
          .get(http + "/get/otheruserreviews", {
            headers: { id: payload }
          })
          .then(res => {
            if (res.data.success) {
              commit("setReviews", res.data.success);
              dispatch("generalStore/setLoading", false, { root: true });
              return resolve();
            }
          })
          .catch(e => {
            reject(e);
          });
      });
    },
    getOtherUserSales({ commit, dispatch }, payload) {
      return new Promise((resolve, reject) => {
        if (
          this.state.otherUser.user.sales === this.state.otherUser.sales.length
        ) {
          return resolve();
        }
        dispatch("generalStore/setLoading", true, { root: true });
        axios
          .get(http + "/get/otherUserSales", {
            headers: { id: payload }
          })
          .then(res => {
            if (res.data.success) {
              commit("setSales", res.data.success);
              dispatch("generalStore/setLoading", false, { root: true });
              return resolve();
            }
          })
          .catch(e => {
            reject(e);
          });
      });
    }
  },
  getters: {
    //OTHER USER GETTERS
    otherUser(state) {
      return state.user;
    }
  }
};
