import Vue from "vue";
import Vuex from "vuex";
import { alert } from "./alert_module";
import { ownUser } from "./own_user_store";
import { otherUser } from "./other_user_store";
import { generalStore } from "./general_store";
import { messagesStore } from "./messages_store";
import { notificationsStore } from "./notifications_store";
Vue.use(Vuex);
export const store = new Vuex.Store({
  modules: {
    alert,
    ownUser,
    otherUser,
    generalStore,
    messagesStore,
    notificationsStore
  }
});
