import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import VueMaterial from 'vue-material'
import 'vue-material/dist/vue-material.min.css'
import 'vue-material/dist/theme/default.css'
import axios from 'axios'
import VueAxios from 'vue-axios'
import VueMsalPlugin from './plugins/vue-msal'
import { environment } from './environments/environment'

Vue.config.productionTip = false
Vue.use(VueMaterial)
Vue.use(VueAxios, axios)
Vue.use(VueMsalPlugin, environment.MSALSettings.config)

new Vue({
  router,
  store,
  render: h => h(App),
  created() {
    if(!this.msal.getAccount()) {
   
      this.msal.loginRedirect();
    }
    console.log(this.msal);
  }
}).$mount('#app')
