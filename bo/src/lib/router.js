import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '@/components/Home'
import SignIn from '@/components/SignIn'
import EditContest from '@/components/EditContest'
import Contests from '@/components/Contests'
import firebase from 'firebase'

Vue.use(VueRouter)
const router = new VueRouter({
  base: '/admin',
  mode: 'history',
  routes: [
    {
      path: '/',
      component: Home
    },
    {
      path: '/sign-in',
      component: SignIn
    },
    {
      path: '/edit-contest',
      component: EditContest,
      meta: {
        requiresAuth: true
      }
    },
    {
      path: '/contests',
      component: Contests,
      meta: {
        requiresAuth: true
      }
    }
  ]
})

router.beforeEach((to, from, next) => {
  if (!Vue.$config || Vue.$config.firebase.devMode) next()
  let currentUser = firebase.auth().currentUser
  let requiresAuth = to.matched.some(record => record.meta.requiresAuth)
  if (requiresAuth && !currentUser) {
    next('/')
  } else {
    next()
  }
})

export default router
