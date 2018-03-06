import Vue from 'vue'
import Router from 'vue-router'
import firebase from 'firebase'
import Home from '@/components/Home'
import SignUp from '@/components/SignUp'
import SubmitEntry from '@/components/SubmitEntry'

Vue.use(Router)

let router = new Router({
  routes: [
    {
      path: '/',
      name: 'Home',
      component: Home
    },
    {
      path: '/sign-up',
      name: 'sing-up',
      component: SignUp
    },
    {
      path: '/submit-entry',
      name: 'SubmitEntry',
      component: SubmitEntry,
      meta: {
        requiresAuth: true
      }
    }
  ]
})

router.beforeEach((to, from, next) => {
  let currentUser = firebase.auth().currentUser
  let requiresAuth = to.matched.some(record => record.meta.requiresAuth)

  if (requiresAuth && !currentUser) {
    next('sign-up')
  } else {
    next()
  }
})

export default router
