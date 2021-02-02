import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import axios from "axios";

import Vuelidate from "vuelidate";
import moment from "moment";
import VueMoment from "vue-moment";
import "vue-awesome/icons";
import Icon from "vue-awesome/components/Icon";

import VueAwesomeSwiper from "vue-awesome-swiper";
import "swiper/css/swiper.css";

const VueParticles = require("vue-particles").default;

Vue.config.productionTip = false;
Vue.prototype.$primevue = { ripple: true };

Vue.use(Vuelidate);
Vue.use(VueParticles);
Vue.use(VueMoment, { moment }, VueAwesomeSwiper);
Vue.component("v-icon", Icon);

const API = "http://localhost:80/api/v1/checklists";

async function initData() {
  try {
    const res = await axios.get(`${API}`);
    const checklists = res.data.data.checklists;
    store.commit("getChecklists", checklists);
    new Vue({
      router,
      store,
      render: (h) => h(App),
    }).$mount("#app");
  } catch (err) {
    // TODO: Proper error handling here with message
    new Vue({
      router,
      store,
      render: (h) => h(App),
    }).$mount("#app");
    console.log(err);
  }
}

initData();
