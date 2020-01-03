import Vue from 'vue'
import App from './App.vue'
import router from './router'
import createStore from './store'
import Vuex from 'vuex'
import vuetify from './plugins/vuetify';
import '@babel/polyfill'

Vue.config.productionTip = false

Vue.use(Vuex)
const store = createStore()

new Vue({
  router,
  store,
  vuetify,
  render: h => h(App)
}).$mount('#app')
