import axios from "axios/index";
// import VueAxios from 'vue-axios';
//
// Vue.use(VueAxios, axios)

let http = "http://localhost:8080";

export const generalStore = {
  namespaced: true,

  state: {
    singleAuction: null,
    allAuctions: null,
    loading: false,
    allAuctionsCount: null,
    filter: false,
    currentPage: 1
  },

  mutations: {
    //GENERAL SETTERS
    setSingleAuction(state, payload) {
      state.singleAuction = payload;
    },
    setAllAuctions(state, payload) {
      state.allAuctions = payload;
    },
    setLoading(state, payload) {
      state.loading = payload;
    },
    setAuctionAfterBid(state, payload) {
      state.singleAuction.auction = payload;
    },
    setAllAuctionsCount(state, payload) {
      state.allAuctionsCount = payload;
    },
    setFilter(state, payload) {
      state.filter = payload;
    },
    setCurrentPage(state, payload) {
      state.currentPage = payload;
    },
    addNewBidFromSocket(state, payload) {
      state.singleAuction.auction.price = payload.bid;
      state.singleAuction.auction.bids.push(payload);
    }
  },

  actions: {
    //GET SINGLE AUCTON

    getSingleAuction({ commit }, payload) {
      return new Promise((resolve, reject) => {
        commit("setLoading", true);
        axios
          .get(http + "/get/singlauction", {
            headers: { id: payload }
          })
          .then(res => {
            if (res.data.success) {
              commit("setSingleAuction", res.data.success);
              commit("setLoading", false);
              resolve();
            }
          })
          .catch(e => {
            reject(e);
          });
      });
    },

    //GET ALL AUCTIONS

    getAllAuctions({ commit }, payload) {
      return new Promise((resolve, reject) => {
        commit("setLoading", true);

        if (this.state.generalStore.filter) {
          axios
            .post(http + "/get/filter", this.state.generalStore.filter, {
              headers: {
                page: payload
              }
            })
            .then(res => {
              if (res.data.success) {
                commit("setAllAuctionsCount", res.data.success.count);
                commit("setAllAuctions", res.data.success.data);
                commit("setLoading", false);
                resolve();
              }
            })
            .catch(e => {
              reject(e);
            });
        } else {
          axios
            .get(http + "/get/all", {
              headers: {
                page: payload
              }
            })
            .then(res => {
              if (res.data.success) {
                commit("setAllAuctionsCount", res.data.success.count);
                commit("setAllAuctions", res.data.success.data);
                commit("setLoading", false);
                resolve();
              }
            })
            .catch(e => {
              reject(e);
            });
        }
      });
    },

    //FILTER

    filterAuctions({ commit }, payload) {
      return new Promise((resolve, reject) => {
        commit("setLoading", true);
        commit("setCurrentPage", 1);
        commit("setFilter", payload);
        axios
          .post(http + "/get/filter", payload, {
            page: 0
          })
          .then(res => {
            //IF COUNT 0 MAKE SOME KIND OF EMPTY NOTIFICATION

            if (res.data.success) {
              commit("setAllAuctionsCount", res.data.success.count);
              commit("setAllAuctions", res.data.success.data);
              commit("setLoading", false);
              resolve();
            }
          })
          .catch(e => {
            reject(e);
          });
      });
    },

    //MAKE A BID

    makeBid({ commit, dispatch }, payload) {
      return new Promise((resolve, reject) => {
        commit("setLoading", true);
        axios
          .post(http + "/update/makebid", payload)
          .then(res => {
            if (res.data.success === false) {
              commit("setLoading", false);
              return resolve();
            }

            commit("setAuctionAfterBid", res.data.success);
            commit("setLoading", false);
            resolve();
          })
          .catch(e => {
            reject(e);
          });
      });
    },

    getBidFromSocket({ commit }, payload) {
      commit("addNewBidFromSocket", payload);
    },

    deleteConversation({ commit }, payload) {
      return new Promise((resolve, reject) => {
        commit("setLoading", true);
        axios
          .post(http + "/update/deleteConversation", { id: payload })
          .then(res => {
            if (res.data.success === false) {
              commit("setLoading", false);
              return resolve();
            }

            commit("setLoading", false);
            return resolve();
          })
          .catch(e => {
            reject(e);
          });
      });
    },

    //MAKE A REVIEW

    makeReview({ commit, dispatch }, payload) {
      return new Promise((resolve, reject) => {
        commit("setLoading", true);
        axios
          .post(http + "/update/makereview", payload)
          .then(res => {
            if (res.data.success === false) {
              dispatch("alert/error", res.data.message, { root: true });
              commit("setLoading", false);
              return resolve();
            }

            dispatch(
              "notificationsStore/setNotifications",
              res.data.notifications,
              { root: true }
            );

            commit("ownUser/removeAuctionFromWall", payload.auctionId, {
              root: true
            });

            commit("setLoading", false);
            return resolve();
          })
          .catch(e => {
            reject(e);
          });
      });
    },

    setLoading({ commit }, payload) {
      return commit("setLoading", payload);
    },
    setFilterToNull({ commit }) {
      return commit("setFilter", false);
    }
  },

  getters: {
    //GENERAL GETTERS
    singleAuction(state) {
      return state.singleAuction;
    },
    allAuctions(state) {
      return state.allAuctions;
    },
    loading(state) {
      return state.loading;
    }
  }
};
