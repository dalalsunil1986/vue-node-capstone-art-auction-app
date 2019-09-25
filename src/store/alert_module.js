export const alert = {
  namespaced: true,
  state: {
    type: null,
    message: null
  },
  actions: {
    success({ commit }, message) {
      commit("success", message);
    },
    error({ commit }, message) {
      commit("error", message);
    },
    clear({ commit }) {
      commit("clear");
    }
  },
  mutations: {
    success(state, message) {
      state.type = "#3ba776";
      state.message = message;
    },
    error(state, message) {
      state.type = "#b44537";
      state.message = message;
    },
    clear(state) {
      state.type = null;
      state.message = null;
    }
  }
};
