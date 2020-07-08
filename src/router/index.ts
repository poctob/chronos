import Vue from 'vue'
import VueRouter, { RouteConfig } from 'vue-router'
import Sites from '../views/Sites.vue'

Vue.use(VueRouter)

  const routes: Array<RouteConfig> = [
  {
    path: '/',
    name: 'Sites',
    component: Sites
  }

]

const router = new VueRouter({
  routes
})

export default router