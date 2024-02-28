import { createRouter, createWebHistory } from 'vue-router'

const routes = [
  {
    path: '/:catchAll(.*)',
    name: 'NotFound',
    title: '404 NotFound',
    component: ()=> import('@/views/404.vue')
  }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router
