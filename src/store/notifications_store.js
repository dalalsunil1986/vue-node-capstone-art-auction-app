// import axios from "axios/index";
// import VueAxios from 'vue-axios';
// Vue.use(VueAxios, axios)
// let http = "http://localhost:8080";
export const notificationsStore = {
  namespaced: true,
  state: {
    notifications: []
  },
  mutations: {
    setNotifications(state, payload) {
      return (state.notifications = payload);
    },
    removeNotification(state, payload) {
      return (state.notifications = state.notifications.filter(
        item => item.postId !== payload
      ));
    },
    pushNewNotification(state, payload) {
      return state.notifications.push(payload);
    }
  },
  actions: {
    setNotifications({ commit }, payload) {
      return commit("setNotifications", payload);
    },
    removeNotification({ commit }, payload) {
      return commit("removeNotification", payload);
    },
    pushNewNotification({ commit }, payload) {
      return commit("pushNewNotification", payload);
    }
  },
  getters: {}
};
