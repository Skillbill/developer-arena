import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '@/components/Home.vue'
import EditDates from '@/components/EditDates.vue'
import Contests from '@/components/Contests.vue'
import firebase from 'firebase'

Vue.use(VueRouter)
const router = new VueRouter({
  mode: 'history',
  routes: [
    {
      path: '/',
      component: Home
    },
    {
      path: '/edit-dates',
      component: EditDates
    },
    {
      path: '/contests',
      component: Contests
    }
  ]
})

router.beforeEach((to, from, next) => {
  let currentUser = firebase.auth().currentUser
  let requiresAuth = to.matched.some(record => record.meta.requiresAuth)
  if (requiresAuth && !currentUser) {
    next('/')
  } else {
    next()
  }
})

export default router
