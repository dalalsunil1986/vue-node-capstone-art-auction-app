import axios from "axios/index";
// import VueAxios from 'vue-axios';
//
// Vue.use(VueAxios, axios)

let http = "http://localhost:8080";

export const messagesStore = {
  namespaced: true,
  state: {
    conversations: null,
    messages: [],
    currentChatWith: null
  },
  mutations: {
    //GENERAL SETTERS
    setConversations(state, payload) {
      state.conversations = payload;
    },
    pushNewMessage(state, payload) {
      state.messages.push(payload);
    },
    emptyMessages(state) {
      state.messages = [];
    },
    setCurrentChatId(state, payload) {
      state.currentChatWith = payload;
    }
  },
  actions: {
    sendMessage({ commit, dispatch }, payload) {
      return new Promise((resolve, reject) => {
        dispatch("generalStore/setLoading", true, { root: true });
        axios
          .post(http + "/update/sendmessage", {
            message: payload,
            to: this.state.otherUser.user.userId
          })
          .then(res => {
            if (res.data.success) {
              commit("pushNewMessage", res.data.success);
              dispatch("generalStore/setLoading", false, { root: true });
              resolve();
            }
          })
          .catch(e => {
            reject(e);
          });
      });
    },
    getConversations({ commit, dispatch }) {
      return new Promise((resolve, reject) => {
        dispatch("generalStore/setLoading", true, { root: true });
        axios
          .get(http + "/get/conversations")
          .then(res => {
            if (res.data.success) {
              commit("setConversations", res.data.success);
              dispatch("generalStore/setLoading", false, { root: true });
              return resolve();
            }
            commit("setConversations", res.data.success);
            dispatch("generalStore/setLoading", false, { root: true });
            return resolve();
          })
          .catch(e => {
            reject(e);
          });
      });
    },
    getChat({ commit, dispatch }, payload) {
      return new Promise((resolve, reject) => {
        dispatch("generalStore/setLoading", true, { root: true });
        axios
          .get(http + "/get/chat", {
            headers: { convo: payload.id, all: payload.allMessages }
          })
          .then(res => {
            if (!res.data.success) {
              dispatch("generalStore/setLoading", false, { root: true });
              return resolve(false);
            }
            if (res.data.success) {
              commit("emptyMessages");
              res.data.success.map(x => {
                commit("pushNewMessage", x);
              });
              dispatch("generalStore/setLoading", false, { root: true });
              resolve();
            }
          })
          .catch(e => {
            reject(e);
          });
      });
    },
    setCurrentChatId({ commit }, payload) {
      commit("setCurrentChatId", payload);
    },
    addNewMessage({ commit }, payload) {
      return commit("pushNewMessage", payload);
    }
  },
  getters: {
    // //GENERAL GETTERS
    // singleAuction(state) {
    //     return state.singleAuction
    // },
    // allAuctions(state) {
    //     return state.allAuctions
    // },
    // loading(state) {
    //     return state.loading
    // },
  }
};
