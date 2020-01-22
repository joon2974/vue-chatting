import Vue from 'vue'
import App from './App.vue'
import VueMaterial from 'vue-material'
import router from './router'
import store from './store'
import 'vue-material/dist/vue-material.css'
import 'vue-material/dist/theme/black-green-light.css'
import Directives from './plugins/directives'

import io from 'socket.io-client'
import vuetify from './plugins/vuetify';
// 3001번 포트로 소켓 connection을 연다.
const socket = io('http://13.209.40.0:3001');

Vue.prototype.$socket = socket;

Vue.use(VueMaterial)
Vue.use(Directives)

Vue.config.productionTip = false

new Vue({
  vuetify,
  router,
  store,
  render: h => h(App)
}).$mount('#app')
