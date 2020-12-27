import Vue from 'vue'
import App from './App.vue'
import router from "@/router";
import './plugins/element'
import './assets/css/global.css'
import 'element-ui/lib/theme-chalk/index.css'
import axios from 'axios'


Vue.prototype.$http=axios
axios.defaults.baseURL='http://timemeetyou.com:8889/api/private/v1/'
Vue.config.productionTip = false
axios.interceptors.request.use(config=>{
  config.headers.authorization = window.sessionStorage.getItem("token");
  return config;
})

new Vue({
  router,
  render: h => h(App),
}).$mount('#app')
