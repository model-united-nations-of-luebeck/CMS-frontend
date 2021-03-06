import Vue from 'vue'
import App from './App.vue'
import vuetify from './plugins/vuetify';
import router from './router'
import Vue2Filters from 'vue2-filters'
import {
  Icon
} from 'leaflet'

Vue.config.productionTip = false
Vue.use(Vue2Filters)

delete Icon.Default.prototype._getIconUrl;
Icon.Default.mergeOptions({
  iconRetinaUrl: require("leaflet/dist/images/marker-icon-2x.png"),
  iconUrl: require("leaflet/dist/images/marker-icon.png"),
  shadowUrl: require("leaflet/dist/images/marker-shadow.png")
});

new Vue({
  vuetify,
  router,
  render: h => h(App),
}).$mount('#app')