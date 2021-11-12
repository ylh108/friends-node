import Vue from 'vue'
import VueRouter, { RouteConfig } from 'vue-router'
import store from "@/store";

Vue.use(VueRouter)

const routes: Array<RouteConfig> = [
  {
    path: '/',
    name: 'Home',
    meta: { keepAlive: false, index: 1 },
    component: () => import('@/views/home/index.vue')
  },
  {
    path: '/register',
    name: 'register',
    meta: { keepAlive: false, index: 2 },
    component: () => import('@/views/register/index.vue')
  },
  {
    path: '/update',
    name: 'update',
    meta: { keepAlive: false, index: 2 },
    component: () => import('@/views/register/index.vue')
  },
  {
    path: '/detail',
    name: 'detail',
    meta: { keepAlive: false, index: 3 },
    component: () => import('@/views/detail/index.vue')
  },
  {
    path: '/login',
    name: 'login',
    meta: { keepAlive: false, index: 4 },
    component: () => import('@/views/login/index.vue')
  },
  // {
  //   path: '/list',
  //   name: 'list',
  //   meta: { keepAlive: false, index: 2 },
  //   component: () => import('@/views/list/index.vue')
  // },
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

// 路由拦截器
router.beforeEach((to: any, from: any, next: any) => {
  // 路由切换动画 begin
  if (!from.meta.index) {
    store.commit("SET_TRANSITIONNAME", "slide-left");
  } else if (to.meta.index > from.meta.index) {
    store.commit("SET_TRANSITIONNAME", "slide-left");
  } else {
    store.commit("SET_TRANSITIONNAME", "slide-right");
  }
  // 路由切换动画 end
  next();
});

export default router
