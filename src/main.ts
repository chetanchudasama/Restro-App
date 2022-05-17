import Vue from "vue";
import App from "./App.vue";
import router from "@/router";
import Vuetify from "vuetify";
import "vuetify/dist/vuetify.min.css";
import "../public/css/fonts.css";
import "../public/css/custom.css";
import "../public/css/style.css";
import "./registerServiceWorker";
import StoreWrapper from './store';
import VueI18n from 'vue-i18n';

import enMessages from "./localisation/en.json";
import arMessages from "./localisation/ar.json";

Vue.config.productionTip = false;
Vue.use(Vuetify);
Vue.use(VueI18n);

const locale = 'en';

const allMessages = {
  en: enMessages,
  ar: arMessages,
};

const messages = allMessages;

const i18n = new VueI18n({
  locale,
  messages,
});

const store = StoreWrapper.LoadStore();

new Vue({
  vuetify: new Vuetify(),
  router,
  store,
  render: (h) => h(App),
  i18n,
}).$mount("#app");
