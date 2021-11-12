import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import Vant from 'vant'
import VueLazyload from 'vue-lazyload'
import 'vant/lib/index.css'
import axios from 'axios'
import './filters/index.ts'
import { NODE_ENV } from './utils/index'

Vue.use(Vant)
Vue.use(VueLazyload)

Vue.prototype.$axios = axios
Vue.prototype.NODE_ENV = NODE_ENV

Vue.config.productionTip = false


new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
