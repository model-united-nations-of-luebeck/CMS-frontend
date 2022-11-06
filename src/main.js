import Vue from 'vue';
import App from './App.vue';
import vuetify from './plugins/vuetify';
import router from './router';
import Vue2Filters from 'vue2-filters';
import VueTelInputVuetify from 'vue-tel-input-vuetify/lib';
import VueClipboard from 'vue-clipboard2';
import JsonCSV from 'vue-json-csv';
import JsonExcel from 'vue-json-excel';
import {
  Icon
} from 'leaflet'
import DatetimePicker from "vuetify-datetime-picker";
import HighchartsVue from 'highcharts-vue'
import axios from 'axios'

Vue.config.productionTip = false
Vue.use(Vue2Filters)
Vue.use(DatetimePicker)
Vue.use(HighchartsVue)


Vue.use(VueTelInputVuetify, {
  vuetify,
  placeholder: '',
  label: 'Phone'
});
Vue.use(VueClipboard);
Vue.component('downloadCsv',JsonCSV);
Vue.component('downloadExcel',JsonExcel);

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

// create global axios instance for backend requests
const backend_instance = axios.create({
  baseURL: "https://munoltom.pythonanywhere.com/",
});
Vue.prototype.$http = backend_instance;