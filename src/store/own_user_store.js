import axios from "axios/index";
import VueAxios from "vue-axios";
import Vue from "vue";
Vue.use(VueAxios, axios);
let http = "http://localhost:8080";
export const ownUser = {
  namespaced: true,
  state: {
    loggedIn: false,
    user: null,
    activeAuctions: [],
    sales: [],
    reviews: [],
    watching: []
  },
  mutations: {
    //OWN PROFILE SETTERS
    setLoggedIn(state, payload) {
      state.loggedIn = payload;
    },
    setUser(state, payload) {
      state.user = {
        Id: payload.Id,
        username: payload.username,
        email: payload.email,
        description: payload.description,
        rating: payload.rating,
        picture: payload.picture,
        watching: payload.watching
      };
    },
    plusMinusActiveAuctions(state, payload) {
      if (payload.add) {
        state.user.activeAuctions++;
      } else {
        state.user.activeAuctions--;
      }
    },
    setUserDescription(state, payload) {
      state.user.description = payload;
    },
    setProfilePicture(state, payload) {
      state.user.picture = payload;
    },
    setUserAuctions(state, payload) {
      state.activeAuctions = payload;
    },
    setUserReviews(state, payload) {
      state.reviews = payload;
    },
    setUserSales(state, payload) {
      state.sales = payload;
    },
    setWatching(state, payload) {
      state.watching = payload;
    },
    addWatching(state, payload) {
      state.user.watching.push(payload);
    },
    removeWatching(state, payload) {
      state.user.watching.splice(state.user.watching.indexOf(payload), 1);
    },
    removeAuctionFromWall(state, payload) {
      state.activeAuctions = state.activeAuctions.filter(
        item => item._id !== payload
      );
    }
  },
  actions: {
    //AUTH ROUTES
    // autoLogin({commit}, payload) {
    //     return new Promise((resolve, reject) => {
    //         axios.get(http + '/auth/autoLogin', {
    //             headers: {token: payload}
    //         }).then((res) => {
    //             commit('setUser', res.data.user)
    //             resolve()
    //         }).catch(e => {
    //             reject(e)
    //         })
    //     })
    // },
    login({ commit, dispatch }, payload) {
      return new Promise((resolve, reject) => {
        dispatch("generalStore/setLoading", true, { root: true });
        axios
          .post(http + "/auth/login", payload)
          .then(res => {
            console.log(res);
            if (res.status === 200) {
              dispatch("generalStore/setLoading", false, { root: true });
              commit("setLoggedIn", true);
              commit("setUser", res.data.user);
              if (res.data.user.notifications.length > 0) {
                dispatch(
                  "notificationsStore/setNotifications",
                  res.data.user.notifications,
                  { root: true }
                );
              } else {
                dispatch("notificationsStore/setNotifications", [], {
                  root: true
                });
              }
              resolve(res.data.user.Id);
            }
          })
          .catch(e => {
            reject(e);
          });
      });
    },
    logout({ commit, dispatch }) {
      return new Promise((resolve, reject) => {
        dispatch("generalStore/setLoading", true, { root: true });
        axios
          .get(http + "/auth/logout")
          .then(res => {
            if (res.data.success) {
              dispatch("generalStore/setLoading", false, { root: true });
              commit("setLoggedIn", false);
              resolve();
            }
          })
          .catch(e => {
            reject(e);
          });
      });
    },
    register({ dispatch }, payload) {
      return new Promise((resolve, reject) => {
        dispatch("generalStore/setLoading", true, { root: true });
        axios
          .post(http + "/auth/register", payload)
          .then(() => {
            resolve();
          })
          .catch(e => {
            reject(e);
          });
      });
    },
    //USER EDIT ROUTES
    changeDescription({ commit, dispatch }, payload) {
      return new Promise((resolve, reject) => {
        dispatch("generalStore/setLoading", true, { root: true });
        axios
          .post(http + "/update/description", { description: payload })
          .then(res => {
            if (res.data.success === false) {
              dispatch("generalStore/setLoading", false, { root: true });
              dispatch("alert/error", res.data.message, { root: true });
              return resolve();
            }
            resolve();
            commit("setUserDescription", payload);
            dispatch("generalStore/setLoading", false, { root: true });
          })
          .catch(e => {
            reject(e);
          });
      });
    },
    updateProfilePicture({ commit, dispatch }, payload) {
      return new Promise((resolve, reject) => {
        dispatch("generalStore/setLoading", true, { root: true });
        axios
          .post(http + "/update/picture", payload, {
            headers: {
              "Content-Type": "multipart/form-data"
            }
          })
          .then(res => {
            if (res.data.success === false) {
              dispatch("generalStore/setLoading", false, { root: true });
              dispatch("alert/error", res.data.message, { root: true });
              return resolve();
            }
            commit("setProfilePicture", res.data.success);
            dispatch("generalStore/setLoading", false, { root: true });
            return resolve();
          })
          .catch(e => {
            reject(e);
          });
      });
    },
    //UPLOAD NEW AUCTION
    uploadNewAuction({ commit, dispatch }, payload) {
      return new Promise((resolve, reject) => {
        dispatch("generalStore/setLoading", true, { root: true });
        axios
          .post(http + "/update/newauction", payload, {
            headers: {
              "Content-Type": "multipart/form-data"
            }
          })
          .then(res => {
            if (res.data.success === false) {
              dispatch("generalStore/setLoading", false, { root: true });
              dispatch("alert/error", res.data.message, { root: true });
              return resolve();
            }
            commit("plusMinusActiveAuctions", { add: true });
            dispatch("generalStore/setLoading", false, { root: true });
            resolve();
          })
          .catch(e => {
            reject(e);
          });
      });
    },
    //GET USER AUCTIONS
    getOwnAuctions({ commit, dispatch }) {
      return new Promise((resolve, reject) => {
        dispatch("generalStore/setLoading", true, { root: true });
        axios
          .get(http + "/get/ownauctions")
          .then(res => {
            if (res.data.success) {
              commit("setUserAuctions", res.data.success);
              dispatch("generalStore/setLoading", false, { root: true });
              resolve();
            }
          })
          .catch(e => {
            reject(e);
          });
      });
    },
    getOwnReviews({ commit, dispatch }) {
      return new Promise((resolve, reject) => {
        dispatch("generalStore/setLoading", true, { root: true });
        axios
          .get(http + "/get/ownreviews")
          .then(res => {
            if (res.data.success) {
              commit("setUserReviews", res.data.success.reviews);
              dispatch("generalStore/setLoading", false, { root: true });
              resolve();
            }
          })
          .catch(e => {
            reject(e);
          });
      });
    },
    getOwnSales({ commit, dispatch }) {
      return new Promise((resolve, reject) => {
        dispatch("generalStore/setLoading", true, { root: true });
        axios
          .get(http + "/get/ownsales")
          .then(res => {
            if (res.data.success) {
              commit("setUserSales", res.data.success.soldAuctions);
              dispatch("generalStore/setLoading", false, { root: true });
              resolve();
            }
          })
          .catch(e => {
            reject(e);
          });
      });
    },
    //WATCHING
    addWatching({ commit, dispatch }, payload) {
      return new Promise((resolve, reject) => {
        dispatch("generalStore/setLoading", true, { root: true });
        axios
          .post(http + "/update/addWatching", payload)
          .then(res => {
            if (res.data.success === false) {
              dispatch("generalStore/setLoading", false, { root: true });
              dispatch("alert/error", res.data.message, { root: true });
              return resolve();
            }
            dispatch("generalStore/setLoading", false, { root: true });
            commit("addWatching", payload.postId);
            resolve();
          })
          .catch(e => {
            reject(e);
          });
      });
    },
    removeWatching({ commit, dispatch }, payload) {
      return new Promise((resolve, reject) => {
        dispatch("generalStore/setLoading", true, { root: true });
        axios
          .post(http + "/update/removeWatching", payload)
          .then(res => {
            if (res.data.success) {
              dispatch("generalStore/setLoading", false, { root: true });
              commit("removeWatching", payload.postId);
              resolve();
            }
          })
          .catch(e => {
            reject(e);
          });
      });
    },
    getWatching({ commit, dispatch }) {
      return new Promise((resolve, reject) => {
        dispatch("generalStore/setLoading", true, { root: true });
        axios
          .get(http + "/get/watching", {
            headers: {
              userId: this.state.ownUser.user.Id
            }
          })
          .then(res => {
            if (res.data.success) {
              commit("setWatching", res.data.success);
              dispatch("generalStore/setLoading", false, { root: true });
              resolve();
            }
          })
          .catch(e => {
            reject(e);
          });
      });
    },
    renewPost({ dispatch }, payload) {
      return new Promise((resolve, reject) => {
        dispatch("generalStore/setLoading", true, { root: true });
        axios
          .post(http + "/update/renewpost", { id: payload })
          .then(res => {
            if (res.data.success === false) {
              dispatch("generalStore/setLoading", false, { root: true });
              dispatch("alert/error", res.data.message, { root: true });
              return resolve();
            }
            dispatch("notificationsStore/removeNotification", payload, {
              root: true
            });
            //REMOVE POST ALSO
            dispatch("generalStore/setLoading", false, { root: true });
            resolve();
          })
          .catch(e => {
            reject(e);
          });
      });
    },
    deletePost({ commit, dispatch }, payload) {
      return new Promise((resolve, reject) => {
        dispatch("generalStore/setLoading", true, { root: true });
        axios
          .post(http + "/update/deletepost", { id: payload })
          .then(res => {
            if (res.data.success === false) {
              dispatch("generalStore/setLoading", false, { root: true });
              dispatch("alert/error", res.data.message, { root: true });
              return resolve();
            }
            dispatch("notificationsStore/removeNotification", payload, {
              root: true
            });
            commit("removeAuctionFromWall", payload);
            dispatch("generalStore/setLoading", false, { root: true });
            resolve();
          })
          .catch(e => {
            reject(e);
          });
      });
    }
  },
  getters: {
    //OWN GETTERS
    user(state) {
      return state.user;
    },
    activeAuctions(state) {
      return state.activeAuctions;
    },
    loading(state) {
      return state.loading;
    }
  }
};
